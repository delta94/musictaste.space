import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Col, Row } from 'reactstrap'
// import Firebase from '../Firebase'
// import DemoMatch from './DemoMatch'
import LogInButton from './LogInButton'

// core components
import firebase from '../../util/Firebase'
import Footer from '../Footer'
import Navbar from '../Navbars/Navbar'

const LandingPage = () => {
  const [tallyData, setTallyData] = useState<GlobalTally | null>(null)
  useEffect(() => {
    firebase.app
      .firestore()
      .collection('app')
      .doc('tally')
      .get()
      .then((doc) => setTallyData(doc.data() as GlobalTally))
  }, [])
  return (
    <>
      <Navbar />
      <Helmet>
        <title>Compare Your Music Taste! - musictaste.space</title>
        <meta
          name="description"
          content="Sign in with Spotify and get a unique code to share with your friends and find out how compatible your music tastes are! See insights into your listening habits, which tracks are most matched right now, and more!"
        />
      </Helmet>
      <div className="wrapper landing-page container">
        <div className="page-header">
          <div className="content-center">
            <Row className="row-grid justify-content-between align-items-center text-left">
              <Col lg="4" md="5">
                <img
                  alt="musictaste.space logo"
                  className="img-fluid"
                  src={'/logo.png'}
                />
              </Col>
              <Col lg="8" md="8">
                <h1 className="text-white">
                  Compare your music taste with friends{' '}
                  <span>
                    <br />
                    (or strangers!)
                  </span>
                </h1>
                <p className="text-white mb-2">
                  Log in with Spotify to find out how compatible your music
                  taste is with your friends. Get your code, and share it with
                  others to see how your taste stacks up against the rest of the
                  world!
                </p>
                <p className="text-white">
                  {tallyData
                    ? `So far, I've been to ${
                        tallyData.countries
                      } countries, calculated ${tallyData.matches
                        .toString()
                        .replace(
                          /(\d)(?=(\d\d\d)+(?!\d))/g,
                          '$1,'
                        )} compatibilities for ${tallyData.users
                        .toString()
                        .replace(
                          /(\d)(?=(\d\d\d)+(?!\d))/g,
                          '$1,'
                        )} users and counting!`
                    : 'One sec...'}
                </p>
                <p className="text-white mb-4">
                  Although I use the Spotify API, I'm not affiliated with
                  Spotify.
                </p>
                <div className="btn-wrapper">
                  <LogInButton />
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <Footer />
      </div>
      {/* <div className="demo" style={{ zIndex: 1000 }}>
        <div className="result-container">
          {demoData ? <DemoMatch demoData={demoData as any} /> : null}
        </div>
      </div> */}
    </>
  )
}

export default LandingPage
