import React from 'react'
import TracksContainer from './InsightsTracksContainer'
const InsightsTracks = ({
  userData,
  createPlaylist,
}: {
  userData: ISpotifyUserData
  createPlaylist: (
    t: string[],
    title: string
  ) => () => Promise<{ success: boolean }>
}) => {
  return (
    <div id="tracks">
      {userData.topTracksLongTerm.length ? (
        <TracksContainer
          tracksData={userData.topTracksLongTerm.filter(Boolean).slice(0, 30)}
          textData={{ code: 'lt', title: 'All-Time', lowercase: 'all-time' }}
          onCreatePlaylist={createPlaylist(
            userData.topTracksLongTerm.map((t) => t.id).slice(0, 50),
            'All-Time Faves - musictaste.space'
          )}
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
          tracksData={userData.topTracksShortTerm.filter(Boolean).slice(0, 30)}
          textData={{
            code: 'st',
            title: 'Recent',
            lowercase: 'recent',
          }}
          onCreatePlaylist={createPlaylist(
            userData.topTracksShortTerm.map((t) => t.id).slice(0, 50),
            'Recent Favourites - musictaste.space'
          )}
        />
      ) : null}
    </div>
  )
}

export default InsightsTracks
