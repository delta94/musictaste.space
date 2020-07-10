import format from 'date-fns/format'
import formatDistance from 'date-fns/formatDistance'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useContext, useEffect, useState } from 'react'
import GoogleAnalytics from 'react-ga'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { AuthContext } from '../../contexts/Auth'
import { UserDataContext } from '../../contexts/UserData'
import { clearStorage } from '../../util/clearLocalStorage'
import firebase from '../../util/Firebase'
import Footer from '../Footer'
import Navbar from '../Navbars/Navbar'

const Account = () => {
  const history = useHistory()
  const { addToast } = useToasts()

  const { userData, fromCache, forceRefresh } = useContext(UserDataContext)
  const { currentUser } = useContext(AuthContext)

  const [cacheCleared, setCacheCleared] = useState(false)

  const [deviceRegistered, setDeviceRegistered] = useState(false)
  const [viewDevices, setViewDevices] = useState(false)

  const [showDebug, setShowDebug] = useState(false)
  const clearCache = () => {
    clearStorage()
    addToast('Cache cleared 👍. Refresh the page.', { appearance: 'success' })
    setCacheCleared(true)
  }

  useEffect(() => {
    if (userData?.notificationTokens) {
      for (const device of userData.notificationTokens) {
        if (device.title === navigator.userAgent) {
          setDeviceRegistered(true)
        }
      }
    }
  }, [userData?.notificationTokens])

  const deleteAccount = () => {
    history.push('/account/delete')
    GoogleAnalytics.event({
      category: 'Account',
      label: 'Delete Account',
      action: 'Visited delete account page',
    })
  }

  const enableNotifications = async () => {
    if (currentUser && userData) {
      addToast(
        "Click the 'Allow' button on your window if it shows up to give permissions.",
        { appearance: 'info', autoDismiss: true }
      )
      await firebase
        .requestNotificationPermission(currentUser.uid)
        .then(() => {
          addToast('Awesome! Notifications are coming your way 💗.', {
            appearance: 'success',
            autoDismiss: true,
          })
          forceRefresh()
        })
        .catch((err) => {
          console.error(err)
          addToast(
            'Something went wrong. Please provide me with sufficient permissions to send you notifications.',
            { appearance: 'error', autoDismiss: true }
          )
        })
    }
  }

  const disableNotifications = async () => {
    if (currentUser && userData) {
      await firebase
        .disableNotifications(currentUser.uid)
        .then(() => {
          addToast('Notifications disabled. Your devices have been cleared.', {
            appearance: 'success',
            autoDismiss: true,
          })
          forceRefresh()
        })
        .catch((err) => {
          console.error(err)
          addToast('Something went wrong.', {
            appearance: 'error',
            autoDismiss: true,
          })
        })
    }
  }

  if (currentUser && userData) {
    return (
      <>
        <Navbar />
        <Helmet>
          <title>Account Settings - musictaste.space</title>
        </Helmet>
        <div className="container">
          <div className="account">
            <div className="title-div">
              <a id="my-account" className="title" href="#title">
                Account Settings
              </a>
            </div>
            <motion.div className="user row d-flex flex-row justify-content-center align-items-center mb-5">
              <div className="d-flex justify-content-center image-row">
                <div
                  className="profile-pic-div shadow-lg img-fluid"
                  style={{
                    backgroundImage: `url(${userData.photoURL})`,
                  }}
                />
              </div>
              <div className="col-md-5 profile-names d-flex flex-column justify-content-center">
                <p id="display-name">
                  {userData.displayName}{' '}
                  <span role="img" aria-label="wave">
                    👋
                  </span>
                </p>
              </div>
            </motion.div>
            <div className="account-container">
              <motion.div animate={true} className="row top">
                <div className="account-heading col-md-6">
                  <div className="heading-title">Notifications</div>
                  <div className="heading-description">
                    Get notified when someone matches with you or something
                    exciting happens.
                  </div>
                </div>
                <div className="col-md-6 d-flex flex-column justify-content-center column-border">
                  {userData.notifications ? (
                    <>
                      <motion.button
                        animate={true}
                        onClick={disableNotifications}
                        className="do-button danger"
                      >
                        Disable Notifications
                      </motion.button>
                      {!deviceRegistered ? (
                        <motion.button
                          animate={true}
                          onClick={disableNotifications}
                          className="do-button good-muted"
                        >
                          Register This Device
                        </motion.button>
                      ) : null}

                      <p className="text-center m1">
                        Number of devices subscribed:{' '}
                        <strong>{userData.notificationTokens?.length}</strong>.
                        (
                        <span
                          className="view-hide"
                          onClick={() => setViewDevices(!viewDevices)}
                        >
                          {viewDevices ? 'hide' : 'show'}
                        </span>
                        )
                      </p>
                      {viewDevices ? (
                        <>
                          <ul>
                            {userData.notificationTokens?.map((device, i) => (
                              <li key={i}>
                                {device.title}
                                <br />
                                <em>
                                  Added{' '}
                                  {formatDistance(
                                    device.dateCreated.toDate(),
                                    new Date()
                                  )}{' '}
                                  ago.
                                </em>
                              </li>
                            ))}
                          </ul>
                          <p className="text-center">
                            Disable notifications to clear the above device
                            list. Clear the cache to update device list to see
                            new devices.
                          </p>
                        </>
                      ) : null}
                    </>
                  ) : (
                    <motion.button
                      animate={true}
                      onClick={enableNotifications}
                      className="do-button good"
                    >
                      Enable Notifications
                    </motion.button>
                  )}
                </div>
              </motion.div>

              <motion.div animate={true} className="row">
                <div className="account-heading col-md-6">
                  <div className="heading-title">Cache</div>
                  <div className="heading-description">
                    Clear the local storage cache to fetch your matches again if
                    things don't look quite right.
                  </div>
                </div>
                <div className="col-md-6 d-flex flex-column justify-content-center column-border">
                  <AnimatePresence>
                    {!cacheCleared && fromCache ? (
                      <motion.button
                        animate={true}
                        onClick={clearCache}
                        className="do-button neutral"
                        key="data"
                      >
                        Clear Cache
                      </motion.button>
                    ) : null}
                    <motion.p
                      animate={true}
                      className="data m-1 text-center"
                      key="title"
                    >
                      The cache is{' '}
                      {cacheCleared
                        ? 'cleared'
                        : fromCache
                        ? `${formatDistance(fromCache, new Date())} old`
                        : 'fresh'}
                      .
                    </motion.p>
                  </AnimatePresence>
                </div>
              </motion.div>
              <motion.div animate={true} className="row">
                <div className="account-heading col-md-6">
                  <div className="heading-title">Discord</div>
                  <div className="heading-description">
                    Link your Discord account to use the musictaste.space bot on
                    servers.
                  </div>
                </div>
                <div className="col-md-6 d-flex flex-column justify-content-center column-border">
                  <motion.button
                    animate={true}
                    onClick={() => history.push('/discord')}
                    className="do-button neutral"
                  >
                    {userData.discord
                      ? 'Manage Discord'
                      : 'Link A Discord Account'}
                  </motion.button>
                  <div className="d-flex justify-content-center">
                    {userData.discord ? (
                      <div className="discord-profile d-flex flex-row align-items-center column-border">
                        <div>
                          <div className="discord-circle" />
                          <div
                            className="discord-picture profile-img-div"
                            style={{
                              backgroundImage: `url(https://cdn.discordapp.com/avatars/${userData.discord.id}/${userData.discord.avatar}.png)`,
                            }}
                          />
                        </div>
                        <div className="username">
                          {`${userData.discord.username}#${userData.discord.discriminator}`}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </motion.div>
              <motion.div animate={true} className="row">
                <div className="account-heading col-md-6">
                  <div className="heading-title">Debug Info</div>
                  <div className="heading-description">
                    Some useful debug information for people who know what
                    they're doing. Or sending screenshots to me!
                  </div>
                </div>
                <div className="col-md-6 d-flex flex-column justify-content-center column-border debug">
                  <button
                    onClick={() => setShowDebug(!showDebug)}
                    className="do-button neutral"
                  >
                    {showDebug ? (
                      <span>
                        Hide{' '}
                        <span role="img" aria-label="monkey-eyes-shut">
                          🙈
                        </span>
                      </span>
                    ) : (
                      <span>
                        Show{' '}
                        <span role="img" aria-label="monkey-eyes-open">
                          🙉
                        </span>
                      </span>
                    )}
                  </button>
                  {showDebug ? (
                    <>
                      <p>
                        <strong>User ID</strong>
                        <br />
                        {currentUser.uid}
                      </p>
                      <div className="row">
                        <div className="col-6">
                          <p>
                            <strong>Match Code</strong>
                            <br />
                            {userData.matchCode}
                          </p>
                        </div>
                        <div className="col-6">
                          <p>
                            <strong>Anon Code</strong>
                            <br />
                            {userData.anonMatchCode}
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <p>
                            <strong>Cached Time</strong>
                            <br />
                            {fromCache
                              ? formatDistance(fromCache, new Date())
                              : '-'}
                          </p>
                        </div>
                        <div className="col-6">
                          <p>
                            <strong>Spotify Token Age</strong>
                            <br />
                            {userData.accessTokenRefresh &&
                              formatDistance(
                                userData.accessTokenRefresh.toDate(),
                                new Date()
                              )}
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <p>
                            <strong>Last Data Import</strong>
                            <br />
                            {userData.accessTokenRefresh &&
                              formatDistance(
                                userData.accessTokenRefresh.toDate(),
                                new Date()
                              )}
                          </p>
                        </div>
                        <div className="col-6">
                          <p>
                            <strong>Account Creation Date</strong>
                            <br />
                            {userData.created
                              ? format(userData.created.toDate(), 'd MMMM yy')
                              : 'Legacy Account'}
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <p>
                            <strong>Discord User</strong>
                            <br />
                            {userData.discord ? userData.discord.id : '-'}
                          </p>
                        </div>
                        <div className="col-6">
                          <p>
                            <strong>Current Build</strong>
                            <br />
                            {process.env.VERCEL_GITHUB_COMMIT_SHA
                              ? process.env.VERCEL_GITHUB_COMMIT_SHA.slice(0, 6)
                              : 'unknown'}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </motion.div>
              <motion.div animate={true} className="row">
                <div className="account-heading col-md-6">
                  <div className="heading-title">Delete Account</div>
                  <div className="heading-description">
                    Remove your musictaste.space account and make your data and
                    matches poof into thin air.
                  </div>
                </div>
                <div className="col-md-6 d-flex flex-column justify-content-center column-border">
                  <button onClick={deleteAccount} className="do-button danger">
                    Delete Account
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  } else {
    return (
      <>
        <Navbar />
        <Helmet>
          <title>Account Settings - musictaste.space</title>
        </Helmet>
        <div className="container">
          <div className="account">
            <div className="title-div">
              <a id="your-code" className="title" href="#your-code">
                Account Settings
              </a>
            </div>
            <div style={{ height: '185px' }} />
            <div className="account-container loading" />
          </div>
        </div>
        <Footer />
      </>
    )
  }
}

export default Account
