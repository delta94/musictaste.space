import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SpotifyApiContext } from 'react-spotify-api'
import { AuthContext } from '../../contexts/Auth'
import firebase from '../Firebase'
import Navbar from '../Navbars/Navbar'
import Artists from './Artists'
import Genres from './Genres'
import Header from './Header'
import Tracks from './Tracks'
import Spotify from 'spotify-web-api-js'
// @ts-ignore
const Result = ({ location, history }, ...props: any) => {
  window.scrollTo(0, 0)
  const { currentUser, spotifyToken, userData } = useContext(AuthContext)
  const [matchUser, setMatchUser] = useState({} as IUsersLookupData)
  const [matchUserId, setMatchUserId] = useState('')
  const [matchData, setMatchData] = useState({} as IMatchData)
  const { matchId } = useParams()
  const [error, setError] = useState({ state: false, message: '' })

  const createPlaylist = async (e: any) => {
    const s = new Spotify()
    const res = await firebase.createPlaylist(
      matchId as string,
      currentUser.uid,
      userData.serverState
    )
    console.log(res)
    if (res.success && res.tracks) {
      const d = await s.createPlaylist(userData.spotifyID, {
        name: `${matchUser.displayName} × ${userData.displayName}`,
      })
      console.log(d)
      s.addTracksToPlaylist(d.id, res.tracks.slice(0, 50))
      window.open(d.external_urls.spotify)
    }
  }

  useEffect(() => {
    const getMatchData = async (id: string) => {
      const e = await firebase.userHasMatchForMatchId(currentUser.uid, id)
      if (e.exists) {
        const d = await firebase.getMatch(id)
        const u = await firebase.getUserFromID(e.id as string)
        setMatchUserId(e.id as string)
        if (u) {
          setMatchUser(u)
        }
        if (!d) {
          setError({
            state: true,
            message: 'Something went wrong retrieving this match.',
          })
        } else {
          setMatchData(d)
        }
      } else {
        setError({
          state: true,
          message:
            "You don't have access to this match or the match does not exist.",
        })
      }
    }
    if (currentUser && matchId) {
      getMatchData(matchId)
    }
  }, [currentUser, matchId])
  return (
    <>
      <SpotifyApiContext.Provider value={spotifyToken}>
        <Navbar />
        <div className="result">
          {currentUser && Object.entries(matchData).length !== 0 ? (
            <>
              <Header
                matchData={matchData}
                matchUser={matchUser}
                userData={userData ? userData : {}}
                matchUserId={matchUserId}
                createPlaylist={createPlaylist}
              />
              <Artists
                matchData={matchData}
                matchUser={matchUser}
                uid={currentUser.uid}
                matchUserId={matchUserId}
              />
              <Tracks
                matchData={matchData}
                matchUser={matchUser}
                uid={currentUser.uid}
                matchUserId={matchUserId}
              />
              <Genres history={history} matchData={matchData} />
            </>
          ) : (
            <div className="coming-soon">
              <div className="error">{error.message}</div>
            </div>
          )}
        </div>
      </SpotifyApiContext.Provider>
    </>
  )
}

export default Result
