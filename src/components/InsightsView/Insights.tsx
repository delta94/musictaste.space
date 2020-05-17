import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router'
import { SpotifyApiContext } from 'react-spotify-api'
import Spotify from 'spotify-web-api-js'
import { AuthContext } from '../../contexts/Auth'
import firebase from '../../util/Firebase'
import Navbar from '../Navbars/Navbar'
import CovidAnthem from './CovidAnthem'
import Genres from './InsightsGenres'
import Header from './InsightsHeader'
import Moods from './Moods'
import Obscurify from './Obscurify'
import TopArtists from './TopArtists'

const Insights = () => {
  const { currentUser, spotifyToken, userData } = useContext(AuthContext)
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [spotifyData, setSpotifyData] = useState({} as ISpotifyUserData)
  const [artistData, setArtistData] = useState<SpotifyApi.ArtistObjectFull[]>(
    []
  )
  const [trackData, setTrackData] = useState<SpotifyApi.TrackObjectFull[]>([])
  const [featureTracks, setFeatureTracks] = useState(
    {} as {
      [key: string]: { track: SpotifyApi.TrackObjectFull; score: number }
    }
  )
  const [averages, setAverages] = useState(
    {} as { hasRegion: boolean; data: INationalAverage; stdDev: number }
  )
  useEffect(() => {
    if (Object.entries(userData).length > 0 && currentUser) {
      if (userData.importData && !userData.importData.exists) {
        history.push('/dashboard')
      }
      if (!Object.entries(spotifyData).length) {
        firebase.getSpotifyData(currentUser.uid).then((data) => {
          if (data) {
            setSpotifyData(data)
          }
        })
      }
    }
  })

  useEffect(() => {
    const importData = async () => {
      const s = new Spotify()
      s.setAccessToken(userData.accessToken)
      setArtistData(
        await s
          .getArtists(
            spotifyData.topArtistsShortTerm.slice(0, 6).map((a) => a.id)
          )
          .then((d) => d.artists)
          .catch(() => [])
      )
      if (spotifyData.topTracksShortTerm && spotifyData.topTracksMediumTerm) {
        const tSet = new Set()
        const tracks = Array.from({ length: 30 })
          .map((_, i) => {
            if (
              spotifyData.topTracksShortTerm.length > i &&
              spotifyData.topTracksMediumTerm.length > i
            ) {
              return [
                spotifyData.topTracksShortTerm[i].id,
                spotifyData.topTracksMediumTerm[i].id,
              ]
            } else if (spotifyData.topTracksShortTerm.length > i) {
              return [spotifyData.topTracksShortTerm[i].id]
            } else if (spotifyData.topTracksMediumTerm.length > i) {
              return [spotifyData.topTracksMediumTerm[i].id]
            }
            return []
          })
          .flat()
          .filter((t) => {
            if (tSet.has(t)) {
              return false
            } else {
              tSet.add(t)
              return true
            }
          })
          .slice(0, 40)
        setTrackData(
          await s
            .getTracks(
              tracks
                .filter(Boolean)
                .slice(0, 40)
                .map((a) => a)
            )
            .then((d) => d.tracks)
            .catch(() => [])
        )
      }

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
      if (!Object.entries(averages).length) {
        const avgData = await firebase.getAverages(region)
        setAverages(avgData)
      }

      setLoading(false)
      setLoaded(true)
    }

    if (Object.entries(spotifyData).length && !loading && !loaded) {
      setLoading(true)
      importData()
    }
  }, [spotifyData, loading, loaded, userData.accessToken, averages])

  return (
    <>
      <Navbar />
      <Helmet>
        <title>Insights - musictaste.space</title>
        <meta
          name="description"
          content="See your top artists, tracks, how obscure your music taste is and more! Sign in with Spotify to musictaste.space."
        />
        <meta name="keywords" content="spotify,music,match,insights" />
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
                <CovidAnthem tracks={trackData} artist={artistData[5]} />
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
