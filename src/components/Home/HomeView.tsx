import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Col, Row } from 'reactstrap'
import LogInButton from './LogInButton'

import {
  float,
  shrinkOnHover,
  zoomFadeIn,
} from '../../constants/animationVariants'
// core components
import { getTally } from '../../util/api'
import Footer from '../Footer'
import Navbar from '../Navbars/Navbar'

const LandingPage = () => {
  const [tallyData, setTallyData] = useState<GlobalTally | null>(null)
  useEffect(() => {
    getTally().then((data) => (data ? setTallyData(data as GlobalTally) : null))
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
      <motion.div
        className="wrapper landing-page container"
        initial="initial"
        animate="enter"
        variants={zoomFadeIn(0)}
      >
        <div className="page-header">
          <div className="content-center">
            <Row className="row-grid justify-content-between align-items-center text-left">
              <Col lg="4" md="5">
                <motion.div
                  className="frame"
                  animate="float"
                  initial={{ opacity: 1 }}
                  variants={float()}
                >
                  <motion.img
                    whileHover="hover"
                    initial="initial"
                    animate="enter"
                    alt="musictaste.space logo"
                    className="img-fluid"
                    src={'/logo.png'}
                    variants={shrinkOnHover()}
                  />
                </motion.div>
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
                    ? `I've calculated ${tallyData.matches
                        .toString()
                        .replace(
                          /(\d)(?=(\d\d\d)+(?!\d))/g,
                          '$1,'
                        )} matches for ${tallyData.users
                        .toString()
                        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')} pals in ${
                        tallyData.countries
                      } different countries and counting!`
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
      </motion.div>
      <Footer />

      {/* <div className="demo" style={{ zIndex: 1000 }}>
        <div className="result-container">
          {demoData ? <DemoMatch demoData={demoData as any} /> : null}
        </div>
      </div> */}
    </>
  )
}

export default LandingPage
