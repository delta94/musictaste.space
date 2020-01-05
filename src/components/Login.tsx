import React from 'react'

import firebase from './Firebase'
const qs = require('query-string')

/**
 * This callback is called by the JSONP callback of the 'token' Firebase Function with the Firebase auth token.
 */
function tokenReceived(
  data: { token: string },
  history: { replace: (arg0: string) => void }
) {
  console.log('TOKEN RECEIVED.')
  if (data.token) {
    firebase.app
      .auth()
      .signInWithCustomToken(data.token)
      .then(() => {
        history.replace('/')
        // document.location.replace('/dashboard')
      })
  } else {
    console.error(data)
  }
}

//@ts-ignore
const Login = ({ location, history }, ...props) => {
  const query = qs.parse(location.search)
  const code = typeof query.code != 'undefined' ? query.code : undefined
  const state = typeof query.state != 'undefined' ? query.state : undefined
  const error = typeof query.error != 'undefined' ? query.state : undefined
  if (error) {
    return (
      <div>
        <p>{'Error back from the Spotify auth page: ' + error}</p>
      </div>
    )
  } else if (!code) {
    console.log(firebase.app.auth().currentUser)
    if (firebase.app.auth().currentUser) {
      history.replace('/dashboard')
      return <></>
    } else {
      // Start the auth flow.
      // window.location.replace('http://localhost:5001/spotify-compatibility/asia-northeast1/redirect')
      // window.location.replace('https://us-central1-' + getFirebaseProjectId() + '.cloudfunctions.net/redirect')
      window.location.replace(process.env.REACT_APP_FUNCTION_REDIRECT as string)
      return (
        <div className="spotify-login">
          <p className="spotify-login">Talking to Spotify...</p>
        </div>
      )
    }
  } else {
    // Use JSONP to load the 'token' Firebase Function to exchange the auth code against a Firebase custom token.
    // This is the URL to the HTTP triggered 'token' Firebase Function.
    // See https://firebase.google.com/docs/functions.
    // var tokenFunctionURL = 'https://us-central1-' + getFirebaseProjectId() + '.cloudfunctions.net/token';
    const tokenFunctionURL = process.env.REACT_APP_FUNCTION_TOKEN as string
    fetch(
      tokenFunctionURL +
        '?code=' +
        encodeURIComponent(code) +
        '&state=' +
        encodeURIComponent(state) +
        '&callback=' +
        tokenReceived.name,
      { credentials: 'include' }
    )
      .then(async res => {
        tokenReceived(await res.json(), history)
      })
      .catch(err => console.log(err))
    return (
      <div className="spotify-login">
        <p className="spotify-login">Talking to Spotify...</p>
      </div>
    )
  }
}

export default Login
