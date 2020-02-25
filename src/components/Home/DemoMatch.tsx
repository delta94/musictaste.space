import Color from 'color'
import Vibrant from 'node-vibrant'
import React, { useEffect, useRef, useState } from 'react'
import CountUp from 'react-countup'
import Reward from 'react-rewards'

const DemoMatch = ({ demoData }: { demoData: IDemoData }) => {
  const percentageRef = useRef(null)
  const [artistBackgroundURL, setArtistBackgroundURL] = useState(
    demoData.matches[0].topArtists[0].images[0]
  )
  const [backgroundColor, setBackgroundColor] = useState('#c7ecee')
  const [textColor, setTextColor] = useState('black')
  const [altTextColor, setAltTextColor] = useState('black')
  const [altBackgroundColor, setAltBackgroundColor] = useState('#dff9fb')

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
            setAltBackgroundColor(d.hex())
            setBackgroundColor(c.hex())
          }
        })
    }
    if (artistBackgroundURL !== '') {
      setColors(artistBackgroundURL)
    }
  }, [artistBackgroundURL])

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
  const { topTrack, topArtists, score } = demoData.matches[0]
  return (
    <>
      <div className="header-container" style={{ backgroundColor }}>
        <div className="flex-container">
          <div className="user-results-container">
            <div className="profile-container animated fadeInUp">
              <div className="user1">
                <div
                  style={{
                    backgroundImage: `url(${demoData.users[0].imageURL})`,
                  }}
                  className="profile-img"
                />
              </div>
              <div className="user2">
                <div
                  style={{
                    backgroundImage: `url(${demoData.users[1].imageURL})`,
                  }}
                  className="profile-img"
                />
              </div>
            </div>
            <div>
              <p
                className="profile-names animated fadeInUp"
                style={{ color: textColor }}
              >
                {demoData.users[0].name} × {demoData.users[1].name}
              </p>
            </div>
            <div className="top-tiles">
              <div className="top-box animated fadeInUp">
                <p className="top-title" style={{ color: altTextColor }}>
                  Top Artist In Common
                </p>
                <div
                  className="spotify-container shadow-lg"
                  style={{ backgroundColor: altBackgroundColor }}
                  onClick={onClickHandle(topArtists[0].external_urls.spotify)}
                >
                  <img
                    src={topArtists[0].images[0]}
                    className="top-image"
                    alt=""
                  />
                  <p className="artist-name" style={{ color: textColor }}>
                    {topArtists[0].name}
                  </p>
                </div>
              </div>
              <div className="top-box animated fadeInUp">
                <p className="top-title" style={{ color: altTextColor }}>
                  Top Track In Common
                </p>
                <div
                  className="spotify-container shadow-lg"
                  style={{ backgroundColor: altBackgroundColor }}
                  onClick={onClickHandle(topTrack.external_urls.spotify)}
                >
                  <img src={topTrack.images[0]} className="top-image" alt="" />
                  <p className="track-name" style={{ color: textColor }}>
                    {topTrack.name}
                    <br />
                    <strong>{topTrack.artist}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="score-and-artist">
            <div className="top-artist animated fadeInRightBig">
              <img src={topArtists[1].images[0]} className="artist" alt="" />
            </div>
            <div className="top-artist-2 animated fadeInRightBig">
              <img src={topArtists[2].images[0]} className="artist" alt="" />
            </div>
            <div className="top-artist-3 animated fadeInRightBig">
              <img src={topArtists[3].images[0]} className="artist" alt="" />
            </div>
            <div
              className="score animated slideInRight"
              style={{ color: altTextColor }}
            >
              <span>
                <Reward type="emoji" config={config} ref={percentageRef}>
                  <CountUp
                    delay={0}
                    start={0}
                    end={Math.round(score * 100)}
                    duration={5}
                  />
                  <span className="percent-symbol">%</span>
                </Reward>
              </span>
            </div>
          </div> */}
        </div>
      </div>
    </>
  )
}
export default DemoMatch
