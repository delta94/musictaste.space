import { Timestamp } from '@firebase/firestore-types'
import Color from 'color'
import { formatDistance } from 'date-fns'
import { motion } from 'framer-motion'
import Vibrant from 'node-vibrant'
import React, { useContext, useEffect, useState } from 'react'
import Spotify from 'spotify-web-api-js'
import styled from 'styled-components'
import { UserDataContext } from '../../contexts/UserData'
import RemoveModal from './RemoveModal'

interface IUserMatchData {
  anon: boolean
  displayName: string
  matchDate: Timestamp
  photoURL: string
  score: number
  bgCode: { type: 'artist' | 'track' | ''; id: string }
}

const MatchCard = ({
  matchData,
  onClick,
  onRemove,
  quickDelete,
  matchId,
}: {
  matchData: IPreviewMatchData
  matchId: string
  quickDelete?: boolean
  onClick: (e: React.MouseEvent<HTMLInputElement>) => void
  onRemove?: (e: React.MouseEvent<HTMLInputElement>) => void
}) => {
  const { spotifyToken } = useContext(UserDataContext)
  const [bgImageURL, setBgImageURL] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const toggleModal = () => setModalOpen(!modalOpen)
  const data = matchData

  useEffect(() => {
    const spotify = new Spotify()
    spotify.setAccessToken(spotifyToken)
    if (data && spotifyToken) {
      if (data.bgCode.type === 'artist') {
        spotify.getArtist(data.bgCode.id).then((res) => {
          setBgImageURL(res.images[0]?.url)
        })
      } else if (data.bgCode.type === 'track' && data.bgCode.id) {
        spotify.getTrack(data.bgCode.id).then((res) => {
          setBgImageURL(res.album.images[0]?.url)
        })
      }
    }
  }, [data, spotifyToken])

  const [textColor, setTextColor] = useState('#130f40')
  const [altTextColor, setAltTextColor] = useState('#130f40')
  const [gradientColor, setGradientColor] = useState('#dff9fb')

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
      <motion.div className="a-match" animate={true}>
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
              onClick={onClick}
            />
          )}

          <div className="text-stack" onClick={onClick}>
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
          <div className="profile-code" onClick={onClick}>
            {data.anon ? <></> : matchId}
          </div>
          <div
            className="score"
            style={{
              color: altTextColor,
              textShadow: '0 0 15px ' + gradientColor.toString(),
            }}
            onClick={onClick}
          >
            {(data.score * 100).toFixed(0)}
          </div>

          <i
            className="fas fa-chevron-right arrow"
            aria-hidden="true"
            style={{ color: textColor }}
            onClick={onClick}
          />
        </div>
        {onRemove ? (
          <div
            className="trash-container d-flex align-items-center justify-content-center"
            onClick={quickDelete ? onRemove : toggleModal}
          >
            <i
              style={{ color: textColor }}
              className="far fa-trash-alt trash"
            />
          </div>
        ) : null}
        <BgColorDiv className="bg-color" onClick={onClick} />
        <div className="bg-img-div">
          <img className="bg-img" src={bgImageURL} alt="" />
        </div>
      </motion.div>
    </>
  )
}

export default React.memo(MatchCard)
