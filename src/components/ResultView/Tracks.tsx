import React from 'react'
import TracksContainer from './TracksContainer'
const Tracks = ({
  matchData,
  matchUser,
  matchUserId,
  uid,
}: {
  matchData: IMatchData
  matchUser: IUsersLookupData
  matchUserId: string
  uid: string
}) => {
  return (
    <div>
      {matchData.matchedTracksLongTerm.length ? (
        <TracksContainer
          tracksData={matchData.matchedTracksLongTerm}
          matchUser={matchUser}
          matchUserId={matchUserId}
          uid={uid}
          users={matchData.users}
          textData={{ code: 'lt', title: 'Long Term', lowercase: 'long-term' }}
        />
      ) : null}
      {matchData.matchedTracksMediumTerm.length ? (
        <TracksContainer
          tracksData={matchData.matchedTracksMediumTerm}
          matchUser={matchUser}
          matchUserId={matchUserId}
          uid={uid}
          users={matchData.users}
          textData={{
            code: 'mt',
            title: 'Medium Term',
            lowercase: 'medium-term',
          }}
        />
      ) : null}
      {matchData.matchedTracksShortTerm.length ? (
        <TracksContainer
          tracksData={matchData.matchedTracksShortTerm}
          matchUser={matchUser}
          matchUserId={matchUserId}
          uid={uid}
          users={matchData.users}
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

export default Tracks
