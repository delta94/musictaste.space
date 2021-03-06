import React, { useContext, useState } from 'react'
import GoogleAnalytics from 'react-ga'
import { Link, useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { Button } from 'reactstrap'
import { AuthContext } from '../../contexts/Auth'
import { UserDataContext } from '../../contexts/UserData'
import firebase from '../../util/Firebase'

import { Dot } from '../Aux/Dot'

function ConfirmOrLogInButton(props: any) {
  const history = useHistory()
  const { currentUser } = useContext(AuthContext)
  const { userData } = useContext(UserDataContext)
  const [continueText, setContinueText] = useState(<>Continue</>)
  const [started, setStarted] = useState(false)
  const anon = props.anon

  const { addToast } = useToasts()
  function handleClickLogin() {
    const isMobile = window.matchMedia('only screen and (max-width: 760px)')
      .matches
    localStorage.setItem('redirectMatch', props.compareUser as string)
    localStorage.setItem('redirectTimestamp', new Date().toJSON())
    GoogleAnalytics.event({
      category: 'Account',
      action: 'Logged In From Match Page',
      label: 'Match Log In',
    })
    // if mobile, redirect to login instead of pop up login
    isMobile
      ? history.push('/login')
      : window.open('/login', '_blank', 'height=585,width=500')
  }

  const startCompareUsers = async () => {
    if (userData) {
      const t = firebase.compareUsers(
        !anon ? userData.matchCode : userData.anonMatchCode,
        props.compareUser,
        userData.serverState,
        currentUser?.uid || '',
        userData.region ? userData.region : ''
      )
      setContinueText(
        <>
          <div className="waiting-text">
            Please wait
            <Dot>.</Dot>
            <Dot>.</Dot>
            <Dot>.</Dot>
          </div>
        </>
      )
      t.then(({ success, code, error }) => {
        if (success && code) {
          history.push(`/match/${code}${props.rematch.rematch ? '?cc=1' : ''}`)
        }
        if (!success && error) {
          addToast(error, { appearance: 'error', autoDismiss: false })
        }
      })
    }
  }
  function handleClickContinue() {
    if (!started) {
      startCompareUsers()
      if (props.rematch.rematch) {
        GoogleAnalytics.event({
          category: 'Interaction',
          action: 'Rematch with a user',
          label: 'Rematch',
        })
      } else {
        GoogleAnalytics.event({
          category: 'Interaction',
          action: 'Matched with a user',
          label: 'Match',
        })
      }
    }
    setStarted(true)
  }

  return currentUser ? (
    userData && props.compareUser ? (
      <>
        <Button
          className="btn-round sign-in-button"
          size="lg"
          onClick={handleClickContinue}
        >
          {continueText}
        </Button>
      </>
    ) : (
      <>
        <Button className="btn-round sign-in-button" size="lg">
          <>
            <div className="waiting-text">
              <Dot>.</Dot>
              <Dot>.</Dot>
              <Dot>.</Dot>
            </div>
          </>
        </Button>
      </>
    )
  ) : (
    <div className="about d-flex flex-column align-items-center justify-content-center">
      <Button
        className="btn-round sign-in-button"
        size="lg"
        onClick={handleClickLogin}
      >
        Sign In With Spotify
      </Button>
      <p style={{ fontSize: '0.8em' }}>
        By signing in you agree to the{' '}
        <Link to="/privacy-policy">Privacy Policy</Link>.
      </p>
    </div>
  )
}

export default ConfirmOrLogInButton
