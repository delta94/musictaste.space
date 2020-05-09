import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory, useLocation } from 'react-router-dom'
import { Dot } from './Aux/Dot'
import firebase from './Firebase'
const qs = require('query-string')

const Login = (props: any) => {
  const history = useHistory()
  const location = useLocation()
  const query = qs.parse(location.search)
  const code = typeof query.code != 'undefined' ? query.code : undefined
  const state = typeof query.state != 'undefined' ? query.state : undefined
  const error = typeof query.error != 'undefined' ? query.state : undefined

  const [tried, setTried] = useState(false)
  const [errorData, setErrorData] = useState({
    state: false,
    error: '',
    object: {},
  })

  /**
   * This callback is called by the JSONP callback of the 'token' Firebase Function with the Firebase auth token.
   */
  function tokenReceived(data: { token: string; error: string }) {
    if (data.token) {
      firebase.app
        .auth()
        .signInWithCustomToken(data.token)
        .then(() => {
          window.close()
          history.push('/dashboard')
          return (
            <div className="spotify-login">
              <p className="spotify-login">
                Logged in!
                <br />
                You can close this page.
              </p>
            </div>
          )
        })
        .catch((err) =>
          setErrorData({
            state: true,
            error: 'Could not create an account.',
            object: err,
          })
        )
    } else {
      if (data.error) {
        setErrorData({
          state: true,
          error: data.error,
          object: data.error,
        })
      }
      console.error(data)
    }
  }
  if (error) {
    setErrorData({
      state: true,
      error: 'Error back from the Spotify auth page.',
      object: error,
    })
    return (
      <div>
        <p className="spotify-login">{errorData.error}</p>
        <p className="spotify-login" style={{ fontSize: '0.5em' }}>
          {errorData.object.toString()}
        </p>
      </div>
    )
  } else if (!code) {
    if (firebase.app.auth().currentUser) {
      window.close()
      return (
        <div className="spotify-login">
          <p className="spotify-login">
            Logged in!
            <br />
            You can close this page.
          </p>
        </div>
      )
    } else {
      // Start the auth flow.
      window.location.replace(process.env.REACT_APP_FUNCTION_REDIRECT as string)
      return (
        <div className="spotify-login">
          <Helmet>
            <title>Login - musictaste.space</title>
          </Helmet>
          {!errorData.state ? (
            <p className="spotify-login">
              Talking to Spotify<Dot>.</Dot>
              <Dot>.</Dot>
              <Dot>.</Dot>
            </p>
          ) : (
            <p className="spotify-login">{errorData.error}</p>
          )}
        </div>
      )
    }
  } else {
    // Use JSONP to load the 'token' Firebase Function to exchange the auth code against a Firebase custom token.
    // This is the URL to the HTTP triggered 'token' Firebase Function.
    const tokenFunctionURL = process.env.REACT_APP_FUNCTION_TOKEN as string
    if (!tried) {
      setTried(true)
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
        .then(async (res) => {
          return tokenReceived(await res.json())
        })
        .catch((err) => {
          setErrorData({
            state: true,
            error: 'Machine Broke 😢',
            object: err,
          })
          console.log(err)
        })
    }

    return (
      <div className="spotify-login">
        <Helmet>
          <title>Login - musictaste.space</title>
        </Helmet>
        {!errorData.state ? (
          <p className="spotify-login">
            Talking to Spotify<Dot>.</Dot>
            <Dot>.</Dot>
            <Dot>.</Dot>
          </p>
        ) : (
          <div>
            <p className="spotify-login">{errorData.error}</p>
            <p className="spotify-login" style={{ fontSize: '0.5em' }}>
              {JSON.stringify(errorData.object)}
            </p>
          </div>
        )}
      </div>
    )
  }
}

export default Login
