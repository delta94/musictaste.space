import React, { useContext, useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import GoogleAnalytics from 'react-ga'
import { Helmet } from 'react-helmet'
import { useHistory, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { AuthContext } from '../../contexts/Auth'
import { UserDataContext } from '../../contexts/UserData'
import useWindowSize from '../../hooks/useWindowSize'
import { getUserFromId } from '../../util/api'
import firebase from '../../util/Firebase'
import Navbar from '../Navbars/Navbar'
import ConfirmOrLoginButton from './ConfirmOrLoginButton'

let toasted = false

const Match = () => {
  const history = useHistory()
  window.scrollTo(0, 0)
  const { currentUser } = useContext(AuthContext)
  const { userData } = useContext(UserDataContext)
  const [matchUser, setMatchUser] = useState<IUsersLookupData | undefined>(
    undefined
  )
  const [rematch, setRematch] = useState(false)
  const [matchCode, setMatchCode] = useState('')
  const [matchChecked, setMatchChecked] = useState(false)
  const { width, height } = useWindowSize()
  const { matchId } = useParams()
  const { addToast } = useToasts()
  if (
    userData &&
    (!matchId ||
      matchId === userData.matchCode ||
      matchId === userData.anonMatchCode)
  ) {
    history.push('/compatibility')
  }
  useEffect(() => {
    const getInfo = async (id: string) => {
      if (!matchUser) {
        const d = await getUserFromId(id)
        if (d) {
          setMatchUser(d)
        } else {
          if (!toasted) {
            addToast(
              "Hmmmm, I couldn't find that user in my database. Ask them to check their code again!",
              { appearance: 'error', autoDismiss: true }
            )
            history.push('/compatibility')
            toasted = true
            return
          }
        }
      }
      if (userData && !matchChecked) {
        const m = await firebase.userHasMatchForId(currentUser?.uid || '', id)
        setMatchChecked(true)
        if (m) {
          const match = m as IPreviewMatchData
          if (
            userData.importData.lastImport &&
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
    }
    const setDataOnly = async (id: string) => {
      if (!matchUser) {
        const d = await getUserFromId(id)
        if (d) {
          setMatchUser(d)
        }
      }
    }
    if (currentUser && matchId && userData) {
      if (!userData.importData || !userData.importData.exists) {
        localStorage.setItem('redirectMatch', matchId as string)
        localStorage.setItem('redirectMatchDate', new Date().toString())
        history.push(`/dashboard?callback=true&page=match&id=${matchId}`)
      } else {
        getInfo(matchId as string)
      }
    } else if (matchId) {
      setDataOnly(matchId as string)
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
              ? matchId
              : matchUser.displayName
            : matchId}{' '}
          - musictaste.space
        </title>
        <meta
          name="description"
          content="Accept your invite to match your music taste based on your Spotify data! \
          musicmatch.space is an app to help you see how compatible your music taste is with your friends."
        />
        <meta
          name="og:title"
          content={
            'Match with ' +
            (matchUser
              ? matchUser?.anon
                ? matchId
                : matchUser?.displayName
              : matchId) +
            ' - musictaste.space'
          }
        />
        <meta
          name="og:description"
          content={`Accept ${
            matchUser
              ? matchUser.anon
                ? matchId
                : matchUser.displayName
              : 'this cool person'
          }'s invite to match your music taste based on your Spotify data!`}
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
                  style={{
                    backgroundImage: `url(${
                      userData ? userData.photoURL : ''
                    })`,
                  }}
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
                  {matchUser.anon ? matchId : matchUser.displayName}
                </p>
              </>
            ) : (
              <p>Loading...</p>
            )
          ) : matchUser ? (
            <>
              <p className="smaller-text">
                {matchUser.anon
                  ? 'Anonymous user ' + matchId
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
            compareUser={matchId}
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
          {currentUser && userData ? (
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
