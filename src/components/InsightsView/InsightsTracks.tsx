import React from 'react'
import TracksContainer from './InsightsTracksContainer'
const InsightsTracks = ({ userData }: { userData: ISpotifyUserData }) => {
  return (
    <div>
      {userData.topTracksLongTerm.length ? (
        <TracksContainer
          tracksData={userData.topTracksLongTerm.slice(50)}
          textData={{ code: 'lt', title: 'Long Term', lowercase: 'long-term' }}
        />
      ) : null}
      {userData.topTracksMediumTerm.length ? (
        <TracksContainer
          tracksData={userData.topTracksMediumTerm.slice(50)}
          textData={{
            code: 'mt',
            title: 'Medium Term',
            lowercase: 'medium-term',
          }}
        />
      ) : null}
      {userData.topTracksShortTerm.length ? (
        <TracksContainer
          tracksData={userData.topTracksShortTerm.slice(50)}
          textData={{
            code: 'st',
            title: 'Short Term',
            lowercase: 'short-term',
          }}
        />
      ) : null}
    </div>
  )
}

export default InsightsTracks
