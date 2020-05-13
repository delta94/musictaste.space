import React, { useContext, useEffect, useState } from 'react'
import GoogleAnalytics from 'react-ga'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { SpotifyApiContext } from 'react-spotify-api'
import { AuthContext } from '../../contexts/Auth'
import createPlaylist from '../../util/createPlaylist'
import firebase from '../../util/Firebase'
import Navbar from '../Navbars/Navbar'
import Artists from './InsightsArtists'
import Header from './InsightsHeader'
import Tracks from './InsightsTracks'

const Insights = () => {
  const { currentUser, spotifyToken, userData } = useContext(AuthContext)

  const [spotifyData, setSpotifyData] = useState({} as ISpotifyUserData)
  useEffect(() => {
    if (
      Object.entries(userData).length > 0 &&
      currentUser &&
      !Object.entries(spotifyData).length
    ) {
      firebase.getSpotifyData(currentUser.uid).then((data) => {
        if (data) {
          setSpotifyData(data)
        }
      })
    }
  }, [currentUser, userData, spotifyData])

  const onCreatePlaylist = (tracks: string[], name: string) => () => {
    GoogleAnalytics.event({
      category: 'Interaction',
      label: 'Create Playlist',
      action: 'Created playlist from top tracks.',
    })
    return createPlaylist(userData.accessToken, userData.spotifyID, {
      name,
      description: 'Insights discovered on musictaste.space.',
      tracks: tracks.map((t: string) => `spotify:track:${t}`),
    })
  }

  return (
    <>
      <Navbar />
      <Helmet>
        <title>Insights - musictaste.space</title>
        <meta
          name="description"
          content="See your top artists, tracks, how obscure your music taste is and more! Sign in with Spotify to musictaste.space."
        />
        <meta name="keywords" content="spotify,music,match,insights" />
      </Helmet>
      <SpotifyApiContext.Provider value={spotifyToken}>
        {Object.entries(spotifyData).length > 0 ? (
          <>
            <div className="insights" style={{ overflow: 'hidden' }}>
              <Header
                spotifyData={spotifyData}
                userData={userData}
                showMenu={true}
              />
              <Artists userData={spotifyData} />
              <Tracks
                userData={spotifyData}
                createPlaylist={onCreatePlaylist}
              />
              <div className="genres">
                <div className="row mb-5 mt-5">
                  <div className="col d-flex flex-row justify-content-end full-button">
                    <Link to="/dashboard">← Back To Dashboard</Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </SpotifyApiContext.Provider>
    </>
  )
}

export default Insights
