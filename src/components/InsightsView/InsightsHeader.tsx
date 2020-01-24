import Color from 'color'
import Vibrant from 'node-vibrant'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Artist } from 'react-spotify-api'
import { Button } from 'reactstrap'

const Header = ({
  spotifyData,
  userData,
}: {
  spotifyData: ISpotifyUserData
  userData: IUserProfile
}) => {
  const [artistBackgroundURL, setArtistBackgroundURL] = useState('')
  const [backgroundColor, setBackgroundColor] = useState('#c7ecee')
  const [textColor, setTextColor] = useState('black')
  const [altTextColor, setAltTextColor] = useState('black')
  const history = useHistory()

  useEffect(() => {
    const setColors = async (image: any) => {
      await Vibrant.from(image)
        .getPalette()
        .then(palette => {
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
            setBackgroundColor(c.hex())
          }
        })
    }
    if (artistBackgroundURL !== '') {
      setColors(artistBackgroundURL)
    }
  }, [artistBackgroundURL])

  const handleReturn = (e: any) => {
    history.push('/dashboard')
  }
  return (
    <>
      <div className="result">
        <div className="header-container" style={{ backgroundColor }}>
          <div className="flex-container">
            <div className="user-results-container">
              <div className="profile-container animated fadeInUp">
                <div className="user1">
                  <div
                    style={{ backgroundImage: `url(${userData.photoURL})` }}
                    className="profile-img"
                  />
                </div>
              </div>
              <p
                className="profile-names animated fadeInUp"
                style={{ color: textColor }}
              >
                {userData.displayName}
              </p>
              <div
                className="insights-text animated fadeInUp"
                style={{ color: altTextColor }}
              >
                Based on the Spotify data you imported, scroll down to see
                insights about your top artists, tracks and genres.
              </div>
              <div className="button-div animated fadeInUp">
                <Button
                  className="btn-round sign-in-button return-button "
                  size="lg"
                  onClick={handleReturn}
                >
                  Return to Dashboard
                </Button>
              </div>
            </div>

            <div className="score-and-artist">
              <div className="top-artist">
                <Artist id={spotifyData.topArtistsLongTerm[1].id}>
                  {(
                    artist: SpotifyApi.SingleArtistResponse,
                    loading: boolean,
                    error: SpotifyApi.ErrorObject
                  ) => {
                    if (artist) {
                      setArtistBackgroundURL(
                        artist.images[0].url ? artist.images[0].url : ''
                      )
                      return (
                        <img
                          src={artist.images[0].url}
                          className="artist"
                          alt=""
                        />
                      )
                    } else {
                      return null
                    }
                  }}
                </Artist>
              </div>
              <div className="top-artist-2">
                <Artist id={spotifyData.topArtistsLongTerm[2].id}>
                  {(
                    artist: SpotifyApi.SingleArtistResponse,
                    loading: boolean,
                    error: SpotifyApi.ErrorObject
                  ) => {
                    if (artist) {
                      return (
                        <img
                          src={artist.images[0].url}
                          className="artist"
                          alt=""
                        />
                      )
                    } else {
                      return null
                    }
                  }}
                </Artist>
              </div>
              <div className="top-artist-3">
                {spotifyData.topArtistsLongTerm.length > 3 ? (
                  <Artist id={spotifyData.topArtistsLongTerm[3].id}>
                    {(
                      artist: SpotifyApi.SingleArtistResponse,
                      loading: boolean,
                      error: SpotifyApi.ErrorObject
                    ) => {
                      if (artist) {
                        return (
                          <img
                            src={artist.images[0].url}
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
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Header
