import React from 'react'
import LogInButton from "./LogInButton"

import {
  Card,
  CardBody,
  CardTitle,
  Container,
  Row,
  Col,
} from 'reactstrap'

// core components
import Navbar from '../Navbars/Navbar'
// import Footer from 'components/Footer/Footer.jsx'

// import bigChartData from 'variables/charts.jsx'

class LandingPage extends React.Component {
  componentDidMount() {
    document.body.classList.toggle('landing-page')
  }
  componentWillUnmount() {
    document.body.classList.toggle('landing-page')
  }
  render() {
    return (
      <>
        <Navbar />
        <div className="wrapper">
          <div className="page-header">
            <img
              alt="..."
              className="path"
              src={require('../../assets/img/blob.png')}
            />
            <img
              alt="..."
              className="path2"
              src={require('../../assets/img/path2.png')}
            />
            <img
              alt="..."
              className="shapes triangle"
              src={require('../../assets/img/triunghiuri.png')}
            />
            <img
              alt="..."
              className="shapes wave"
              src={require('../../assets/img/waves.png')}
            />
            <img
              alt="..."
              className="shapes squares"
              src={require('../../assets/img/patrat.png')}
            />
            <img
              alt="..."
              className="shapes circle"
              src={require('../../assets/img/cercuri.png')}
            />
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
                    others to see how your taste stacks up against the rest of
                    the world!
                  </p>
                    <div className="btn-wrapper">
                      <LogInButton/>
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
          <section className="section section-lg">
            <section className="section">
              <img
                alt="..."
                className="path"
                src={require('../../assets/img/path4.png')}
              />
              <Container>
                <Row className="row-grid justify-content-between">
                  <Col className="mt-lg-5" md="5">
                    <Row>
                      <Col className="px-2 py-2" lg="6" sm="12">
                        <Card className="card-stats">
                          <CardBody>
                            <Row>
                              <Col md="4" xs="5">
                                <div className="icon-big text-center icon-warning">
                                  <i className="tim-icons icon-trophy text-warning" />
                                </div>
                              </Col>
                              <Col md="8" xs="7">
                                <div className="numbers">
                                  <CardTitle tag="p">3,237</CardTitle>
                                  <p />
                                  <p className="card-category">Awards</p>
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col className="px-2 py-2" lg="6" sm="12">
                        <Card className="card-stats upper bg-default">
                          <CardBody>
                            <Row>
                              <Col md="4" xs="5">
                                <div className="icon-big text-center icon-warning">
                                  <i className="tim-icons icon-coins text-white" />
                                </div>
                              </Col>
                              <Col md="8" xs="7">
                                <div className="numbers">
                                  <CardTitle tag="p">3,653</CardTitle>
                                  <p />
                                  <p className="card-category">Commits</p>
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="px-2 py-2" lg="6" sm="12">
                        <Card className="card-stats">
                          <CardBody>
                            <Row>
                              <Col md="4" xs="5">
                                <div className="icon-big text-center icon-warning">
                                  <i className="tim-icons icon-gift-2 text-info" />
                                </div>
                              </Col>
                              <Col md="8" xs="7">
                                <div className="numbers">
                                  <CardTitle tag="p">593</CardTitle>
                                  <p />
                                  <p className="card-category">Presents</p>
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col className="px-2 py-2" lg="6" sm="12">
                        <Card className="card-stats">
                          <CardBody>
                            <Row>
                              <Col md="4" xs="5">
                                <div className="icon-big text-center icon-warning">
                                  <i className="tim-icons icon-credit-card text-success" />
                                </div>
                              </Col>
                              <Col md="8" xs="7">
                                <div className="numbers">
                                  <CardTitle tag="p">10,783</CardTitle>
                                  <p />
                                  <p className="card-category">Forks</p>
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                  <Col md="6">
                    <div className="pl-md-5">
                      <h1>
                        Large <br />
                        Achivements
                      </h1>
                      <p>
                        I should be capable of drawing a single stroke at the
                        present moment; and yet I feel that I never was a
                        greater artist than now.
                      </p>
                      <br />
                      <p>
                        When, while the lovely valley teems with vapour around
                        me, and the meridian sun strikes the upper surface of
                        the impenetrable foliage of my trees, and but a few
                        stray.
                      </p>
                      <br />
                      <a
                        className="font-weight-bold text-info mt-5"
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                      >
                        Show all{' '}
                        <i className="tim-icons icon-minimal-right text-info" />
                      </a>
                    </div>
                  </Col>
                </Row>
              </Container>
            </section>
          </section>
        </div>
      </>
    )
  }
}

export default LandingPage
