import Color from 'color'
import Vibrant from 'node-vibrant'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'

import { HashLink as Link } from 'react-router-hash-link'

const Header = ({
  spotifyData,
  userData,
  showMenu,
}: {
  spotifyData: ISpotifyUserData
  userData: IUserProfile
  showMenu: boolean
}) => {
  const [backgroundURL, setBackgroundURL] = useState('')
  const [backgroundColor, setBackgroundColor] = useState('#c7ecee')
  const [textColor, setTextColor] = useState('#c7ecee')
  const [altTextColor, setAltTextColor] = useState('#c7ecee')
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
            setTextColor(t.hex())
            setAltTextColor(u.hex())
            setBackgroundColor(c.hex())
          }
        })
    }
    if (backgroundURL !== '') {
      setColors(backgroundURL)
    }
  }, [backgroundURL])

  useEffect(() => {
    if (Object.entries(userData).length) {
      setBackgroundURL(userData.photoURL)
    }
  }, [userData])

  const handleReturn = (e: any) => {
    history.push('/dashboard')
  }
  return (
    <>
      <div className="insights-header" style={{ backgroundColor }}>
        <div className="user-insights-header row">
          <div className="profile-container animated fadeInUp col-md-4">
            <div className="user1">
              <div
                style={{ backgroundImage: `url(${userData.photoURL})` }}
                className="profile-img"
              />
            </div>
          </div>
          <div className="header-text col-md-8" style={{ color: textColor }}>
            Hey {userData.displayName}, check out your{' '}
            {showMenu ? 'favourite tracks & artists' : 'stats & insights'}{' '}
            below.
          </div>
        </div>
        {showMenu ? (
          <div className="col d-flex flex-row justify-content-center nav-link flex-wrap">
            <Link
              className="menu-link"
              smooth={true}
              to="#artists"
              style={{ color: altTextColor }}
            >
              Artists
            </Link>
            <Link
              className="menu-link"
              smooth={true}
              to="#tracks"
              style={{ color: altTextColor }}
            >
              Tracks
            </Link>
            {/* <Link className="menu-link" href="#" style={{ color: altTextColor }}>
            Mood
          </Link> */}
          </div>
        ) : (
          <div className="row">
            <div className="col d-flex flex-row justify-content-center nav-link flex-wrap">
              <Link to="/dashboard">Back To Dashboard</Link>
              <Link to="/insights/all">Top Tracks & Artists</Link>
            </div>
          </div>
        )}

        {/* <div className="button-div animated fadeInUp">
          <Button
            className="btn-round sign-in-button return-button "
            size="lg"
            onClick={handleReturn}
          >
            Return to Dashboard
          </Button>
        </div> */}
      </div>

      <div className="score-and-artist" />
    </>
  )
}
export default Header
