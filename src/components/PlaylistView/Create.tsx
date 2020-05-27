import { firestore } from 'firebase/app'
import cloneDeep from 'lodash/cloneDeep'
import qs from 'query-string'
import React, { useContext, useEffect, useState } from 'react'
import GoogleAnalytics from 'react-ga'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { SpotifyApiContext } from 'react-spotify-api'
import { Button } from 'reactstrap'
import Spotify from 'spotify-web-api-js'
import { AuthContext } from '../../contexts/Auth'
import { UserDataContext } from '../../contexts/UserData'
import { clearMatchStorage } from '../../util/clearLocalStorage'
import firebase from '../../util/Firebase'
import {
  decryptArray,
  encryptArray,
  getFromObject,
  setIntoObject,
} from '../../util/fromObjectInLocalStorage'
import { Dot } from '../Aux/Dot'
import Navbar from '../Navbars/Navbar'
import Canvas from './Canvas'
import CreatePlaylistButton from './CreatePlaylistButton'

const _log = (matchId: string) => (
  ...rest: Array<string | number | object>
) => {
  console.log(`[MATCH 🤝] ${matchId}:`, ...rest)
}

const Create = () => {
  window.scrollTo(0, 0)
  const { currentUser } = useContext(AuthContext)
  const { spotifyToken, userData } = useContext(UserDataContext)
  const [matchUser, setMatchUser] = useState<null | IPreviewMatchData>(null)
  const [matchUserId, setMatchUserId] = useState('')
  const [artistImage, setArtistImage] = useState({
    url: '',
    height: 0,
    width: 0,
  })
  const [matchData, setMatchData] = useState<null | IMatchData>(null)
  const { matchId } = useParams()
  const [playlistImage, setPlaylistImage] = useState('')
  const [error, setError] = useState({ state: false, message: '' })
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const query = qs.parse(location.search)
  const history = useHistory()
  const [isLSData, setIsLSData] = useState(false)

  async function createPlaylist(): Promise<{
    success: boolean
    uri?: string | undefined
    error?: {} | undefined
  }> {
    if (!userData) {
      return { success: false }
    }
    const s = new Spotify()
    let playlistError = {}
    s.setAccessToken(userData.accessToken)
    const res = await firebase
      .generatePlaylist(
        matchId as string,
        currentUser?.uid || '',
        userData.serverState
      )
      .catch((err) => (playlistError = err))
    if (res.success && res.tracks && matchUser) {
      const d = (await s
        .createPlaylist(userData.spotifyID, {
          name: `${matchUser.anon ? matchUserId : matchUser.displayName} × ${
            userData.displayName
          }`,
          description: `A special playlist just for ${
            userData.displayName
          } and ${
            matchUser.anon ? matchUserId : matchUser.displayName
          }, made on musictaste.space.`,
        })
        .then((res) => res)
        .catch(() => {
          setLoading(false)
          setError({
            state: true,
            message:
              'There was an error making the playlist. You might need to log in again to grant more permissions.',
          })
          return false
        })) as { id: string }
      if (!d.id) {
        return {
          success: false,
          error: 'Spotify could not create the playlist. Please try again.',
        }
      }
      await s.uploadCustomPlaylistCoverImage(d.id, playlistImage)
      let tracks = { total: 0 }
      s.addTracksToPlaylist(d.id, res.tracks.slice(0, 50))
      const playlistData = await s
        .getPlaylist(d.id)
        .catch((err) => (playlistError = err))
      tracks = await s
        .getPlaylistTracks(d.id)
        .catch((err) => (playlistError = err))
      if (tracks.total !== 0) {
        firebase
          .createPlaylistInUser(
            currentUser?.uid || '',
            matchUserId,
            d.id,
            playlistData
          )
          .catch()
        GoogleAnalytics.event({
          category: 'Interaction',
          label: 'Create Playlist',
          action: 'Created a collaborative playlist with match user.',
        })
        return {
          success: true,
          uri: (playlistData as SpotifyApi.PlaylistObjectFull).external_urls
            .spotify,
        }
      }
      return { success: false, error: playlistError }
    }
    setError({
      state: true,
      message: JSON.stringify(playlistError),
    })
    return { success: false, error: playlistError }
  }

  useEffect(() => {
    const getMatchData = async (id: string) => {
      const d = await firebase.getMatch(id)
      if (!d) {
        setError({
          state: true,
          message:
            "You don't have access to this match or the match does not exist.",
        })
      } else {
        setMatchData(d)
        const matchUser = await firebase.userHasMatchForMatchId(
          currentUser?.uid as string,
          id
        )
        if (matchUser.data && matchUser.id) {
          setMatchUserId(matchUser.id)
          setMatchUser(matchUser.data)
        }
      }
      setLoading(false)
      return d
    }
    const getPlaylistImage = async (data: IMatchData) => {
      if (!userData) {
        return false
      }
      const s = new Spotify()
      s.setAccessToken(userData.accessToken)
      s.getArtist(
        data.matchedArtists[
          Math.floor(Math.random() * data.matchedArtists.length)
        ].id
      ).then((res) => {
        if (res) {
          setArtistImage({ ...res.images[0] } as any)
        }
      })
    }
    if (currentUser && matchId && userData) {
      const _consoleLog = _log(matchId)
      const matchStr = getFromObject('matches')(matchId)
      if (matchStr && !query.cc) {
        try {
          const match = JSON.parse(matchStr)
          match.matchDate = firestore.Timestamp.fromDate(
            new Date(match.matchDate)
          )
          match.users = decryptArray(match.users)
          setMatchUser(JSON.parse(match.matchUser))
          setMatchUserId(match.matchUserId)
          setMatchData(match)
          getPlaylistImage(match)
          setIsLSData(true)
          _consoleLog('loaded match from local storage.')
          GoogleAnalytics.event({
            category: 'Cache',
            label: 'Loaded Cached Match',
            action: 'Loaded a cached match from local storage',
          })
        } catch (e) {
          _consoleLog('error with cache')
          clearMatchStorage()
          _consoleLog('pulling match data from database.')
          getMatchData(matchId).then((s) => {
            if (s) {
              getPlaylistImage(s)
            }
          })
        }
      } else {
        if (query.cc) {
          _consoleLog('force pulling match data from database.')
        } else {
          _consoleLog('pulling match data from database.')
        }
        getMatchData(matchId).then((s) => {
          if (s) {
            getPlaylistImage(s)
          }
        })
      }
      setLoading(false)
    }
  }, [currentUser, matchId, userData, query.cc])
  let topTracks: IMatchedSpotifyPoint[] = []
  if (matchData) {
    topTracks = matchData.matchedTracksLongTerm
      .concat(matchData.matchedTracksMediumTerm)
      .concat(matchData.matchedTracksShortTerm)
  }

  useEffect(() => {
    if (!isLSData && matchUser && matchUserId && matchData && matchId) {
      const md = cloneDeep(matchData) as any
      md.matchUser = JSON.stringify(matchUser)
      md.matchUserId = matchUserId
      md.matchDate = md.matchDate.toDate().toISOString()
      md.users = encryptArray(matchData.users)
      const mdStr = JSON.stringify(md)
      setIntoObject('matches')(matchId, mdStr)
      _log(matchId)('stored match data in local storage.')
    }
  }, [matchUser, matchUserId, matchData, matchId, isLSData])

  return (
    <>
      <SpotifyApiContext.Provider value={spotifyToken}>
        <Navbar />
        {loading ? (
          <div className="coming-soon" style={{ display: 'flex' }}>
            <Dot>.</Dot>
            <Dot>.</Dot>
            <Dot>.</Dot>
          </div>
        ) : (
          <div className="playlist-container animated fadeInUp">
            {topTracks.length && matchUser ? (
              <div className="playlist">
                {artistImage.url !== '' ? (
                  <Canvas
                    text="Hello world!"
                    image={artistImage}
                    setPlaylistImage={setPlaylistImage}
                  />
                ) : null}
                <div className="playlist-names">
                  {matchUser.anon ? matchUserId : matchUser.displayName} ×{' '}
                  {userData ? userData.displayName : '...'}
                </div>
                <CreatePlaylistButton createPlaylist={createPlaylist} />
                <p style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <Link
                    to={
                      query.from === 'match' ? `/match/${matchId}` : '/playlist'
                    }
                    className="underline"
                  >
                    {query.from ? 'Back To Match' : 'Back To Playlists'}
                  </Link>
                </p>
                <div className="description">
                  These playlists are based on your top tracks, shared artists,
                  and shared genres. It&apos;s a collection of songs that you
                  can both jam to in the car, or use to get to know each other
                  better. Depending on how high your score was, playlists can be
                  generated multiple times.
                </div>
              </div>
            ) : (
              <div className="error">
                Oops. We need some top tracks in common to create a playlist.
                <br />
                <Button
                  className="mt-3 btn-round sign-in-button"
                  size="sm"
                  onClick={() => history.goBack()}
                >
                  Go back
                </Button>
              </div>
            )}
            <div className="error">{error.message}</div>
          </div>
        )}
      </SpotifyApiContext.Provider>
    </>
  )
}

export default Create
