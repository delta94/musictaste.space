import { differenceInMinutes } from 'date-fns'
import React, { useContext, useEffect, useState } from 'react'
import Spotify from 'spotify-web-api-js'
import { AuthContext } from '../../contexts/Auth'
const RecentMatch = ({
  data,
  setColors,
  region,
  altTextColor,
  textColor,
}: {
  data: IMatchData
  setColors: (s: string) => void
  region: string | undefined
  altTextColor: string
  textColor: string
}) => {
  const [artistBackgroundURL, setArtistBackgroundURL] = useState('')
  const [artists, setArtists] = useState<SpotifyApi.ArtistObjectFull[]>([])
  const { currentUser, spotifyToken } = useContext(AuthContext)
  useEffect(() => {
    if (artistBackgroundURL !== '') {
      setColors(artistBackgroundURL)
    }
  }, [artistBackgroundURL, setColors])

  useEffect(() => {
    const getArtistImage = async () => {
      const s = new Spotify()
      s.setAccessToken(spotifyToken)
      const artists = await s
        .getArtists(data.matchedArtists.slice(0, 8).map((i) => i.id))
        .then((d) => d.artists)
        .catch(() => [])
      if (artists.length) {
        setArtists(artists)
        setArtistBackgroundURL(artists[0].images[0]?.url)
      } else {
        setArtists([])
      }
    }
    if (data?.matchedArtists?.length && spotifyToken) {
      getArtistImage()
    }
  }, [data, spotifyToken])

  return (
    <div
      id={Math.round(Math.random() * 100).toString()}
      className="row animated fadeInUp recent-match"
    >
      <div className="col-md-3 col-6 d-flex flex-column align-items-center justify-content-center">
        {artists.length > 0 ? (
          <img alt="artist" src={artists[0].images[0]?.url} />
        ) : (
          <div className="d-flex align-items-center justify-content-center">
            {currentUser ? 'No artists!' : 'Loading...'}
          </div>
        )}
      </div>
      <div className="col-md-3 col-6 d-flex flex-column align-items-center justify-content-center">
        {artists.length > 1 ? (
          <img alt="artist" src={artists[1].images[0]?.url} />
        ) : null}
      </div>
      <div className="col-md-3 col-6 d-flex flex-column mt-3">
        <div className="region-heading" style={{ color: textColor }}>
          Region
        </div>
        <div className="region-name" style={{ color: altTextColor }}>
          {region ? region : 'n/a'}
        </div>
        <div className="region-heading" style={{ color: textColor }}>
          Compatibility
        </div>
        <div className="region-name" style={{ color: altTextColor }}>
          {Math.round(data.score * 100)}%
        </div>
      </div>
      <div className="col-md-3 col-6 d-flex flex-column mt-3">
        <div className="artist-heading" style={{ color: textColor }}>
          Matched Artists
        </div>
        <div className="" style={{ color: altTextColor }}>
          {data.matchedArtists.length && artists.length
            ? artists
                .map((a) => a.name)
                .map((a) => (
                  <>
                    {a}
                    <br />
                  </>
                ))
            : '...'}
        </div>
      </div>
    </div>
  )
}

export default RecentMatch
