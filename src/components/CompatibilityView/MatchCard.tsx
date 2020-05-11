import { Timestamp } from '@firebase/firestore-types'
import Color from 'color'
import { formatDistance } from 'date-fns'
import Vibrant from 'node-vibrant'
import React, { useContext, useEffect, useState } from 'react'
import Spotify from 'spotify-web-api-js'
import styled from 'styled-components'
import { AuthContext } from '../../contexts/Auth'
import RemoveModal from './RemoveModal'

interface IUserMatchData {
  anon: boolean
  displayName: string
  matchDate: Timestamp
  matchId: string
  photoURL: string
  score: number
  bgCode: { type: 'artist' | 'track' | ''; id: string }
}

const MatchCard = ({
  matchData,
  onClick,
  onRemove,
}: {
  history: any
  matchData: any
  onClick: (e: any) => void
  onRemove?: (e: any) => void
}) => {
  const { spotifyToken, currentUser } = useContext(AuthContext)
  const [bgImageURL, setBgImageURL] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const toggleModal = () => setModalOpen(!modalOpen)

  const spotify = new Spotify()
  spotify.setAccessToken(spotifyToken)
  const data = matchData.data() as IUserMatchData
  if (data.bgCode.type === 'artist') {
    spotify.getArtist(data.bgCode.id).then((res) => {
      setBgImageURL(res.images[0].url)
    })
  } else if (data.bgCode.type === 'track') {
    spotify.getTrack(data.bgCode.id).then((res) => {
      setBgImageURL(res.album.images[0].url)
    })
  }

  const [textColor, setTextColor] = useState('#130f40')
  const [altTextColor, setAltTextColor] = useState('#130f40')
  const [gradientColor, setGradientColor] = useState('white')

  useEffect(() => {
    const setColors = async (image: any) => {
      await Vibrant.from(image)
        .getPalette()
        .then((palette) => {
          if (
            palette.LightVibrant &&
            palette.DarkMuted &&
            palette.DarkVibrant
          ) {
            let c = Color(palette.LightVibrant.hex)
            const t = Color(palette.DarkMuted.hex)
            if (c.contrast(t) < 4) {
              c = c.lighten(0.4)
            } else if (c.contrast(t) < 7) {
              c = c.lighten(0.2)
            }
            setTextColor(t.hex())
            setGradientColor(c.hex())
            setAltTextColor(palette.DarkVibrant.hex)
          }
        })
    }
    if (bgImageURL !== '') {
      setColors(bgImageURL)
    }
  }, [bgImageURL])

  const BgColorDiv = styled.div`
    background-image: linear-gradient(
      to right,
      ${gradientColor},
      ${gradientColor},
      transparent
    );
    position: absolute;
    width: 1110px;
    height: 100px;
    border-radius: 50px;
    z-index: -1;
    transition: 2s;
    @media (max-width: 1200px) {
      width: 930px;
    }
    @media (max-width: 768px) {
      width: 510px;
    }
    @media (max-width: 600px) {
      width: 92vw;
    }
  `
  return (
    <>
      <RemoveModal
        isOpen={modalOpen}
        toggleModal={toggleModal}
        matchUser={data.displayName}
        // @ts-ignore
        deleteMatch={onRemove}
      />
      <div className="a-match animated fadeInUp" onClick={onClick}>
        <div className="text-div">
          {data.anon ? (
            <i
              className="fas fa-user-secret anon-profile"
              aria-hidden="true"
              style={{ color: altTextColor }}
            />
          ) : (
            <div
              className="profile-img-div"
              style={{ backgroundImage: `url(${data.photoURL})` }}
            />
          )}

          <div className="text-stack">
            <p className="displayName" style={{ color: textColor }}>
              {data.displayName}
            </p>
            <p
              className="displayName"
              style={{ color: textColor, fontSize: '1em', marginTop: '-5px' }}
            >
              {formatDistance(data.matchDate.toDate(), new Date())} ago
            </p>
          </div>
          <div className="profile-code">{data.anon ? <></> : matchData.id}</div>
          <div
            className="score"
            style={{
              color: altTextColor,
              textShadow: '0 0 15px ' + gradientColor.toString(),
            }}
          >
            {(data.score * 100).toFixed(0)}
          </div>

          <i
            className="fas fa-chevron-right arrow"
            aria-hidden="true"
            style={{ color: textColor }}
          />
        </div>
        <BgColorDiv className="bg-color" />
        <div className="bg-img-div">
          <img className="bg-img" src={bgImageURL} alt="" />
        </div>
      </div>
    </>
  )
}

export default MatchCard
