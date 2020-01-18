import React, { useState } from 'react'
import GoogleAnalytics from 'react-ga'
import { Button } from 'reactstrap'
import { Dot } from '../Aux/Dot'

function CreatePlaylistButton({
  createPlaylist,
}: {
  createPlaylist: () => Promise<{
    success: boolean
    uri?: string
    error?: {}
  }>
}) {
  const [continueText, setContinueText] = useState(<>Create Playlist</>)
  const [started, setStarted] = useState(false)
  const [spotifyURL, setSpotifyURL] = useState('')

  function handleSpotifyClick() {
    window.open(spotifyURL)
  }

  const startGeneratePlaylist = async () => {
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
    createPlaylist().then(res => {
      GoogleAnalytics.event({
        category: 'Interaction',
        action: 'Create A Playlist',
      })
      if (res.success) {
        setSpotifyURL(res.uri as string)
        setContinueText(<>Done!</>)
      } else {
        setContinueText(<>Failed 😢</>)
      }
    })
  }

  function handleClickContinue() {
    if (!started) {
      startGeneratePlaylist()
    }
    setStarted(true)
  }

  return spotifyURL === '' ? (
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
      onClick={handleSpotifyClick}
    >
      Open
    </Button>
  )
}

export default CreatePlaylistButton
