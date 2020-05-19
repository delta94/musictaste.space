import React, { useEffect, useState, useRef } from 'react'
import firebase from '../util/Firebase'
// import SpotifyWebApi from 'spotify-web-api-js'
import GoogleAnalytics from 'react-ga'
import { differenceInMinutes } from 'date-fns'
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
                you run into issues{' '}
                <span role="img" aria-label="heart">
                  ❤️
                </span>
                . Follow updates on my{' '}
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
  }, [addToast])

  const [spotifyToken, setSpotifyToken] = useState('')
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [uid, setUid] = useState(null)
  const [userData, setUserData] = useState({})
  const tokenRef = useRef(spotifyToken)
  const lastRefreshRef = useRef(lastRefresh)
  const uidRef = useRef(uid)
  tokenRef.current = spotifyToken
  lastRefreshRef.current = lastRefresh
  uidRef.current = uid

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
            setSpotifyToken(doc.data().accessToken)
            setLastRefresh(doc.data().accessTokenRefresh.toDate())
            setUid(doc.id)
            setUserData(doc.data())
          }
        })
    }
    return sub
  }, [currentUser])

  useEffect(() => {
    // async function checkAccessToken(token, uid) {
    //   const sp = new SpotifyWebApi()
    //   sp.setAccessToken(token)
    //   return sp
    //     .getMe()
    //     .then(() => {
    //       return true
    //     })
    //     .catch(async () => {
    //       await firebase.refreshSpotifyToken(uid)
    //       return false
    //     })
    // }
    if (differenceInMinutes(new Date(), lastRefreshRef.current) > 30) {
      firebase.refreshSpotifyToken(uidRef.current)
    }
    const ref = setInterval(() => {
      if (differenceInMinutes(new Date(), lastRefreshRef.current) > 45) {
        firebase.refreshSpotifyToken(uidRef.current)
      }
    }, 30e3)
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
