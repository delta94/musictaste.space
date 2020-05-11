import qs from 'query-string'
import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { AuthContext } from '../../contexts/Auth'
import firebase from '../../util/Firebase'
import Navbar from '../Navbars/Navbar'
import ConfirmOrLoginButton from './ConfirmOrLoginButton'

// @ts-ignore
const Match = ({ location, history }, ...props: any) => {
  window.scrollTo(0, 0)
  const { currentUser, userData } = useContext(AuthContext)
  const [matchUser, setMatchUser] = useState({} as IUsersLookupData)
  const [rematch, setRematch] = useState(false)
  const [matchCode, setMatchCode] = useState('')
  const query = qs.parse(location.search)
  if (
    !query.request ||
    query.request === userData.matchCode ||
    query.request === userData.anonMatchCode
  ) {
    history.push('/compatibility')
  }
  useEffect(() => {
    const getInfo = async (id: string) => {
      const d = await firebase.getUserFromID(id)
      if (d) {
        setMatchUser(d)
        const m = await firebase.userHasMatchForId(currentUser.uid, id)
        if (m) {
          const match = m as IPreviewMatchData
          if (
            match.matchDate.toDate() < userData.importData.lastImport.toDate()
          ) {
            setRematch(true)
            setMatchCode(match.matchId)
          } else {
            history.push('/match/' + match.matchId)
          }
        }
      } else {
        history.push('/compatibility')
      }
    }
    const setDataOnly = async (id: string) => {
      const d = await firebase.getUserFromID(id)
      if (d) {
        setMatchUser(d)
      }
    }
    if (currentUser && query.request && Object.entries(userData).length !== 0) {
      if (typeof userData.importData === 'undefined') {
        localStorage.setItem('redirectMatch', query.request as string)
        history.push(`/dashboard?callback=true&page=match&id=${query.request}`)
      } else {
        getInfo(query.request as string)
      }
    } else if (query.request) {
      setDataOnly(query.request as string)
    }
  }, [currentUser, userData])

  const onGoToMatch = (e: any) => {
    history.push(`/match/${matchCode}`)
  }
  return (
    <>
      <Navbar />
      <Helmet>
        <title>Match with {query.request} - musictaste.space</title>
        <meta
          name="description"
          content="Accept your invite to match your music taste based on your Spotify data! \
          musicmatch.space is an app to help you see how compatible your music taste is with your friends."
        />
        <meta name="keywords" content="spotify,music,match,compatibility" />
      </Helmet>
      <div className="match main-div">
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
                    style={{ backgroundImage: `url(${matchUser.imageURL})` }}
                  />
                )}
              </div>
            </>
          ) : (
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
                    style={{ backgroundImage: `url(${matchUser.imageURL})` }}
                  />
                )}
              </div>
            </>
          )}
        </div>
        <div className="confirm-text animated fadeInUp above-button">
          {currentUser ? (
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
            <>
              <p className="smaller-text">
                {matchUser.anon
                  ? 'Anonymous user ' + query.request
                  : matchUser.displayName}{' '}
                wants to know how compatible your music tastes are. Sign in with
                Spotify to get your own code and find out!
              </p>
            </>
          )}
        </div>
        <div className="start-button animated fadeInUp">
          <ConfirmOrLoginButton
            compareUser={query.request}
            anon={matchUser.anon}
            rematch={{ rematch, matchCode }}
          />
        </div>
        {rematch ? (
          <div
            style={{ marginTop: '10px' }}
            className="start-button animated fadeInUp"
          >
            <a
              style={{
                cursor: 'pointer',
                paddingTop: '10px',
                borderBottom: '1px solid',
              }}
              onClick={onGoToMatch}
            >
              See previous match
            </a>
          </div>
        ) : null}

        <div className="confirm-text below-button animated fadeInUp">
          {currentUser ? (
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
