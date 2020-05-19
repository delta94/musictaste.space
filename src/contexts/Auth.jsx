import React, { useEffect, useState, useRef } from 'react'
import firebase from '../util/Firebase'
import SpotifyWebApi from 'spotify-web-api-js'
import GoogleAnalytics from 'react-ga'
import { differenceInMinutes, differenceInSeconds } from 'date-fns'
import { useToasts } from 'react-toast-notifications'

export const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  useEffect(() => {
    firebase.app.auth().onAuthStateChanged(setCurrentUser)
  }, [])

  const { addToast } = useToasts()

  useEffect(() => {
    firebase.app
      .firestore()
      .collection('app')
      .doc('alert')
      .get()
      .then((d) => {
        if (d.exists) {
          const data = d.data()
          if (data?.limited) {
            addToast(
              <span>
                musictaste.space is handling too many requests right now!
                Spotify is rate limiting our API calls. Please try back later if
                you run into issues ❤️. Follow updates on my{' '}
                <a className="cool-link" href="https://www.twitter.com/_kalpal">
                  Twitter
                </a>
                .
              </span>,
              {
                appearance: 'error',
                autoDismiss: false,
              }
            )
          }
        }
      })
  }, [])

  const [spotifyToken, setSpotifyToken] = useState('')
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [uid, setUid] = useState(null)
  const [userData, setUserData] = useState({})
  const tokenRef = useRef(spotifyToken)
  const lastRefreshRef = useRef(lastRefresh)
  const uidRef = useRef(uid)
  const [lastRetry, setLastRetry] = useState(null)
  tokenRef.current = spotifyToken
  lastRefreshRef.current = lastRefresh
  uidRef.current = uid

  async function checkAccessToken(token, uid) {
    const sp = new SpotifyWebApi()
    sp.setAccessToken(token)
    return sp
      .getMe()
      .then(() => {
        return true
      })
      .catch(async () => {
        await firebase.refreshSpotifyToken(uid)
        return false
      })
  }

  useEffect(() => {
    let sub = () => {}
    if (currentUser) {
      GoogleAnalytics.set({ userId: currentUser.uid })
      sub = firebase.app
        .firestore()
        .collection('users')
        .doc(currentUser.uid)
        .onSnapshot((doc) => {
          const source = doc.metadata.hasPendingWrites
          if (!source) {
            if (!lastRetry || differenceInSeconds(new Date(), lastRetry) > 15) {
              setLastRetry(new Date())
              checkAccessToken(doc.data().accessToken, currentUser.uid).then(
                (val) => {
                  if (val) {
                    setSpotifyToken(doc.data().accessToken)
                    setLastRefresh(doc.data().accessTokenRefresh.toDate())
                  } else {
                    setSpotifyToken(doc.data().accessToken)
                    setLastRefresh(doc.data().accessTokenRefresh.toDate())
                  }
                  setUid(doc.id)
                  setUserData(doc.data())
                }
              )
            }
          }
        })
    }
    return sub
  }, [currentUser])

  useEffect(() => {
    const ref = setInterval(() => {
      console.log(
        'checking token age:',
        differenceInMinutes(new Date(), lastRefreshRef.current)
      )
      if (differenceInMinutes(new Date(), lastRefreshRef.current) > 45) {
        firebase.refreshSpotifyToken(uidRef.current)
      }
    }, 60e3)
    return () => clearInterval(ref)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        spotifyToken,
        userData,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
