import React, { useContext, useState } from 'react'
import GoogleAnalytics from 'react-ga'
import { useHistory } from 'react-router-dom'
import { Button } from 'reactstrap'
import { AuthContext } from '../../contexts/Auth'
import { Dot } from '../Aux/Dot'
import firebase from '../Firebase'

function ConfirmOrLogInButton(props: any) {
  const history = useHistory()
  const { currentUser, userData } = useContext(AuthContext)
  const [continueText, setContinueText] = useState(<>Continue</>)
  const [started, setStarted] = useState(false)
  const anon = props.anon

  function handleClickLogin() {
    window.open('login', '_blank', 'height=585,width=500')
    GoogleAnalytics.event({
      category: 'Log In',
      action: 'Logged In From Match Page',
    })
  }

  const startCompareUsers = async () => {
    const t = firebase.compareUsers(
      !anon ? userData.matchCode : userData.anonMatchCode,
      props.compareUser,
      userData.serverState
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
    t.then(code => {
      history.push('/match/' + code)
    })
  }
  function handleClickContinue() {
    if (!started) {
      startCompareUsers()
      GoogleAnalytics.event({
        category: 'Interaction',
        action: 'Match With a User',
      })
    }
    setStarted(true)
  }

  return currentUser ? (
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
    <Button
      className="btn-round sign-in-button"
      size="lg"
      onClick={handleClickLogin}
    >
      Sign In With Spotify
    </Button>
  )
}

export default ConfirmOrLogInButton
