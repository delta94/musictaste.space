import Color from 'color'
import Vibrant from 'node-vibrant'
import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useToasts } from 'react-toast-notifications'
import { AuthContext } from '../../contexts/Auth'
import firebase from '../../util/Firebase'
import { Dot } from '../Aux/Dot'
import Footer from '../Footer'
import Navbar from '../Navbars/Navbar'
import RecentMatch from './RecentMatch'

const Tally = () => {
  const [tallyData, setTally] = useState<GlobalTally | undefined>(undefined)
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [textColor, setTextColor] = useState('#191414')
  const [altTextColor, setAltTextColor] = useState('#1db954')
  const { userData } = useContext(AuthContext)
  const { addToast } = useToasts()
  const setColors = async (image: string) => {
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
          setTextColor(t.hex())
          setAltTextColor(u.hex())
          setBackgroundColor(c.hex())
        }
      })
  }
  useEffect(() => {
    let sub = 0
    if (Object.entries(userData).length) {
      firebase.app
        .firestore()
        .collection('app')
        .doc('tally_live')
        .get()
        .then((doc) => {
          setTally(doc.data() as GlobalTally)
        })
      sub = setInterval(
        () =>
          firebase.app
            .firestore()
            .collection('app')
            .doc('tally_live')
            .get()
            .then((doc) => {
              setTally(doc.data() as GlobalTally)
            }),
        10e3
      )
    } else {
      firebase.app
        .firestore()
        .collection('app')
        .doc('tally_live')
        .get()
        .then((doc) => setTally(doc.data() as GlobalTally))
    }
    return () => clearInterval(sub)
  }, [userData])

  useEffect(() => {
    addToast(
      'musictaste.space is booming! Due to high demand totals are now being updated once a minute!',
      { appearance: 'warning', autoDismiss: true }
    )
    addToast(
      'To reduce load, the latest match will now only update every 10 seconds.',
      { appearance: 'warning', autoDismiss: true }
    )
  }, [addToast])

  return (
    <>
      <Navbar />
      <div className="tally" style={{ backgroundColor, color: textColor }}>
        <Helmet>
          <title>Global Tally - musictaste.space</title>
        </Helmet>
        <div className="container" style={{ paddingTop: '5em' }}>
          {tallyData ? (
            <>
              <div className="tally-heading">
                Global Tally{' '}
                {Object.entries(userData).length ? <Dot>·</Dot> : null}
              </div>
              <div className="row">
                <div className="col-6 d-flex flex-column align-items-center justify-content-center">
                  <div className="count" style={{ color: altTextColor }}>
                    {tallyData.users
                      .toString()
                      .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                  </div>
                  <div className="headings">Users</div>
                </div>
                <div className="col-6 d-flex flex-column align-items-center justify-content-center">
                  <div className="count" style={{ color: altTextColor }}>
                    {tallyData.matches
                      .toString()
                      .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                  </div>
                  <div className="headings">Matches</div>
                </div>
              </div>
              {Object.entries(userData).length ? (
                <>
                  <div className="heading-recent">Latest Match</div>
                  <RecentMatch
                    data={tallyData.lastMatch}
                    setColors={setColors}
                    region={tallyData.lastMatchRegion}
                    altTextColor={altTextColor}
                    textColor={textColor}
                  />
                </>
              ) : (
                <div className="d-flex mt-5 align-items-center justify-content-center">
                  Sign in to view Live data.
                </div>
              )}
            </>
          ) : (
            <div className="d-flex mt-5 align-items-center justify-content-center">
              Loading...
            </div>
          )}
        </div>
        <div className="w-100 mt-4" />
        <Footer />
        <div className="w-100 pb-1" />
      </div>
    </>
  )
}

export default Tally
