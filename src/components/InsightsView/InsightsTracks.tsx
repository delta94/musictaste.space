import React from 'react'
import TracksContainer from './InsightsTracksContainer'
const InsightsTracks = ({ userData }: { userData: ISpotifyUserData }) => {
  return (
    <div id="tracks">
      {userData.topTracksLongTerm.length ? (
        <TracksContainer
          tracksData={userData.topTracksLongTerm.slice(0, 30)}
          textData={{ code: 'lt', title: 'All-Time', lowercase: 'all-time' }}
        />
      ) : null}
      {/* {userData.topTracksMediumTerm.length ? (
        <TracksContainer
          tracksData={userData.topTracksMediumTerm.slice(0, 30)}
          textData={{
            code: 'mt',
            title: 'Medium Term',
            lowercase: 'medium-term',
          }}
        />
      ) : null} */}
      {userData.topTracksShortTerm.length ? (
        <TracksContainer
          tracksData={userData.topTracksShortTerm.slice(0, 30)}
          textData={{
            code: 'st',
            title: 'Recent',
            lowercase: 'recent',
          }}
        />
      ) : null}
    </div>
  )
}

export default InsightsTracks
