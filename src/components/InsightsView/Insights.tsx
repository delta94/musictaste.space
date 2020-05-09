import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { SpotifyApiContext } from 'react-spotify-api'
import Spotify from 'spotify-web-api-js'
import { AuthContext } from '../../contexts/Auth'
import firebase from '../Firebase'
import Navbar from '../Navbars/Navbar'
import Genres from './InsightsGenres'
import Header from './InsightsHeader'
import Moods from './Moods'
import Obscurify from './Obscurify'
import TopArtists from './TopArtists'

const Insights = (props: any) => {
  const { currentUser, spotifyToken, userData } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [spotifyData, setSpotifyData] = useState({} as ISpotifyUserData)
  const [artistData, setArtistData] = useState(
    [] as SpotifyApi.ArtistObjectFull[]
  )
  const [topTrackData, setTopTrackData] = useState(
    [] as SpotifyApi.TrackObjectFull[]
  )
  const [recentTrackData, setRecentTrackData] = useState(
    [] as SpotifyApi.TrackObjectFull[]
  )
  const [featureTracks, setFeatureTracks] = useState(
    {} as {
      [key: string]: { track: SpotifyApi.TrackObjectFull; score: number }
    }
  )
  const [averages, setAverages] = useState(
    {} as { hasRegion: boolean; data: INationalAverage }
  )
  useEffect(() => {
    if (Object.entries(userData).length > 0 && currentUser) {
      firebase.getSpotifyData(currentUser.uid).then((data) => {
        if (data) {
          setSpotifyData(data)
        }
      })
    }
  }, [currentUser, userData])

  useEffect(() => {
    const importData = async () => {
      const s = new Spotify()
      s.setAccessToken(userData.accessToken)
      setTopTrackData(
        await s
          .getTracks(spotifyData.topTracksLongTerm.slice(0, 5).map((t) => t.id))
          .then((d) => d.tracks)
          .catch(() => [])
      )
      setRecentTrackData(
        await s
          .getTracks(
            spotifyData.topTracksShortTerm.slice(0, 5).map((t) => t.id)
          )
          .then((d) => d.tracks)
          .catch(() => [])
      )
      setArtistData(
        await s
          .getArtists(
            spotifyData.topArtistsShortTerm.slice(0, 5).map((a) => a.id)
          )
          .then((d) => d.artists)
          .catch(() => [])
      )

      const extractedIds = Object.entries(
        spotifyData.shortTermAudioFeatures.maxVals
      ).map((t) => t[1][0])
      const td = await s
        .getTracks(extractedIds)
        .then((d) => d.tracks)
        .catch(() => [])
      if (td.length) {
        const maxVals = spotifyData.shortTermAudioFeatures.maxVals
        const data = {}
        Object.keys(maxVals).map(
          (key, index) =>
            // @ts-ignore
            (data[key] = { track: td[index], score: maxVals[key][1] })
        )
        setFeatureTracks(data)
      }
      const region = await s
        .getMe()
        .then((d) => (d.country ? d.country : 'world'))
        .catch(() => {
          window.location.reload(false)
          return 'world'
        })
      const avgData = await firebase.getAverages(region)
      setAverages(avgData)
      setLoading(false)
      setLoaded(true)
    }

    if (Object.entries(spotifyData).length && !loading && !loaded) {
      setLoading(true)
      importData()
    }
  })

  return (
    <>
      <Navbar />
      <Helmet>
        <title>Insights - musictaste.space</title>
        <meta
          name="description"
          content=" Sign in with Spotify and import your data to discover your insights. See your top artists, tracks, how obscure your music taste is and more!"
        />
      </Helmet>
      <SpotifyApiContext.Provider value={spotifyToken}>
        {Object.entries(spotifyData).length ? (
          <div className="insights">
            <Header
              spotifyData={spotifyData}
              userData={userData}
              showMenu={false}
            />
            {spotifyData.obscurifyScoreLongTerm ? (
              <>
                <TopArtists artists={artistData} loaded={loaded} />
                <Moods
                  features={spotifyData.shortTermAudioFeatures}
                  loaded={loaded}
                  tracks={featureTracks}
                  averages={averages}
                />
                <Obscurify
                  score={spotifyData.obscurifyScoreLongTerm}
                  average={averages}
                />
                <Genres genreData={spotifyData.topGenres} />
              </>
            ) : (
              <div className="col d-flex flex-row justify-content-center mt-5 mb-5 loading text-center">
                Please (re-)import your data!
              </div>
            )}
          </div>
        ) : (
          <div
            style={{ height: '100vh', width: '100vw' }}
            className="container"
          >
            <div className="row w-100 h-100">
              <div className="col d-flex flex-column align-items-center justify-content-center">
                {!currentUser
                  ? 'Please sign in to import your data to discover your insights.'
                  : userData &&
                    userData.importData &&
                    userData.importData.exists
                  ? ''
                  : 'Please log in to discover your Spotify insights.'}
              </div>
            </div>
          </div>
        )}
      </SpotifyApiContext.Provider>
    </>
  )
}

export default Insights
