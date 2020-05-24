/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router'
import { SpotifyApiContext } from 'react-spotify-api'
import Spotify from 'spotify-web-api-js'
import { AuthContext } from '../../contexts/Auth'
import { UserDataContext } from '../../contexts/UserData'
import firebase from '../../util/Firebase'
import Navbar from '../Navbars/Navbar'
import CovidAnthem from './CovidAnthem'
import Genres from './InsightsGenres'
import Header from './InsightsHeader'
import Moods from './Moods'
import Obscurify from './Obscurify'
import TopArtists from './TopArtists'

const Insights = () => {
  const { currentUser } = useContext(AuthContext)
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const { importData, spotifyToken, userData } = useContext(UserDataContext)
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
    if (userData && currentUser) {
      if (userData.importData && !userData.importData.exists) {
        history.push('/dashboard')
      }
    }
  })

  useEffect(() => {
    const loadData = async () => {
      if (userData && importData) {
        const s = new Spotify()
        s.setAccessToken(userData.accessToken)
        if (importData?.topArtistsShortTerm.length > 5) {
          setArtistData(
            await s
              .getArtists(
                importData?.topArtistsShortTerm.slice(0, 6).map((a) => a.id)
              )
              .then((d) => d.artists)
              .catch(() => [])
          )
        } else {
          setArtistData(
            await s
              .getArtists(
                importData.topArtistsLongTerm.slice(0, 6).map((a) => a.id)
              )
              .then((d) => d.artists)
              .catch(() => [])
          )
        }

        if (importData?.topTracksShortTerm && importData?.topTracksMediumTerm) {
          const tSet = new Set()
          const tracks = Array.from({ length: 30 })
            .map((_, i) => {
              if (
                importData?.topTracksShortTerm.length > i &&
                importData?.topTracksMediumTerm.length > i
              ) {
                return [
                  importData?.topTracksShortTerm[i].id,
                  importData?.topTracksMediumTerm[i].id,
                ]
              } else if (importData?.topTracksShortTerm.length > i) {
                return [importData?.topTracksShortTerm[i].id]
              } else if (importData?.topTracksMediumTerm.length > i) {
                return [importData?.topTracksMediumTerm[i].id]
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
          importData.shortTermAudioFeatures.maxVals
        ).map((t) => t[1][0])
        const td = await s
          .getTracks(extractedIds)
          .then((d) => d.tracks)
          .catch(() => [])
        if (td.length) {
          const maxVals = importData?.shortTermAudioFeatures.maxVals
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
            return 'world'
          })
        if (!Object.entries(averages).length) {
          const avgData = await firebase.getAverages(region)
          setAverages(avgData)
        }

        setLoading(false)
        setLoaded(true)
      }
    }

    if (importData && !loading && !loaded) {
      setLoading(true)
      loadData()
    }
  }, [importData, loading, loaded, userData, averages])

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
        {importData ? (
          <div className="insights">
            <Header
              spotifyData={importData as ISpotifyUserData}
              userData={userData as IUserProfile}
              showMenu={false}
            />
            {importData?.obscurifyScoreLongTerm ? (
              <>
                <TopArtists artists={artistData} loaded={loaded} />
                <CovidAnthem tracks={trackData} artist={artistData[5]} />
                <Moods
                  features={importData?.shortTermAudioFeatures}
                  loaded={loaded}
                  tracks={featureTracks}
                  averages={averages}
                />
                <Obscurify
                  score={importData?.obscurifyScoreLongTerm}
                  average={averages}
                />
                <Genres genreData={importData?.topGenres} />
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
