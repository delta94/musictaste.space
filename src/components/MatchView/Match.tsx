import qs from 'query-string'
import React, { useContext, useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import GoogleAnalytics from 'react-ga'
import { Helmet } from 'react-helmet'
import { useHistory, useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/Auth'
import useWindowSize from '../../hooks/useWindowSize'
import firebase from '../../util/Firebase'
import Navbar from '../Navbars/Navbar'
import ConfirmOrLoginButton from './ConfirmOrLoginButton'

const Match = () => {
  const history = useHistory()
  const location = useLocation()
  window.scrollTo(0, 0)
  const { currentUser, userData } = useContext(AuthContext)
  const [matchUser, setMatchUser] = useState<IUsersLookupData | undefined>(
    undefined
  )
  const [rematch, setRematch] = useState(false)
  const [matchCode, setMatchCode] = useState('')
  const query = qs.parse(location.search)
  const { width, height } = useWindowSize()
  if (
    !query.request ||
    query.request === userData.matchCode ||
    query.request === userData.anonMatchCode
  ) {
    history.push('/compatibility')
  }
  useEffect(() => {
    const getInfo = async (id: string) => {
      if (!matchUser) {
        const d = await firebase.getUserFromID(id)
        if (d) {
          setMatchUser(d)
        } else {
          history.push('/compatibility')
        }
      }
      const m = await firebase.userHasMatchForId(currentUser.uid, id)
      if (m) {
        const match = m as IPreviewMatchData
        if (
          match.matchDate.toDate() < userData.importData.lastImport.toDate()
        ) {
          setRematch(true)
          setMatchCode(match.matchId)
        } else {
          GoogleAnalytics.event({
            category: 'Interaction',
            action: 'Follow request link to existing match',
            label: 'Match Redirect',
          })
          history.push(`/match/${match.matchId}?r=1`)
        }
      }
    }
    const setDataOnly = async (id: string) => {
      if (!matchUser) {
        const d = await firebase.getUserFromID(id)
        if (d) {
          setMatchUser(d)
        }
      }
    }
    if (currentUser && query.request && Object.entries(userData).length) {
      if (!userData.importData || !userData.importData.exists) {
        localStorage.setItem('redirectMatch', query.request as string)
        localStorage.setItem('redirectMatchDate', new Date().toString())
        history.push(`/dashboard?callback=true&page=match&id=${query.request}`)
      } else {
        getInfo(query.request as string)
      }
    } else if (query.request) {
      setDataOnly(query.request as string)
    }
  })

  return (
    <>
      <Navbar />
      <Helmet>
        <title>
          Match with{' '}
          {matchUser
            ? matchUser.anon
              ? query.request
              : matchUser.displayName
            : query.request}{' '}
          - musictaste.space
        </title>
        <meta
          name="description"
          content="Accept your invite to match your music taste based on your Spotify data! \
          musicmatch.space is an app to help you see how compatible your music taste is with your friends."
        />
        <meta name="keywords" content="spotify,music,match,compatibility" />
      </Helmet>
      <div className="match main-div">
        {matchUser?.donor ? <Confetti width={width} height={height} /> : null}
        <div className="profile-container">
          {currentUser ? (
            <>
              <div className="user1 animated fadeInLeftBig">
                <div
                  className="profile-img-div"
                  style={{ backgroundImage: `url(${userData.photoURL})` }}
                />
              </div>

              <div className="user2 animated fadeInRightBig">
                {matchUser && matchUser.anon ? (
                  <div className="profile-img-div">
                    <i
                      className="fas fa-user-secret profile-img anon-profile"
                      aria-hidden="true"
                      style={{ color: '#130f40' }}
                    />
                  </div>
                ) : (
                  <>
                    <div
                      className="profile-img-div"
                      style={{
                        backgroundImage: `url(${
                          matchUser && matchUser.imageURL
                        })`,
                      }}
                    />
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              {matchUser ? (
                <>
                  <div className="user2 animated fadeInRightBig">
                    {matchUser.anon ? (
                      <div className="profile-img-div">
                        <i
                          className="fas fa-user-secret profile-img anon-profile"
                          aria-hidden="true"
                          style={{ color: '#130f40' }}
                        />
                      </div>
                    ) : (
                      <div
                        className="profile-img-div"
                        style={{
                          backgroundImage: `url(${matchUser.imageURL})`,
                        }}
                      />
                    )}
                  </div>
                </>
              ) : null}
            </>
          )}
        </div>
        <div className="confirm-text animated fadeInUp above-button">
          {currentUser ? (
            matchUser ? (
              <>
                <p>
                  You are{' '}
                  {rematch ? <strong>rematching</strong> : 'comparing tastes'}{' '}
                  with
                  {matchUser.anon ? ' anonymous user:' : ':'}
                </p>
                <p className="user-name">
                  {matchUser.anon ? query.request : matchUser.displayName}
                </p>
              </>
            ) : (
              <p>Loading...</p>
            )
          ) : matchUser ? (
            <>
              <p className="smaller-text">
                {matchUser.anon
                  ? 'Anonymous user ' + query.request
                  : matchUser.displayName}{' '}
                wants to know how compatible your music tastes are. Sign in with
                Spotify to get your own code and find out!
              </p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div className="start-button animated fadeInUp">
          <ConfirmOrLoginButton
            compareUser={query.request}
            anon={matchUser && matchUser.anon}
            rematch={{ rematch, matchCode }}
          />
        </div>
        <div className="confirm-text animated fadeInUp delay-4s">
          {matchUser?.donor ? (
            <p className="smaller-text" style={{ fontSize: '1em' }}>
              {matchUser.displayName} has supported musictaste.space by{' '}
              <a className="cool-link" href="https://ko-fi.com/kalpal">
                donating
              </a>{' '}
              to help keep the lights on. Simply amazing 🙌!
            </p>
          ) : null}
        </div>
        {rematch ? (
          <div
            style={{ marginTop: '10px' }}
            className="start-button animated fadeInUp"
          >
            <Link
              style={{
                cursor: 'pointer',
                paddingTop: '10px',
                borderBottom: '1px solid',
              }}
              to={`/match/${matchCode}`}
            >
              See previous match
            </Link>
          </div>
        ) : null}

        <div className="confirm-text below-button animated fadeInUp">
          {currentUser ? (
            matchUser ? (
              <>
                <p className="smaller-text">
                  {rematch
                    ? 'Since you are rematching with new data, your previous match will be overwritten.'
                    : matchUser.anon
                    ? 'Because this is an anonymous match, your profile will appear as ' +
                      userData.anonMatchCode +
                      '. Your name and profile photo are not shared.'
                    : "Your name and profile photo will be shared with the person you're matching with."}
                </p>
              </>
            ) : null
          ) : (
            <>
              <p className="smaller-text">
                Already signed in? You might need to open this link in Safari or
                Chrome.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Match
