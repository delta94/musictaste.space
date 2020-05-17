import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Col, Row } from 'reactstrap'
// import Firebase from '../Firebase'
// import DemoMatch from './DemoMatch'
import LogInButton from './LogInButton'

// core components
import firebase from '../../util/Firebase'
import Navbar from '../Navbars/Navbar'

interface GlobalTally {
  users: number
  matches: number
  lastUpdated: Date
  lastMatchRegion: string
  lastMatch: IMatchData
  countries: number
}

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
                <p className="text-white mb-4">
                  Although this app uses the Spotify API, it is not affiliated
                  with Spotify.
                </p>
                <div className="btn-wrapper">
                  <LogInButton />
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <Row className="row justify-content-center align-items-center text-center home-tally">
          <Col xs="3">
            <p className="count">{tallyData ? tallyData.countries : '-'}</p>
            <p className="count-heading">Countries</p>
          </Col>
          <Col xs="3">
            <p className="count">
              {tallyData ? Math.floor(tallyData.users / 1000) : '-'}K
            </p>
            <p className="count-heading">Users</p>
          </Col>
          <Col xs="3">
            <p className="count">
              {tallyData ? Math.floor(tallyData.matches / 1000) : '-'}K
            </p>
            <p className="count-heading">Matches</p>
          </Col>
        </Row>
        <div className="container" style={{ marginBottom: '2em' }}>
          <hr />
          Made with ❤️ in Melbourne, Australia.
        </div>
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
