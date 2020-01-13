import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../../contexts/Auth'
import { Button } from 'reactstrap'
import firebase from '../Firebase'
import { Dot } from '../Aux/Dot'

function ConfirmOrLogInButton(props: any) {
  const history = useHistory()
  const { currentUser, userData } = useContext(AuthContext)
  const [continueText, setContinueText] = useState(<>Continue</>)
  const [started, setStarted] = useState(false)
  const anon = props.anon

  function handleClickLogin() {
    window.open('login', '_blank', 'height=585,width=500')
  }

  const startCompareUsers = async () => {
    let t = firebase.compareUsers(
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
    }
    setStarted(true)
  }

  return currentUser ? (
    <Button
      className="btn-round sign-in-button"
      size="lg"
      onClick={handleClickContinue}
    >
      {continueText}
    </Button>
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
