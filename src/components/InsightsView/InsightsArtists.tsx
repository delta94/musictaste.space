import React from 'react'
import ArtistsContainer from './InsightsArtistsContainer'

const InsightsArtists = ({ userData }: { userData: ISpotifyUserData }) => {
  return (
    <>
      {userData?.topArtistsLongTerm?.length ? (
        <ArtistsContainer
          data={userData.topArtistsLongTerm.filter(Boolean)}
          textData={{
            title: 'All Time',
            description: 'favourite 30 artists of all time',
          }}
        />
      ) : null}
      {userData?.topArtistsShortTerm?.length ? (
        <ArtistsContainer
          data={userData.topArtistsShortTerm.filter(Boolean)}
          textData={{
            title: 'Recent',
            description: 'favourite 30 artists from your recent plays',
          }}
        />
      ) : null}
    </>
  )
}

export default InsightsArtists
