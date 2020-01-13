import React from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'
import Navbar from '../Navbars/Navbar'
import { Button } from 'reactstrap'

const About = (props: any) => {
  const history = useHistory()

  const handleBackToDashboard = (e: any) => {
    history.push('/dashboard')
  }
  return (
    <>
      <Navbar />
      <Helmet>
        <title>Playlist Generator - musictaste.space</title>
      </Helmet>
      <div className="coming-soon">
        <div className="description">
          Generate playlists based on artists and tracks you have in common with
          friends.
          <br />
          Coming soon!
          <br />
          <span className="follow">
            Follow updates on my{' '}
            <a
              href="https://twitter.com/_kalpal"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Twitter!
            </a>
          </span>
        </div>
        <Button
          className="btn-round sign-in-button"
          size="md"
          onClick={handleBackToDashboard}
        >
          Back To Dashboard
        </Button>
      </div>
    </>
  )
}

export default About
