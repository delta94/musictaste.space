import { motion } from 'framer-motion'
import React, { useContext } from 'react'
import GoogleAnalytics from 'react-ga'
import { Link, useHistory } from 'react-router-dom'
import { Button } from 'reactstrap'
import { AuthContext } from '../../contexts/Auth'

function LogInButton() {
  const history = useHistory()
  const { currentUser } = useContext(AuthContext)

  function handleClickLogin() {
    window.open('/login', '_blank', 'height=585,width=500')
    GoogleAnalytics.event({
      category: 'Account',
      action: 'Logged In From Login Button',
      label: 'Button Log In',
    })
  }

  function handleClickDashboard() {
    history.push('/dashboard')
  }

  return (
    <motion.div
      animate={true}
      className={`about d-flex flex-column justify-content-center align-items-center`}
    >
      {currentUser ? (
        <Button
          className="btn-round sign-in-button"
          size="md"
          onClick={handleClickDashboard}
        >
          Go To Dashboard
        </Button>
      ) : (
        <>
          <Button
            className="btn-round sign-in-button"
            size="md"
            onClick={handleClickLogin}
          >
            Sign In With Spotify
          </Button>
          <p style={{ fontSize: '0.8em' }}>
            By signing in you agree to the{' '}
            <Link to="/privacy-policy">Privacy Policy</Link>.
          </p>
        </>
      )}
    </motion.div>
  )
}

export default LogInButton
