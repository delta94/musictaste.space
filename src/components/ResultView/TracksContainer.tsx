import Color from 'color'
import Vibrant from 'node-vibrant'
import React, { useEffect, useState } from 'react'
import { Track } from 'react-spotify-api'

const TracksContainer = ({
  tracksData,
  matchUser,
  matchUserId,
  uid,
  users,
  textData,
}: {
  tracksData: IMatchedSpotifyPoint[]
  matchUser: IUsersLookupData
  matchUserId: string
  uid: string
  users: string[]
  textData: { code: string; title: string; lowercase: string }
}) => {
  const [artistBackgroundURL, setArtistBackgroundURL] = useState('')
  const [backgroundColor, setBackgroundColor] = useState('#c7ecee')
  const [textColor, setTextColor] = useState('black')
  const [altTextColor, setAltTextColor] = useState('black')
  const [altBackgroundColor, setAltBackgroundColor] = useState('#dff9fb')
  useEffect(() => {
    const setColors = async (image: any) => {
      await Vibrant.from(image)
        .getPalette()
        .then((palette) => {
          if (
            palette.LightVibrant &&
            palette.DarkMuted &&
            palette.Vibrant &&
            palette.LightMuted
          ) {
            let c = Color(palette.LightVibrant.hex)
            const t = Color(palette.DarkMuted.hex)
            let d = Color(palette.LightMuted.hex)
            const u = Color(palette.Vibrant.hex)
            if (c.contrast(t) < 4) {
              c = c.lighten(0.4)
            } else if (c.contrast(t) < 7) {
              c = c.lighten(0.2)
            }
            if (d.contrast(u) < 4) {
              d = d.lighten(0.4)
            } else if (d.contrast(u) < 7) {
              d = d.lighten(0.2)
            }
            if (d.contrast(u) < 4) {
              d = Color('#ecf0f1')
            }
            setTextColor(t.hex())
            setAltTextColor(u.hex())
            setAltBackgroundColor(d.hex())
            setBackgroundColor(c.hex())
          }
        })
    }
    if (artistBackgroundURL !== '') {
      setColors(artistBackgroundURL)
    }
  }, [artistBackgroundURL])

  const position = users[0] === uid ? 0 : 1

  const onClickHandle = (uri: string) => (e: any) => window.open(uri, 'name')
  return (
    <>
      <div className="tracks" style={{ backgroundColor: altTextColor }}>
        <Track id={tracksData[0].id}>
          {(
            track: SpotifyApi.SingleTrackResponse,
            loading: boolean,
            error: SpotifyApi.ErrorObject
          ) => {
            if (track) {
              return (
                <img
                  src={track.album.images[0].url}
                  className="track-hover-image"
                  alt=""
                />
              )
            } else {
              return null
            }
          }}
        </Track>
        <div
          className="tracks-header"
          style={{
            color: altBackgroundColor,
            textShadow: '2px 2px 3px' + Color(altTextColor).darken(0.3).hex(),
          }}
        >
          Tracks
        </div>
        <div
          className={'tracks-sub-header'}
          style={{
            color: altBackgroundColor,
          }}
        >
          {textData.title}
        </div>
        {tracksData.length ? (
          <>
            <div className="track-container">
              <div
                className="tracks-text"
                style={{ color: altBackgroundColor }}
              >
                You and {matchUser.anon ? matchUserId : matchUser.displayName}{' '}
                have <strong>{tracksData.length}</strong>{' '}
                {tracksData.length === 1 ? 'track' : 'tracks'} in common in your{' '}
                {textData.lowercase} top 100.
              </div>
            </div>
            <div className="rank-text" style={{ color: altBackgroundColor }}>
              <em>Rank: Yours / Theirs</em>
            </div>
            <div className="card-container">
              {tracksData.length ? (
                <Track id={tracksData.map((v) => v.id)}>
                  {(
                    tracks: SpotifyApi.MultipleTracksResponse,
                    loading: boolean,
                    error: SpotifyApi.ErrorObject
                  ) => {
                    if (tracks && tracks.tracks) {
                      if (tracks.tracks.length) {
                        setArtistBackgroundURL(
                          tracks.tracks[0].album.images[0].url
                        )
                      }
                      return tracks.tracks.map((track, index) => (
                        <div
                          className="spotify-container shadow-lg"
                          style={{ backgroundColor: textColor }}
                          key={track.id}
                          onClick={onClickHandle(track.uri)}
                        >
                          <img
                            src={track.album.images[0].url}
                            className="top-image"
                            alt=""
                          />
                          <p
                            className="artist-name"
                            style={{ color: backgroundColor }}
                          >
                            {track.name}
                            <br />
                            {track.artists.map((a) => a.name).join(', ')}
                            <br />
                            {position
                              ? tracksData[index].indexB + 1
                              : tracksData[index].indexA + 1}{' '}
                            /{' '}
                            {position
                              ? tracksData[index].indexA + 1
                              : tracksData[index].indexB + 1}
                          </p>
                        </div>
                      ))
                    } else {
                      return null
                    }
                  }}
                </Track>
              ) : null}{' '}
            </div>
          </>
        ) : null}
        <div className="after-tracks" />
      </div>
    </>
  )
}

export default TracksContainer
