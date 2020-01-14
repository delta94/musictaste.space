import React from 'react'
import TracksContainer from './InsightsTracksContainer'
const InsightsTracks = ({ userData }: { userData: ISpotifyUserData }) => {
  return (
    <div>
      {userData.topTracksLongTerm.length ? (
        <TracksContainer
          tracksData={userData.topTracksLongTerm
            .slice(0, 49)
            .concat(userData.topTracksLongTerm[51])}
          textData={{ code: 'lt', title: 'Long Term', lowercase: 'long-term' }}
        />
      ) : null}
      {userData.topTracksMediumTerm.length ? (
        <TracksContainer
          tracksData={userData.topTracksMediumTerm
            .slice(0, 49)
            .concat(userData.topTracksMediumTerm[51])}
          textData={{
            code: 'mt',
            title: 'Medium Term',
            lowercase: 'medium-term',
          }}
        />
      ) : null}
      {userData.topTracksShortTerm.length ? (
        <TracksContainer
          tracksData={userData.topTracksShortTerm
            .slice(0, 49)
            .concat(userData.topTracksShortTerm[51])}
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
