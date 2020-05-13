import React, { useContext, useEffect, useState } from 'react'
import GoogleAnalytics from 'react-ga'
import { useHistory, useParams } from 'react-router-dom'
import { SpotifyApiContext } from 'react-spotify-api'
import { AuthContext } from '../../contexts/Auth'
import firebase from '../../util/Firebase'
import Navbar from '../Navbars/Navbar'
import Artists from './Artists'
import Genres from './Genres'
import Header from './Header'
import Playlist from './Playlist'
import Tracks from './Tracks'

const Result = () => {
  const history = useHistory()
  window.scrollTo(0, 0)
  const { currentUser, spotifyToken, userData } = useContext(AuthContext)
  const [matchUser, setMatchUser] = useState({} as IUsersLookupData)
  const [matchUserId, setMatchUserId] = useState('')
  const [matchData, setMatchData] = useState({} as IMatchData)
  const { matchId } = useParams()
  const [error, setError] = useState({ state: false, message: <></> })

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
            message: <>Something went wrong retrieving this match.</>,
          })
        } else {
          setMatchData(d)
        }
      } else {
        if (matchId === 'false') {
          setError({
            state: true,
            message: (
              <>
                Oops, something went wrong with the match making bot. Try again,
                or if it's still not working, find me on{' '}
                <a href="https://www.twitter.com/_kalpal">Twitter</a>.
              </>
            ),
          })
        } else {
          setError({
            state: true,
            message: (
              <>
                You don't have access to this match or the match does not exist.
              </>
            ),
          })
        }
      }
    }
    if (currentUser && matchId) {
      getMatchData(matchId)
    }
  }, [currentUser, matchId])

  const handleClick = (e: any) => {
    GoogleAnalytics.event({
      category: 'Interaction',
      label: 'Visit Playlist',
      action: 'Visited create playlist page from match',
    })
    history.push('/playlist/' + matchId + '?from=match')
  }
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
              {matchData.score > 0.5 ? (
                <Playlist
                  token={userData.accessToken}
                  artistID={
                    matchData.matchedArtists[
                      Math.floor(
                        Math.random() * matchData.matchedArtists.length
                      )
                    ].id
                  }
                  matchName={
                    matchUser.anon
                      ? 'this mysterious person'
                      : matchUser.displayName
                  }
                  handleClick={handleClick}
                  profileImage={matchUser.imageURL}
                />
              ) : null}
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
