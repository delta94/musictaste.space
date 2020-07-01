/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { differenceInHours, differenceInMinutes } from 'date-fns'
import { firestore } from 'firebase/app'
import cloneDeep from 'lodash/cloneDeep'
import React, { useContext, useEffect, useRef, useState } from 'react'
import GoogleAnalytics from 'react-ga'
import SpotifyWebApi from 'spotify-web-api-js'
import firebase from '../util/Firebase'
import { AuthContext } from './Auth'

const _subHandle = (): void | null => null

const _cacheLog = (...rest: Array<string | number | object>) => {
  console.log(`[CACHE 🙆‍♂️]:`, ...rest)
}

const _spotifyLog = (...rest: Array<string | number | object>) => {
  console.log(`[SPOTIFY 🎶]:`, ...rest)
}

const _firestoreLog = (...rest: Array<string | number | object>) => {
  console.log(`[FIRESTORE 🔥]:`, ...rest)
}

export const UserDataContext = React.createContext<{
  spotifyToken: string
  userData: IUserProfile | null
  importData: ISpotifyUserData | null
  fromCache: null | Date
  startSub: () => void | null
  endSub: () => void | null
  forceRefresh: () => Promise<void> | null
  subExists: boolean
  importDataExists: boolean
}>({
  spotifyToken: '',
  userData: null,
  importData: null,
  fromCache: null,
  endSub: () => null,
  startSub: () => null,
  forceRefresh: () => null,
  subExists: false,
  importDataExists: true,
})

const toTimestamp = (time: firebase.firestore.Timestamp) => {
  return firestore.Timestamp.fromDate(
    // @ts-ignore
    new Date(time)
  ) as firebase.firestore.Timestamp
}

const toDateString = (time: firebase.firestore.Timestamp) => {
  return (time
    .toDate()
    .toISOString() as unknown) as firebase.firestore.Timestamp
}

export const UserDataProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { currentUser } = useContext(AuthContext)

  const [spotifyToken, setSpotifyToken] = useState('')
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [uid, setUid] = useState<string | null>(null)
  const [userData, setUserData] = useState<null | IUserProfile>(null)
  const [importData, setImportData] = useState<null | ISpotifyUserData>(null)
  const [subStarted, setSubStarted] = useState(false)
  const [fromCache, setFromCache] = useState<null | Date>(null)
  const [getMePassed, setGetMePassed] = useState(false)
  const [getMeTried, setGetMeTried] = useState(false)
  const [importDataExists, setImportDataExists] = useState(true)
  const [subbedThisSession, setSubbedThisSession] = useState(false)
  const subHandle = useRef(_subHandle)
  const tokenRef = useRef(spotifyToken)
  const lastRefreshRef = useRef(lastRefresh)
  const uidRef = useRef(uid)
  const getMePassedRef = useRef(getMePassed)

  subHandle.current = _subHandle
  tokenRef.current = spotifyToken

  uidRef.current = uid

  lastRefreshRef.current = lastRefresh

  getMePassedRef.current = getMePassed

  const forceRefresh = async () => {
    const data = await firebase.app
      .firestore()
      .collection('users')
      .doc(currentUser?.uid)
      .get()
      .then((d) => d.data() as IUserProfile)
    setUserData(data as IUserProfile)
    setSpotifyToken(data?.accessToken)
    setLastRefresh(data?.accessTokenRefresh.toDate())
    const ld = cloneDeep(data)
    ld.accessTokenRefresh = toDateString(ld.accessTokenRefresh)
    if (ld.importData?.lastImport) {
      ld.importData.lastImport = toDateString(ld.importData.lastImport)
    }
    if (ld.created) {
      ld.created = toDateString(ld.created)
    }
    localStorage.setItem('userProfile', JSON.stringify(ld))
    localStorage.setItem('profileLoaded', new Date().toISOString())
  }

  const startSub = () => {
    if (!subStarted) {
      const sub = firebase.app
        .firestore()
        .collection('users')
        .doc(currentUser?.uid || '')
        .onSnapshot((doc) => {
          const source = doc.metadata.hasPendingWrites
          if (!source && doc.exists) {
            const data = doc.data()
            setSpotifyToken(data?.accessToken)
            setLastRefresh(data?.accessTokenRefresh.toDate())
            setUserData(data as IUserProfile)
            const ld = cloneDeep(data) as IUserProfile
            ld.accessTokenRefresh = toDateString(ld.accessTokenRefresh)
            if (ld.importData?.lastImport) {
              ld.importData.lastImport = toDateString(ld.importData?.lastImport)
            }
            if (ld.created) {
              ld.created = toDateString(ld.created)
            }
            localStorage.setItem('userProfile', JSON.stringify(ld))
            localStorage.setItem('profileLoaded', new Date().toISOString())
          }
        })
      _firestoreLog('subscription started.')
      subHandle.current = sub
      setSubStarted(true)
      setSubbedThisSession(true)
    }
  }

  const endSub = () => {
    if (subStarted) {
      setSubStarted(false)
      subHandle.current()
      _firestoreLog('subscription ended.')
    }
  }

  useEffect(() => {
    if (currentUser && !userData && !subStarted && !subbedThisSession) {
      setUid(currentUser?.uid || '')
      // check local storage
      const ls: null | string = localStorage.getItem('userProfile')
      const pl: null | string = localStorage.getItem('profileLoaded')
      if (ls && pl) {
        const profileLoaded = new Date(pl)
        const localData: IUserProfile = JSON.parse(ls)
        if (
          profileLoaded &&
          differenceInHours(new Date(), profileLoaded) < 48 &&
          localData
        ) {
          _cacheLog('attempting to serve data from local storage.')
          localData.accessTokenRefresh = toTimestamp(
            localData.accessTokenRefresh
          )
          if (localData.importData?.lastImport) {
            localData.importData.lastImport = toTimestamp(
              localData.importData.lastImport
            )
          }
          if (localData.created) {
            localData.created = toTimestamp(localData.created)
          }
          setUserData(localData)
          setSpotifyToken(localData?.accessToken)
          setLastRefresh(localData.accessTokenRefresh.toDate())
          setFromCache(profileLoaded)
        } else {
          localStorage.removeItem('userProfile')
          localStorage.removeItem('profileLoaded')
          _cacheLog('stale data, pulled data from database.')
          firebase.app
            .firestore()
            .collection('users')
            .doc(currentUser?.uid || '')
            .get()
            .then((d) => {
              if (d.exists) {
                const data = d.data() as IUserProfile
                setUserData(data as IUserProfile)
                setSpotifyToken(data?.accessToken)
                setLastRefresh(data?.accessTokenRefresh.toDate())
                const ld = cloneDeep(data)
                ld.accessTokenRefresh = toDateString(ld.accessTokenRefresh)
                if (ld.importData?.lastImport) {
                  ld.importData.lastImport = toDateString(
                    ld.importData.lastImport
                  )
                }
                if (ld.created) {
                  ld.created = toDateString(ld.created)
                }
                localStorage.setItem('userProfile', JSON.stringify(ld))
                localStorage.setItem('profileLoaded', new Date().toISOString())
              }
              GoogleAnalytics.event({
                category: 'Cache',
                action: 'Pulled new data to refresh stale cache',
                label: 'Stale Cache',
              })
            })
        }
        GoogleAnalytics.set({ userId: currentUser?.uid || '' })
      } else {
        _firestoreLog('pulling new user data.')
        firebase.app
          .firestore()
          .collection('users')
          .doc(currentUser?.uid || '')
          .get()
          .then((d) => {
            if (d.exists) {
              const data = d.data() as IUserProfile
              setUserData(data as IUserProfile)
              setSpotifyToken(data?.accessToken)
              setLastRefresh(data?.accessTokenRefresh.toDate())
              const ld = cloneDeep(data)
              ld.accessTokenRefresh = toDateString(ld.accessTokenRefresh)
              if (ld.importData?.lastImport) {
                ld.importData.lastImport = toDateString(
                  ld.importData.lastImport
                )
              }
              if (ld.created) {
                ld.created = toDateString(ld.created)
              }
              localStorage.setItem('userProfile', JSON.stringify(ld))
              localStorage.setItem('profileLoaded', new Date().toISOString())
            }
          })
      }
    }
  }, [currentUser, userData, subStarted, subbedThisSession])

  useEffect(() => {
    if (
      currentUser &&
      userData &&
      userData?.importData?.exists &&
      !subStarted
    ) {
      const sd: null | string = localStorage.getItem('spotifyData')
      if (sd) {
        const spotifyData = JSON.parse(sd) as ISpotifyUserData
        spotifyData.importDate = firestore.Timestamp.fromDate(
          // @ts-ignore
          new Date(spotifyData.importDate)
        ) as firebase.firestore.Timestamp
        if (
          spotifyData.importDate &&
          userData.importData?.lastImport &&
          spotifyData.importDate.toDate() <
            userData.importData.lastImport.toDate()
        ) {
          _cacheLog('data stale. fetched fresh import data.')
          firebase.app
            .firestore()
            .collection('spotify')
            .doc(currentUser?.uid || '')
            .get()
            .then((d) => {
              if (d.exists) {
                setImportDataExists(true)
                const data = d.data() as ISpotifyUserData
                const ld = cloneDeep(data) as ISpotifyUserData
                // @ts-ignore
                ld.importDate = ld.importDate.toDate().toISOString()
                setImportData(ld as ISpotifyUserData)
                localStorage.setItem('spotifyData', JSON.stringify(ld))
              } else {
                setImportDataExists(false)
              }
            })
        } else {
          _cacheLog('using import data from local cache.')
          setImportData(spotifyData)
        }
      } else {
        _firestoreLog('fetched fresh import data.')
        firebase.app
          .firestore()
          .collection('spotify')
          .doc(currentUser?.uid || '')
          .get()
          .then((d) => {
            if (d.exists) {
              setImportDataExists(true)
              const data = d.data()
              const ld = cloneDeep(data) as ISpotifyUserData
              // @ts-ignore
              ld.importDate = ld.importDate.toDate().toISOString()
              setImportData(ld as ISpotifyUserData)
              localStorage.setItem('spotifyData', JSON.stringify(ld))
            } else {
              setImportDataExists(false)
            }
          })
      }
    }
  }, [userData, currentUser, subStarted])

  useEffect(() => {
    if (userData && !subStarted) {
      if (!getMeTried) {
        const s = new SpotifyWebApi()
        s.setAccessToken(userData.accessToken)
        _spotifyLog('checking local access token.')
        setGetMeTried(true)
        s.getMe()
          .then(() => {
            setSpotifyToken(userData.accessToken)
            setGetMePassed(true)
            _spotifyLog('passed.')
          })
          .catch(() => {
            _spotifyLog('token expired, checking database for updated token.')
            firebase.app
              .firestore()
              .collection('users')
              .doc(`spotify:${userData.spotifyID}`)
              .get()
              .then((d) => {
                const freshUserData = d.data() as IUserProfile
                s.setAccessToken(freshUserData.accessToken)
                s.getMe()
                  .then(() => {
                    setSpotifyToken(freshUserData.accessToken)
                    setLastRefresh(freshUserData.accessTokenRefresh.toDate())
                    setGetMePassed(true)
                    const ld = cloneDeep(freshUserData)
                    ld.accessTokenRefresh = toDateString(ld.accessTokenRefresh)
                    if (ld.importData?.lastImport) {
                      ld.importData.lastImport = toDateString(
                        ld.importData.lastImport
                      )
                    }
                    if (ld.created) {
                      ld.created = toDateString(ld.created)
                    }
                    localStorage.setItem('userProfile', JSON.stringify(ld))
                    setUserData({
                      ...freshUserData,
                    })
                    _spotifyLog('database token passed, no refresh needed.')
                  })
                  .catch(() => {
                    _spotifyLog('database token expired, minting new one.')
                    firebase
                      .refreshSpotifyToken(uidRef.current as string)
                      .then((token) => {
                        if (token) {
                          setGetMePassed(true)
                          setSpotifyToken(token)
                          setLastRefresh(new Date())
                          const ld = cloneDeep(userData)
                          ld.accessToken = token
                          ld.accessTokenRefresh = (new Date().toISOString() as unknown) as firebase.firestore.Timestamp
                          if (ld.importData?.lastImport) {
                            ld.importData.lastImport = toDateString(
                              ld.importData.lastImport
                            )
                          }
                          if (ld.created) {
                            ld.created = toDateString(ld.created)
                          }
                          localStorage.setItem(
                            'userProfile',
                            JSON.stringify(ld)
                          )
                          setUserData({
                            ...userData,
                            accessToken: token,
                            accessTokenRefresh: firestore.Timestamp.fromDate(
                              new Date()
                            ) as firebase.firestore.Timestamp,
                          })
                          GoogleAnalytics.event({
                            category: 'Cache',
                            action:
                              'Refreshed Spotify token into cache on load',
                            label: 'Cache New Token',
                          })
                          _spotifyLog('token refreshed.')
                        } else {
                          _spotifyLog(
                            'could not refresh token, is another tab open? will retry soon.'
                          )
                        }
                      })
                  })
              })
          })
      }
      const ref = setInterval(() => {
        if (
          !getMePassedRef.current ||
          differenceInMinutes(new Date(), lastRefreshRef.current) > 45
        ) {
          _spotifyLog('spotify token expired, attempting to refresh.')
          firebase
            .refreshSpotifyToken(uidRef.current as string)
            .then((token) => {
              if (token) {
                setSpotifyToken(token)
                setLastRefresh(new Date())
                const ld = cloneDeep(userData)
                ld.accessToken = token
                ld.accessTokenRefresh = (new Date().toISOString() as unknown) as firebase.firestore.Timestamp
                if (ld.importData?.lastImport) {
                  ld.importData.lastImport = toDateString(
                    ld.importData.lastImport
                  )
                }
                if (ld.created) {
                  ld.created = toDateString(ld.created)
                }
                localStorage.setItem('userProfile', JSON.stringify(ld))
                setUserData({
                  ...userData,
                  accessToken: token,
                  accessTokenRefresh: firestore.Timestamp.fromDate(
                    new Date()
                  ) as firebase.firestore.Timestamp,
                })
                _spotifyLog('token refreshed.')
                GoogleAnalytics.event({
                  category: 'Cache',
                  action: 'Refreshed Spotify token into cache on interval',
                  label: 'Cache New Token Interval',
                })
              }
            })
        }
      }, 60e3)
      return () => {
        clearInterval(ref)
      }
    }
  }, [userData, getMeTried, subStarted])

  return (
    <UserDataContext.Provider
      value={{
        spotifyToken,
        userData,
        importData,
        fromCache,
        startSub,
        endSub,
        forceRefresh,
        subExists: subStarted,
        importDataExists,
      }}
    >
      {children}
    </UserDataContext.Provider>
  )
}
