import React, { useEffect, useState } from 'react'
import Acousticness from './Moods/Acousticness'
import Danceability from './Moods/Danceability'
import Energy from './Moods/Energy'
import Happy from './Moods/Happy'

interface MoodsProps {
  features: IUserAudioFeatures
  loaded: boolean
  tracks: {
    [key: string]: { track: SpotifyApi.TrackObjectFull; score: number }
  }
  averages: { hasRegion: boolean; data: INationalAverage }
}
const Moods = ({ features, loaded, tracks, averages }: MoodsProps) => {
  return (
    <div>
      <div className="moods pt-5 pb-5" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-5 d-flex flex-column justify-content-center">
              <div className="title" style={{ color: '#191414' }}>
                Looking at <span style={{ color: '#1DB954' }}>~moods~</span>
              </div>
            </div>
            <div
              className="col-md-7 d-flex flex-column justify-content-center subtitle"
              style={{ color: '#191414' }}
            >
              How do your favourite tracks stack up against other users?
            </div>
          </div>
        </div>
      </div>
      {loaded && tracks.valence ? (
        <>
          <Happy
            emoji={'😄'}
            features={features}
            loaded={loaded}
            track={tracks.valence}
            averages={averages}
          />
          <Energy
            emoji={'🙌'}
            features={features}
            loaded={loaded}
            track={tracks.energy}
            averages={averages}
          />
          <Danceability
            emoji={'💃'}
            features={features}
            loaded={loaded}
            track={tracks.danceability}
            averages={averages}
          />
          <Acousticness
            emoji={'🎹 🎸'}
            features={features}
            loaded={loaded}
            track={tracks.acousticness}
            averages={averages}
          />
        </>
      ) : (
        <div className="col">Loading...</div>
      )}
    </div>
  )
}
export default Moods
