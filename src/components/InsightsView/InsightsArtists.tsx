import React from 'react'
import ArtistsContainer from './InsightsArtistsContainer'
const InsightsArtists = ({ userData }: { userData: ISpotifyUserData }) => {
  return (
    <>
      <ArtistsContainer
        data={userData.topArtistsLongTerm}
        textData={{
          title: 'All Time',
          description: 'favourite 30 artists of all time',
        }}
      />
      <ArtistsContainer
        data={userData.topArtistsShortTerm}
        textData={{
          title: 'Recent',
          description: 'favourite 30 artists from your recent plays',
        }}
      />
    </>
  )
}

export default InsightsArtists
