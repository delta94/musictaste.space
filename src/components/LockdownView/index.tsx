import React, { useContext, useEffect } from 'react'
import GoogleAnalytics from 'react-ga'
import Helmet from 'react-helmet'
import { useHistory } from 'react-router-dom'
import { Button } from 'reactstrap'
import { AuthContext } from '../../contexts/Auth'
import { gradients } from '../../util/gradients'
import Navbar from '../Navbars/Navbar'

const LockdownView = () => {
  const history = useHistory()
  const { currentUser } = useContext(AuthContext)
  const handleLoginClick = () => {
    GoogleAnalytics.event({
      category: 'Account',
      action: 'Login From Lockdown Landing Page',
      label: 'Login From Lockdown',
    })
    localStorage.setItem('redirectPage', '/insights#playlist')
    history.push(`/dashboard?callback=true&to=insights`)
  }
  useEffect(() => {
    if (currentUser) {
      GoogleAnalytics.event({
        category: 'Interaction',
        action: 'Redirect Logged In User From Lockdown Landing Page',
        label: 'Redirect From Lockdown',
      })
      localStorage.setItem('redirectPage', '/insights#playlist')
      history.push(`/dashboard?callback=true&to=insights`)
    }
  })
  return (
    <>
      <Helmet>
        <title>Lockdown Playlist - musictaste.space</title>
        <meta
          name="description"
          content="Create a playlist of the songs that have kept you company during COVID-19. Compare your music taste with your friends!"
        />
        <meta name="keywords" content="spotify,music,match,insights" />
      </Helmet>
      <div
        className="lockdown-redirect"
        style={{
          minHeight: '100vh',
          width: '100%',
          backgroundImage: `linear-gradient(20deg, ${gradients[3][0]}, ${gradients[3][1]})`,
          overflow: 'hidden',
        }}
      >
        <Navbar />

        <div className="container" style={{ paddingTop: '8em' }}>
          <div
            className="title text-center animated fadeInUp"
            style={{ color: 'white' }}
          >
            Your <span style={{ color: '#1DB954' }}>COVID-19</span> Tunes
          </div>
          <div
            className="subtitle text-center animated fadeInUp"
            style={{ color: 'white' }}
          >
            The songs that have kept you company during COVID-19.
          </div>
          <div className="d-flex flex-row justify-content-center align-items-center mt-5 flex-wrap">
            <div className="playlist-image animated fadeInUp delay-1s" />
            <div className="text-box ml-3 mt-2 mb-5">
              <p>
                musictaste.space lets you compare your Spotify music taste with
                friends! Sign in with Spotify to create your own lockdown
                playlist and use your code to see what you have in common!
              </p>
              <Button
                className="btn-round sign-in-button mt-2"
                size="lg"
                onClick={handleLoginClick}
              >
                Sign In With Spotify
              </Button>{' '}
            </div>
          </div>
        </div>
        <div
          className="container"
          style={{ marginTop: '4em', paddingBottom: '2em', color: 'white' }}
        >
          <hr />
          Made with ❤️ in Melbourne, Australia.
        </div>
      </div>
    </>
  )
}

export default LockdownView
