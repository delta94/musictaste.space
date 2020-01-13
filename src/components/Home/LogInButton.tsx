import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../../contexts/Auth'
import { Button } from 'reactstrap'

function LogInButton() {
  const history = useHistory()
  const { currentUser } = useContext(AuthContext)

  function handleClickLogin() {
    window.open('/login', '_blank', 'height=585,width=500')
  }

  function handleClickDashboard() {
    history.push('/dashboard')
  }

  return currentUser ? (
    <Button
      className="btn-round sign-in-button"
      size="md"
      onClick={handleClickDashboard}
    >
      Go To Dashboard
    </Button>
  ) : (
    <Button
      className="btn-round sign-in-button"
      size="md"
      onClick={handleClickLogin}
    >
      Sign In With Spotify
    </Button>
  )
}

export default LogInButton
