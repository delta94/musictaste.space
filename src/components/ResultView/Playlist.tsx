import Color from 'color'
import Vibrant from 'node-vibrant'
import React, { useEffect, useState } from 'react'
import { Button } from 'reactstrap'
import Spotify from 'spotify-web-api-js'
import Canvas from '../PlaylistView/Canvas'

export default function Playlist(props: any) {
  const doNothing = () => false

  const [artistImage, setArtistImage] = useState({})
  const [backgroundColor, setBackgroundColor] = useState('#c7ecee')
  const s = new Spotify()
  s.setAccessToken(props.token)

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
            setBackgroundColor(c.hex())
          }
        })
    }
    if (Object.entries(artistImage).length !== 0) {
      // @ts-ignore
      setColors(artistImage.url)
    } else {
      const getArtistImage = async () => {
        await s
          .getArtist(props.artistID)
          .then((res) => setArtistImage(res.images[0]))
      }
      getArtistImage()
    }
  }, [artistImage])

  return (
    <div className="playlist-area" style={{ backgroundColor }}>
      {Object.entries(artistImage).length !== 0 ? (
        <Canvas
          text="Hello world!"
          // @ts-ignore
          image={artistImage}
          setPlaylistImage={doNothing}
        />
      ) : null}
      <div className="playlist-text" style={{ color: '#30336b' }}>
        We made you a playlist of the tracks you have in common with{' '}
        {props.matchName}, and tracks that you might like from their tastes!
      </div>
      <Button
        className="btn-round sign-in-button"
        size="md"
        onClick={props.handleClick}
      >
        Let Me See
      </Button>
    </div>
  )
}
