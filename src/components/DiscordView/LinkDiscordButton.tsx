import firebase from 'firebase/app'
import React, { useContext, useState } from 'react'
import GoogleAnalytics from 'react-ga'
import { useHistory } from 'react-router-dom'
import { Button } from 'reactstrap'
import { AuthContext } from '../../contexts/Auth'
import { UserDataContext } from '../../contexts/UserData'
import { Dot } from '../Aux/Dot'

const LinkDiscordButton = () => {
  const history = useHistory()
  const { currentUser } = useContext(AuthContext)
  const { userData } = useContext(UserDataContext)
  const [continueText, setContinueText] = useState(<>Connect Discord</>)
  const [started, setStarted] = useState(false)
  const [unlinked, setUnlinked] = useState(false)

  function handleClickLogin() {
    const isMobile = window.matchMedia('only screen and (max-width: 760px)')
      .matches
    localStorage.setItem('redirectDiscord', 'true')
    localStorage.setItem('redirectTimestamp', new Date().toJSON())
    GoogleAnalytics.event({
      category: 'Account',
      action: 'Logged in from Discord page',
      label: 'Discord Log In',
    })
    setStarted(true)
    // if mobile, redirect to login instead of pop up login
    isMobile
      ? history.push('/login')
      : window.open('login', '_blank', 'height=585,width=500')
  }

  function handleUnlink() {
    firebase
      .firestore()
      .collection('users')
      .doc(currentUser?.uid || '')
      .update({
        discordId: firebase.firestore.FieldValue.delete(),
        discord: firebase.firestore.FieldValue.delete(),
      })
      .then(() => {
        setContinueText(<>Connect Discord</>)
        setUnlinked(true)
      })
      .catch(() => {})
    GoogleAnalytics.event({
      category: 'Interaction',
      action: 'Unlinked Discord from the Discord page',
      label: 'Unlinked Discord',
    })
  }

  function handleClickDiscord() {
    const isMobile = window.matchMedia('only screen and (max-width: 760px)')
      .matches
    localStorage.setItem('redirectDiscord', 'true')
    localStorage.setItem('redirectTimestamp', new Date().toJSON())
    GoogleAnalytics.event({
      category: 'Link',
      action: 'Linked Discord from the discord page',
      label: 'Link Discord',
    })
    setContinueText(
      <div className="waiting-text">
        <Dot>.</Dot>
        <Dot>.</Dot>
        <Dot>.</Dot>
      </div>
    )
    // if mobile, redirect to login instead of pop up login
    if (!started) {
      isMobile
        ? history.push('/discord/login')
        : window.open('/discord/login', '_blank', 'height=585,width=500')
      setStarted(true)
    }
  }

  return currentUser ? (
    userData ? (
      !userData.discord || unlinked ? (
        <>
          <Button
            className="btn-round discord-link-button"
            size="lg"
            onClick={handleClickDiscord}
          >
            {continueText}
          </Button>
        </>
      ) : (
        <>
          <Button
            className="btn-round discord-linked-button"
            size="md"
            onClick={handleUnlink}
          >
            <>Unlink Profile</>
          </Button>
        </>
      )
    ) : (
      <Button className="btn-round discord-link-button" size="lg">
        <div className="waiting-text">
          <Dot>.</Dot>
          <Dot>.</Dot>
          <Dot>.</Dot>
        </div>
      </Button>
    )
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

export default LinkDiscordButton
