import Color from 'color'
import Vibrant from 'node-vibrant'
import React, { useContext, useEffect, useState } from 'react'
import GoogleAnalytics from 'react-ga'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import Spotify from 'spotify-web-api-js'
import styled from 'styled-components'
import { UserDataContext } from '../../contexts/UserData'
import { gradients } from '../../util/gradients'
import Canvas from '../PlaylistView/Canvas'
import CreatePlaylistButton from '../PlaylistView/CreatePlaylistButton'

interface CovidAnthemProps {
  tracks: SpotifyApi.TrackObjectFull[]
  artist: SpotifyApi.ArtistObjectFull
}

interface TrackProps {
  backgroundColor: string
  textColor: string
  track: SpotifyApi.TrackObjectFull
}

const Track = ({ backgroundColor, textColor, track }: TrackProps) => (
  <div
    className="spotify-container playlist shadow-lg"
    style={{ backgroundColor }}
    key={track.id}
  >
    <img src={track.album.images[0]?.url} className="top-image" alt="" />
    <p className="artist-name" style={{ color: textColor }}>
      {track.name}
      <br />
      {track.artists.map((a) => a.name).join(', ')}
      <br />
    </p>
  </div>
)

const CovidAnthem = ({ tracks, artist }: CovidAnthemProps) => {
  const [playlistImage, setPlaylistImage] = useState('')
  const { userData } = useContext(UserDataContext)
  const [backgroundColor, setBackgroundColor] = useState('#c7ecee')
  const [textColor, setTextColor] = useState(['#c7ecee', '#c7ecee'])
  const [artistBackgroundURL, setArtistBackgroundURL] = useState('')

  const gradient =
    gradients[
      Math.floor(
        Math.floor(new Date().getTime() / (60 * 1e3)) % gradients.length
      )
    ]

  const OverlayDiv = styled.div`
    position: absolute;
    background-image: linear-gradient(to bottom, transparent, ${gradient[0]});
  `

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
            setTextColor([t.hex(), t.darken(0.4).hex()])
            setBackgroundColor(c.hex())
          }
        })
    }
    if (artistBackgroundURL !== '') {
      setColors(artistBackgroundURL)
    }
  }, [artistBackgroundURL])

  useEffect(() => {
    if (artist) {
      setArtistBackgroundURL(artist.images[0]?.url)
    }
  }, [artist])

  async function createPlaylist(): Promise<{
    success: boolean
    uri?: string | undefined
    error?: {} | undefined
  }> {
    if (!userData) {
      return { success: false }
    }
    const s = new Spotify()
    let playlistError = false
    s.setAccessToken(userData.accessToken)
    if (tracks.length) {
      const d = (await s
        .createPlaylist(userData.spotifyID, {
          name: `My COVID-19 Tunes`,
          description: `A special playlist just for ${userData.displayName} full of the tunes that kept them company during COVID-19. Made on musictaste.space.`,
        })
        .then((res) => res)
        .catch((err) => (playlistError = err))) as { id: string }
      if (playlistError) {
        return { success: false }
      }
      await s.uploadCustomPlaylistCoverImage(d.id, playlistImage)
      s.addTracksToPlaylist(
        d.id,
        tracks.filter(Boolean).map((t) => t.uri)
      ).catch((err) => (playlistError = err))
      if (playlistError) {
        return { success: false }
      }
      const playlistData = await s
        .getPlaylist(d.id)
        .catch((err) => (playlistError = err))
      if (playlistError) {
        return { success: false }
      }
      GoogleAnalytics.event({
        category: 'Interaction',
        label: 'Create Playlist',
        action: 'Created Covid Anthem Playlist',
      })
      return {
        success: true,
        uri: (playlistData as SpotifyApi.PlaylistObjectFull).external_urls
          .spotify,
      }
    }
    return { success: false, error: playlistError }
  }
  return (
    <div
      id="playlist"
      className="covid-playlist h-100"
      style={{
        backgroundColor: textColor[0],
        backgroundImage: `linear-gradient(20deg, ${gradient[0]}, ${gradient[1]})`,
      }}
    >
      <div className="container pt-5">
        <div className="title text-center" style={{ color: 'white' }}>
          Your <span style={{ color: '#1DB954' }}>COVID-19</span> Tunes
        </div>
        <div className="subtitle text-center" style={{ color: 'white' }}>
          The songs that have kept you company during COVID-19.
        </div>
        <div className="row">
          <div className="col-md-6 d-flex flex-column justify-content-center align-items-center mt-3">
            {tracks.length && artist ? (
              <>
                <div>
                  <Canvas
                    text=""
                    image={artist.images[0]}
                    setPlaylistImage={setPlaylistImage}
                    covidPlaylist={true}
                  />
                </div>
              </>
            ) : null}
          </div>
          <div className="col-md-6 d-flex flex-column mt-3 d-flex align-items-center">
            <div className="playlist-track-container">
              <OverlayDiv className="playlist-overlay d-flex align-items-center justify-content-center">
                <CreatePlaylistButton createPlaylist={createPlaylist} />
              </OverlayDiv>
              <SimpleBar style={{ maxHeight: 400 }}>
                {tracks.length
                  ? tracks.map((t, i) => (
                      <Track
                        key={i}
                        backgroundColor={textColor[0]}
                        textColor={backgroundColor}
                        track={t}
                      />
                    ))
                  : null}
              </SimpleBar>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CovidAnthem
