import React from 'react'
import LogInButton from './LogInButton'
import { Helmet } from 'react-helmet'
import { Row, Col } from 'reactstrap'

// core components
import Navbar from '../Navbars/Navbar'
// import Footer from 'components/Footer/Footer.jsx'

// import bigChartData from 'variables/charts.jsx'

const LandingPage = (props: any) => {
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
      <div className="wrapper landing-page">
        <div className="page-header">
          <div className="content-center">
            <Row className="row-grid justify-content-between align-items-center text-left">
              <Col lg="8" md="8">
                <h1 className="text-white">
                  Compare your music taste with friends{' '}
                  <span>
                    <br />
                    (or strangers!)
                  </span>
                </h1>
                <p className="text-white mb-5">
                  Log in with Spotify to find out how compatible your music
                  taste is with your friends. Get your code, and share it with
                  others to see how your taste stacks up against the rest of the
                  world!
                </p>
                <div className="btn-wrapper">
                  <LogInButton />
                </div>
              </Col>
              <Col lg="4" md="5">
                {/* <img
                    alt="..."
                    className="img-fluid"
                    src={require('../../assets/img/etherum.png')}
                  /> */}
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  )
}

export default LandingPage
