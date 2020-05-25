import Color from 'color'
import differenceInDays from 'date-fns/differenceInDays'
import Vibrant from 'node-vibrant'
import qs from 'query-string'
import React, { useEffect, useRef, useState } from 'react'
import CountUp from 'react-countup'
import Reward from 'react-rewards'
import { useLocation } from 'react-router'
import { Artist, Track } from 'react-spotify-api'
import { useToasts } from 'react-toast-notifications'

const Header = ({
  matchData,
  matchUser,
  matchUserId,
  userData,
}: {
  matchData: IMatchData
  matchUser: IPreviewMatchData
  matchUserId: string
  userData: IUserProfile
}) => {
  const percentageRef = useRef(null)
  const [artistBackgroundURL, setArtistBackgroundURL] = useState('')
  const [backgroundColor, setBackgroundColor] = useState('#c7ecee')
  const [textColor, setTextColor] = useState('black')
  const [altTextColor, setAltTextColor] = useState('black')
  const [altBackgroundColor, setAltBackgroundColor] = useState('#dff9fb')
  const [toastSent, setToastSent] = useState(false)
  const query = qs.parse(useLocation().search)
  const { addToast } = useToasts()
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

  useEffect(() => {
    if (!toastSent && query.rp && Object.entries(matchData).length > 0) {
      setToastSent(true)
      const difference = differenceInDays(
        new Date(),
        matchData.matchDate.toDate()
      )
      if (difference > 14) {
        addToast(
          `This match was created ${difference} ${
            difference === 1 ? 'day' : 'days'
          } ago. \
          If you both have imported new data, you can enter their code again for new results!`,
          { appearance: 'warning', autoDismiss: false }
        )
      }
    }
  }, [toastSent, query.rp, matchData, addToast])

  const shootConfetti = (e: any) => {
    if (matchData.score > 0.7) {
      ;(percentageRef.current as any).rewardMe()
    } else {
      ;(percentageRef.current as any).punishMe()
    }
  }

  const onClickHandle = (url: string) => (e: any) => window.open(url, 'name')

  const config = {
    lifetime: 135,
    angle: 110,
    decay: 0.96,
    spread: 100,
    startVelocity: 35,
    elementCount: 20,
    elementSize: 100,
  }
  const topTracks = []
  if (matchData.matchedTracksLongTerm.length) {
    topTracks.push(matchData.matchedTracksLongTerm[0])
  }
  if (matchData.matchedTracksMediumTerm.length) {
    topTracks.push(matchData.matchedTracksMediumTerm[0])
  }
  if (matchData.matchedTracksShortTerm.length) {
    topTracks.push(matchData.matchedTracksShortTerm[0])
  }
  const topTrack = topTracks.reduce(
    (prev, value) => (value.rank < prev.rank ? value : prev),
    { rank: 1000, id: '' }
  )
  return (
    <>
      <div className="header-container" style={{ backgroundColor }}>
        <div className="flex-container">
          <div className="user-results-container">
            <div
              className={`profile-container animated fadeInUp ${
                query.r ? 'return' : 'initial'
              }`}
            >
              <div className="user1">
                <div
                  style={{ backgroundImage: `url(${userData.photoURL})` }}
                  className="profile-img"
                />
              </div>
              <div className="user2">
                {matchUser.anon ? (
                  <i
                    className="fas fa-user-secret profile-img anon-profile"
                    aria-hidden="true"
                    style={{ color: '#130f40' }}
                  />
                ) : (
                  <div
                    style={{ backgroundImage: `url(${matchUser.photoURL})` }}
                    className="profile-img"
                  />
                )}
              </div>
            </div>
            <div>
              <p
                className={`profile-names animated fadeInUp ${
                  query.r ? 'return' : 'initial'
                }`}
                style={{ color: textColor }}
              >
                {userData.displayName} ×{' '}
                {matchUser.anon ? matchUserId : matchUser.displayName}
              </p>
            </div>
            <div className="top-tiles">
              {matchData.matchedArtists.length ? (
                <div
                  className={`top-box animated fadeInUp ${
                    query.r ? 'return' : 'initial'
                  }`}
                >
                  <p className="top-title" style={{ color: altTextColor }}>
                    Top Artist In Common
                  </p>
                  <Artist id={matchData.matchedArtists[0].id}>
                    {(
                      artist: SpotifyApi.SingleArtistResponse,
                      loading: boolean,
                      error: SpotifyApi.ErrorObject
                    ) => {
                      if (artist) {
                        return (
                          <div
                            className="spotify-container shadow-lg"
                            style={{ backgroundColor: altBackgroundColor }}
                            onClick={onClickHandle(
                              artist.external_urls.spotify
                            )}
                          >
                            <img
                              src={artist.images[0]?.url}
                              className="top-image"
                              alt=""
                            />
                            <p
                              className="artist-name"
                              style={{ color: textColor }}
                            >
                              {artist.name}
                            </p>
                          </div>
                        )
                      } else {
                        return null
                      }
                    }}
                  </Artist>
                </div>
              ) : null}
              {topTrack.id !== '' ? (
                <div
                  className={`top-box animated fadeInUp ${
                    query.r ? 'return' : 'initial'
                  }`}
                >
                  <p className="top-title" style={{ color: altTextColor }}>
                    Top Track In Common
                  </p>
                  <Track id={topTrack.id}>
                    {(
                      track: SpotifyApi.SingleTrackResponse,
                      loading: boolean,
                      error: SpotifyApi.ErrorObject
                    ) => {
                      if (track) {
                        return (
                          <div
                            className="spotify-container shadow-lg"
                            style={{ backgroundColor: altBackgroundColor }}
                            onClick={onClickHandle(track.external_urls.spotify)}
                          >
                            <img
                              src={track.album.images[0]?.url}
                              className="top-image"
                              alt=""
                            />
                            <p
                              className="track-name"
                              style={{ color: textColor }}
                            >
                              {track.name}
                              <br />
                              <strong>
                                {track.artists.map((v) => v.name).join(', ')}
                              </strong>
                            </p>
                          </div>
                        )
                      } else {
                        return null
                      }
                    }}
                  </Track>
                </div>
              ) : null}
            </div>
          </div>
          <div className="score-and-artist">
            <div className="top-artist animated fadeInRightBig">
              {matchData.matchedArtists.length > 1 ? (
                <Artist id={matchData.matchedArtists[1].id}>
                  {(
                    artist: SpotifyApi.SingleArtistResponse,
                    loading: boolean,
                    error: SpotifyApi.ErrorObject
                  ) => {
                    if (artist) {
                      setArtistBackgroundURL(
                        artist.images[0]?.url ? artist.images[0]?.url : ''
                      )
                      return (
                        <img
                          src={artist.images[0]?.url}
                          className="artist"
                          alt=""
                        />
                      )
                    } else {
                      return null
                    }
                  }}
                </Artist>
              ) : null}
            </div>
            <div className="top-artist-2 animated fadeInRightBig">
              {matchData.matchedArtists.length > 2 ? (
                <Artist id={matchData.matchedArtists[2].id}>
                  {(
                    artist: SpotifyApi.SingleArtistResponse,
                    loading: boolean,
                    error: SpotifyApi.ErrorObject
                  ) => {
                    if (artist) {
                      return (
                        <img
                          src={artist.images[0]?.url}
                          className="artist"
                          alt=""
                        />
                      )
                    } else {
                      return null
                    }
                  }}
                </Artist>
              ) : null}
            </div>
            <div className="top-artist-3 animated fadeInRightBig">
              {matchData.matchedArtists.length > 3 ? (
                <Artist id={matchData.matchedArtists[3].id}>
                  {(
                    artist: SpotifyApi.SingleArtistResponse,
                    loading: boolean,
                    error: SpotifyApi.ErrorObject
                  ) => {
                    if (artist) {
                      return (
                        <img
                          src={artist.images[0]?.url}
                          className="artist"
                          alt=""
                        />
                      )
                    } else {
                      return null
                    }
                  }}
                </Artist>
              ) : null}
            </div>
            <div
              className="score animated slideInRight"
              style={{ color: altTextColor }}
            >
              <span>
                <Reward type="emoji" config={config} ref={percentageRef}>
                  <CountUp
                    delay={query.r ? 0 : 5}
                    start={0}
                    end={Math.round(matchData.score * 100)}
                    duration={query.r ? 1 : 5}
                    onEnd={shootConfetti}
                  />
                  <span className="percent-symbol">%</span>
                </Reward>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Header
