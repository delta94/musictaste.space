import React, { useEffect, useState } from 'react'
import firebase from '../components/Firebase'
import SpotifyWebApi from 'spotify-web-api-js'

export const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  useEffect(() => {
    firebase.app.auth().onAuthStateChanged(setCurrentUser)
  }, [])

  const [spotifyToken, setSpotifyToken] = useState('')
  const [userData, setUserData] = useState({})
  useEffect(() => {
    let sub = () => {}
    if (currentUser) {
    sub = firebase.app
      .firestore()
      .collection('users')
      .doc(currentUser.uid)
      .onSnapshot(doc => {
        const source = doc.metadata.hasPendingWrites
        if (!source) {
          checkAccessToken(doc.data().accessToken, currentUser.uid).then(val => val ? setSpotifyToken(doc.data().accessToken) : null)
          setUserData(doc.data())
        }
      })
    }
    return sub
  }, [currentUser])


  return (
    <AuthContext.Provider
      value={{
        currentUser,
        spotifyToken,
        userData
      }}
    >
      {' '}
      {children}{' '}
    </AuthContext.Provider>
  )
}


async function checkAccessToken(token, uid) {
  const sp = new SpotifyWebApi()
  sp.setAccessToken(token)
  return sp.getMe().then(_ => true).catch(async _ => await firebase.refreshSpotifyToken(uid) ? false: false)
}