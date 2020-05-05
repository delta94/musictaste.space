import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { SpotifyApiContext } from 'react-spotify-api'
import { AuthContext } from '../../contexts/Auth'
import firebase from '../Firebase'
import Navbar from '../Navbars/Navbar'
import Artists from './InsightsArtists'
import Header from './InsightsHeader'
import Tracks from './InsightsTracks'

const Insights = (props: any) => {
  const { currentUser, spotifyToken, userData } = useContext(AuthContext)

  const [spotifyData, setSpotifyData] = useState({} as ISpotifyUserData)
  useEffect(() => {
    if (Object.entries(userData).length > 0 && currentUser) {
      firebase.getSpotifyData(currentUser.uid).then((data) => {
        if (data) {
          setSpotifyData(data)
        }
      })
    }
  }, [currentUser, userData])

  return (
    <>
      <Navbar />
      <Helmet>
        <title>Insights - musictaste.space</title>
      </Helmet>
      <SpotifyApiContext.Provider value={spotifyToken}>
        {Object.entries(spotifyData).length > 0 ? (
          <>
            <div className="insights">
              <Header
                spotifyData={spotifyData}
                userData={userData}
                showMenu={true}
              />
              <Artists userData={spotifyData} />
              <Tracks userData={spotifyData} />
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
