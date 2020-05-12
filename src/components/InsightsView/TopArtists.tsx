import Color from 'color'
import Vibrant from 'node-vibrant'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

interface TopArtistProps {
  artists: SpotifyApi.ArtistObjectFull[]
  loaded: boolean
}
const TopArtists = ({ artists, loaded }: TopArtistProps) => {
  const [artistBackgroundURL, setArtistBackgroundURL] = useState('')
  const [backgroundColor, setBackgroundColor] = useState('#c7ecee')
  const [textColor, setTextColor] = useState(['#c7ecee', '#c7ecee'])
  const [altTextColor, setAltTextColor] = useState('#c7ecee')
  const [altBackgroundColor, setAltBackgroundColor] = useState('#dff9fb')
  const history = useHistory()
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
            setTextColor([t.hex(), t.darken(0.2).hex()])
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
  if (loaded && artistBackgroundURL === '') {
    setArtistBackgroundURL(artists[0].images[0].url)
  }
  const Menu1 = styled.a`
    border-bottom: ${'1px solid ' + backgroundColor};
    color: ${backgroundColor} !important;
    cursor: pointer;
    :hover {
      background: ${backgroundColor};
      color: ${textColor[0]} !important;
    }
  `
  return (
    <div
      className="top-artists"
      style={{
        backgroundColor: textColor[0],
        backgroundImage: `linear-gradient(45deg, ${textColor[0]}, ${textColor[1]})`,
      }}
    >
      <div className="container">
        {loaded ? (
          <>
            <div className="row">
              <div className="col-md-7 d-flex flex-column justify-content-center">
                <div className="title" style={{ color: backgroundColor }}>
                  Grooving to{' '}
                  <span style={{ color: altTextColor }}>{artists[0].name}</span>
                </div>
                <div className="subtitle" style={{ color: altBackgroundColor }}>
                  When it comes to your favourite artist, no one does it quite
                  like {artists[0].name}!
                </div>
              </div>
              <div className="col-md-5 d-flex flex-row justify-content-start">
                <div
                  className="artist-image"
                  style={{
                    backgroundImage: `url(${artists[0].images[0].url})`,
                  }}
                />
              </div>
            </div>
            <div className="mt-3 mb-3">
              <div className="row sub-artists">
                <div className="col-md-3 col-4 mt-2">
                  <img
                    className="artist-image-small"
                    src={artists[1].images[0].url}
                    alt="top-artist"
                  />
                </div>
                <div className="col-md-3 col-8 mt-2">
                  <div className="title" style={{ color: backgroundColor }}>
                    <span style={{ color: altTextColor }}>#2</span>
                    <br />
                    {artists[1].name}
                  </div>
                </div>
                <div className="col-md-3 col-4 mt-2">
                  <img
                    className="artist-image-small"
                    src={artists[2].images[0].url}
                    alt="top-artist"
                  />
                </div>
                <div className="col-md-3 col-8 mt-2">
                  <div className="title" style={{ color: backgroundColor }}>
                    <span style={{ color: altTextColor }}>#3</span>
                    <br />
                    {artists[2].name}
                  </div>
                </div>
              </div>
              <div className="row sub-artists">
                <div className="col-md-3 col-4 mt-2">
                  <img
                    className="artist-image-small"
                    src={artists[3].images[0].url}
                    alt="top-artist"
                  />
                </div>
                <div className="col-md-3 col-8 mt-2">
                  <div className="title" style={{ color: backgroundColor }}>
                    <span style={{ color: altTextColor }}>#4</span>
                    <br />
                    {artists[3].name}
                  </div>
                </div>
                <div className="col-md-3 col-4 mt-2">
                  <img
                    className="artist-image-small"
                    src={artists[4].images[0].url}
                    alt="top-artist"
                  />
                </div>
                <div className="col-md-3 col-8 mt-2">
                  <div className="title" style={{ color: backgroundColor }}>
                    <span style={{ color: altTextColor }}>#5</span>
                    <br />
                    {artists[4].name}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col d-flex flex-row justify-content-end full-button">
                  <Menu1 onClick={() => history.push('/insights/all')}>
                    See All Top Tracks & Artists →
                  </Menu1>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="col d-flex flex-row justify-content-center mt-5 mb-5 loading">
            Loading...
          </div>
        )}
      </div>
    </div>
  )
}
export default TopArtists
