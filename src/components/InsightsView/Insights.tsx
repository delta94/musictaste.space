import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { SpotifyApiContext } from 'react-spotify-api'
import { AuthContext } from '../../contexts/Auth'
import firebase from '../Firebase'
import Navbar from '../Navbars/Navbar'
import Artists from './InsightsArtists'
import Genres from './InsightsGenres'
import Header from './InsightsHeader'
import Tracks from './InsightsTracks'

const Insights = (props: any) => {
  const { currentUser, spotifyToken, userData } = useContext(AuthContext)

  const [spotifyData, setSpotifyData] = useState({} as ISpotifyUserData)
  useEffect(() => {
    if (Object.entries(userData).length > 0 && currentUser) {
      firebase.getSpotifyData(currentUser.uid).then(data => {
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
            <Header spotifyData={spotifyData} userData={userData} />
            <Artists userData={spotifyData} />
            <Tracks userData={spotifyData} />
            <Genres genreData={spotifyData.topGenres} />
          </>
        ) : null}
      </SpotifyApiContext.Provider>
    </>
  )
}

export default Insights
