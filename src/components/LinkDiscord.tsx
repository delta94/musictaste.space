import * as qs from 'query-string'
import React, { useContext, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory, useLocation } from 'react-router-dom'
import { AuthContext } from '../contexts/Auth'
import { Dot } from './Aux/Dot'
import firebase from './Firebase'

const Login = () => {
  const history = useHistory()
  const location = useLocation()
  const query = qs.parse(location.search || location.hash)
  const code =
    typeof query.access_token !== 'undefined' ? query.access_token : undefined
  const state = typeof query.state !== 'undefined' ? query.state : undefined
  const error = typeof query.error !== 'undefined' ? query.state : undefined
  const { currentUser } = useContext(AuthContext)
  const [errorData, setErrorData] = useState({
    state: false,
    error: '',
    object: {},
  })
  const [called, setCalled] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!currentUser) {
    return (
      <div className="spotify-login">
        <Helmet>
          <title>Discord Login - musictaste.space</title>
        </Helmet>
        <p className="spotify-login">
          Connecting<Dot>.</Dot>
          <Dot>.</Dot>
          <Dot>.</Dot>
        </p>
      </div>
    )
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
      // Start the auth flow.
      window.location.replace(
        process.env.REACT_APP_FUNCTION_DISCORD_REDIRECT as string
      )
      return (
        <div className="spotify-login">
          <Helmet>
            <title>Discord Login - musictaste.space</title>
          </Helmet>
          <p className="spotify-login">
            Talking to Discord<Dot>.</Dot>
            <Dot>.</Dot>
            <Dot>.</Dot>
          </p>
        </div>
      )
    } else {
      return (
        <div className="spotify-login">
          <Helmet>
            <title>Discord Login - musictaste.space</title>
          </Helmet>
          <p className="spotify-login">
            Conencting<Dot>.</Dot>
            <Dot>.</Dot>
            <Dot>.</Dot>
          </p>
        </div>
      )
    }
  } else {
    // Use JSONP to load the 'token' Firebase Function to exchange the auth code against a Firebase custom token.
    // This is the URL to the HTTP triggered 'token' Firebase Function.
    const discordTokenFunctionURL = process.env
      .REACT_APP_FUNCTION_DISCORD_TOKEN as string
    if (success) {
      window.close()
      history.push('/discord')
      return (
        <div className="spotify-login">
          <p className="spotify-login">
            Linked!
            <br />
            You can close this page.
          </p>
        </div>
      )
    }
    if (currentUser && !called) {
      setCalled(true)
      fetch(
        (discordTokenFunctionURL +
          '?token=' +
          encodeURIComponent(code as string) +
          '&state=' +
          encodeURIComponent(state as string) +
          '&uid=' +
          currentUser.uid) as string,
        { credentials: 'include' }
      )
        .then(async (res) => {
          const data = await res.json()
          if (data.success) {
            setSuccess(true)
          }
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
          <title>Link Discord - musictaste.space</title>
        </Helmet>
        {!errorData.state ? (
          <p className="spotify-login">
            Talking to Discord<Dot>.</Dot>
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
