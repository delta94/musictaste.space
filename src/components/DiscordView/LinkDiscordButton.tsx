import React, { useContext, useState } from 'react'
import GoogleAnalytics from 'react-ga'
import { useHistory } from 'react-router-dom'
import { Button } from 'reactstrap'
import { AuthContext } from '../../contexts/Auth'
import { Dot } from '../Aux/Dot'

const LinkDiscordButton = () => {
  const history = useHistory()
  const { currentUser, userData } = useContext(AuthContext)
  const [continueText, setContinueText] = useState(<>Connect Discord</>)
  const [started, setStarted] = useState(false)

  function handleClickLogin() {
    const isMobile = window.matchMedia('only screen and (max-width: 760px)')
      .matches
    localStorage.setItem('redirectDiscord', 'true')
    localStorage.setItem('redirectTimestamp', new Date().toJSON())
    GoogleAnalytics.event({
      category: 'Log In',
      action: 'Logged In From Discord Page',
    })
    setStarted(true)
    // if mobile, redirect to login instead of pop up login
    isMobile
      ? history.push('/login')
      : window.open('login', '_blank', 'height=585,width=500')
  }

  function handleClickDiscord() {
    const isMobile = window.matchMedia('only screen and (max-width: 760px)')
      .matches
    localStorage.setItem('redirectDiscord', 'true')
    localStorage.setItem('redirectTimestamp', new Date().toJSON())
    GoogleAnalytics.event({
      category: 'Link',
      action: 'Linked Discord',
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
    Object.entries(userData).length ? (
      !userData.discord ? (
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
            onClick={handleClickDiscord}
          >
            <>Reload Discord Profile</>
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
