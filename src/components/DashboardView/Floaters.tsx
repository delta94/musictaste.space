import { motion } from 'framer-motion'
import Vibrant from 'node-vibrant'
import React from 'react'
import { Artist } from 'react-spotify-api'
import { float, zoomFadeIn } from '../../constants/animationVariants'

const _ArtistFloaters = (props: {
  spotifyData: ISpotifyUserData
  setMenuColors: (
    bg: string,
    title: string,
    hex1: string,
    hex2: string,
    hex3: string
  ) => void
}) => {
  const topArtists = props.spotifyData.topArtistsLongTerm
    .slice(0, 31)
    .map((val) => val.id)

  const artistURIs: string[] = []
  const m =
    new Date().getMinutes() + 1 === 31 ? 29 : new Date().getMinutes() + 1
  artistURIs.push(topArtists[m % 31])
  artistURIs.push(topArtists[((m % 31) + m) % 31])
  artistURIs.push(topArtists[((m % 31) + 2 * m) % 31])
  const colors: { [x: string]: string } = {
    bg: 'none',
    title: '#130f40',
    hex1: '#130f40',
    hex2: '#130f40',
    hex3: '#130f40',
  }
  const updateColors = async (artists: SpotifyApi.ArtistObjectFull[]) => {
    await Vibrant.from(artists[0].images[0]?.url)
      .getPalette()
      .then((palette) => {
        if (palette.LightVibrant && palette.DarkMuted) {
          colors.bg = palette.LightVibrant.hex
          colors.title = palette.DarkMuted.hex
        }
      })
    await Vibrant.from(artists[1].images[0]?.url)
      .getPalette()
      .then((palette) => {
        if (palette.DarkVibrant && palette.Muted && palette.DarkMuted) {
          colors.hex1 = palette.Muted.hex
          colors.hex2 = palette.DarkVibrant.hex
          colors.hex3 = palette.DarkMuted.hex
        }
      })
    props.setMenuColors(
      colors.bg,
      colors.title,
      colors.hex1,
      colors.hex2,
      colors.hex3
    )
  }

  const createDivs = (artists: SpotifyApi.ArtistObjectFull[]) => {
    updateColors(artists)
    return artists.map((artist, index) => (
      <motion.div
        className={'spotify-cards card' + (index + 1).toString()}
        key={'artist.id' + index.toString()}
        animate="float"
        style={{ backgroundColor: 'unset' }}
        variants={float((index + 1) / 2, 3)}
      >
        <motion.div
          style={{
            height: '100%',
            width: '100%',
            backgroundSize: 'contain',
            backgroundImage: `url(${artist.images[0]?.url})`,
          }}
          key={'artistFloat' + index.toString()}
          initial="initial"
          animate="enter"
          variants={zoomFadeIn((index + 1) / 4)}
        />
      </motion.div>
    ))
  }
  return (
    <div className="me">
      <Artist key={artistURIs[0]} id={artistURIs}>
        {(artists: SpotifyApi.MultipleArtistsResponse) =>
          artists ? createDivs(artists.artists) : null
        }
      </Artist>
    </div>
  )
}

export const ArtistFloaters = React.memo(_ArtistFloaters, () => true)
