/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { differenceInHours, differenceInMinutes } from 'date-fns'
import { firestore } from 'firebase/app'
import cloneDeep from 'lodash/cloneDeep'
import React, { useContext, useEffect, useRef, useState } from 'react'
// import SpotifyWebApi from 'spotify-web-api-js'
import GoogleAnalytics from 'react-ga'
import firebase from '../util/Firebase'
import { AuthContext } from './Auth'

export const UserDataContext = React.createContext<{
  spotifyToken: string
  userData: IUserProfile | null
  importData: ISpotifyUserData | null
  fromCache: null | Date
  forceSub: () => void | null
}>({
  spotifyToken: '',
  userData: null,
  importData: null,
  fromCache: null,
  forceSub: () => null,
})

const toTimestamp = (time: FirebaseFirestore.Timestamp) => {
  return firestore.Timestamp.fromDate(
    // @ts-ignore
    new Date(time)
  ) as FirebaseFirestore.Timestamp
}

const toDateString = (time: FirebaseFirestore.Timestamp) => {
  return (time.toDate().toISOString() as unknown) as FirebaseFirestore.Timestamp
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
  const tokenRef = useRef(spotifyToken)
  const lastRefreshRef = useRef(lastRefresh)
  const uidRef = useRef(uid)

  useEffect(() => {
    tokenRef.current = spotifyToken
    uidRef.current = uid
    lastRefreshRef.current = lastRefresh
  }, [spotifyToken, lastRefresh, uid])

  const forceSub = () => {
    setUserData({
      ...userData,
      importData: {
        exists: false,
        loading: true,
        lastImport: firestore.Timestamp.fromDate(
          new Date()
        ) as FirebaseFirestore.Timestamp,
        status: {
          topTracks: false,
          topArtists: false,
          relatedArtists: false,
          genres: false,
          specialSauce: false,
        },
      },
    } as IUserProfile)
  }

  useEffect(() => {
    let sub: () => null | void = () => null

    if (currentUser && !userData) {
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
          console.log('attempting to serve data from local storage.')
          localData.accessTokenRefresh = toTimestamp(
            localData.accessTokenRefresh
          )
          if (localData.importData && localData.importData.lastImport) {
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
          console.log('stale data, pulled data from database.')
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
                if (ld.importData.lastImport) {
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
        GoogleAnalytics.set({ userId: currentUser?.uid || '' })
      } else {
        console.log('pulling new user data.')
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
              if (ld.importData.lastImport) {
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
    } else {
      // if data still needs to be imported, subscribe to document
      if (currentUser && !userData?.importData?.exists && !subStarted) {
        console.log('subscription began.')
        setSubStarted(true)
        sub = firebase.app
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
              if (ld.importData.lastImport) {
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
      } else if (userData?.importData?.exists && subStarted) {
        // finish subscription
        setSubStarted(false)
        console.log('subscription ended.')
        sub()
      }
    }
  }, [currentUser, userData, subStarted])

  useEffect(() => {
    if (currentUser && userData && userData.importData.exists) {
      const sd: null | string = localStorage.getItem('spotifyData')
      if (sd) {
        const spotifyData = JSON.parse(sd) as ISpotifyUserData
        spotifyData.importDate = firestore.Timestamp.fromDate(
          // @ts-ignore
          new Date(spotifyData.importDate)
        ) as FirebaseFirestore.Timestamp
        if (
          spotifyData.importDate &&
          userData.importData?.lastImport &&
          spotifyData.importDate.toDate() <
            userData.importData.lastImport.toDate()
        ) {
          console.log('data stale. fetched fresh import data.')
          firebase.app
            .firestore()
            .collection('spotify')
            .doc(currentUser?.uid || '')
            .get()
            .then((d) => {
              if (d.exists) {
                const data = d.data() as ISpotifyUserData
                const ld = cloneDeep(data) as ISpotifyUserData
                // @ts-ignore
                ld.importDate = ld.importDate.toDate().toISOString()
                setImportData(ld as ISpotifyUserData)
                localStorage.setItem('spotifyData', JSON.stringify(ld))
              }
            })
        } else {
          console.log('using import data from local cache.')
          setImportData(spotifyData)
        }
      } else {
        console.log('fetched fresh import data.')
        firebase.app
          .firestore()
          .collection('spotify')
          .doc(currentUser?.uid || '')
          .get()
          .then((d) => {
            if (d.exists) {
              const data = d.data()
              const ld = cloneDeep(data) as ISpotifyUserData
              // @ts-ignore
              ld.importDate = ld.importDate.toDate().toISOString()
              setImportData(ld as ISpotifyUserData)
              localStorage.setItem('spotifyData', JSON.stringify(ld))
            }
          })
      }
    }
  }, [userData, currentUser])

  useEffect(() => {
    if (userData) {
      if (differenceInMinutes(new Date(), lastRefreshRef.current) > 30) {
        console.log('spotify token expired, attempting to refresh.')
        firebase.refreshSpotifyToken(uidRef.current as string).then((token) => {
          if (token) {
            setSpotifyToken(token)
            setLastRefresh(new Date())
            const ld = cloneDeep(userData)
            ld.accessTokenRefresh = (new Date().toISOString() as unknown) as FirebaseFirestore.Timestamp
            if (ld.importData.lastImport) {
              ld.importData.lastImport = toDateString(ld.importData.lastImport)
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
              ) as FirebaseFirestore.Timestamp,
            })
            console.log('token refreshed.')
          }
        })
      } else {
        setSpotifyToken(userData.accessToken)
      }
      const ref = setInterval(() => {
        if (differenceInMinutes(new Date(), lastRefreshRef.current) > 45) {
          console.log('spotify token expired, attempting to refresh.')
          firebase
            .refreshSpotifyToken(uidRef.current as string)
            .then((token) => {
              if (token) {
                setSpotifyToken(token)
                setLastRefresh(new Date())
                const ld = cloneDeep(userData)
                ld.accessTokenRefresh = (new Date().toISOString() as unknown) as FirebaseFirestore.Timestamp
                if (ld.importData.lastImport) {
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
                  ) as FirebaseFirestore.Timestamp,
                })
                console.log('token refreshed.')
              }
            })
        }
      }, 60e3)
      return () => {
        clearInterval(ref)
      }
    }
  }, [userData, setLastRefresh])

  return (
    <UserDataContext.Provider
      value={{
        spotifyToken,
        userData,
        importData,
        fromCache,
        forceSub,
      }}
    >
      {children}
    </UserDataContext.Provider>
  )
}
