import Color from 'color'
import differenceInDays from 'date-fns/differenceInDays'
import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'
import { SpotifyApiContext } from 'react-spotify-api'
import { useToasts } from 'react-toast-notifications'
import { Col, Row } from 'reactstrap'
import styled from 'styled-components'
import { AuthContext } from '../../contexts/Auth'
import firebase from '../Firebase'
import LogInButton from '../Home/LogInButton'
import Navbar from '../Navbars/Navbar'
import { ArtistFloaters } from './Floaters'
import ImportStatus from './ImportStatus'

const NameDiv = styled.div`
  width: 100vw;
  padding-left: 180px;
  @media only screen and (max-width: 1280px) {
    padding-left: 100px;
  }
  @media only screen and (max-width: 600px) {
    padding: 30px;
    padding-top: 40vh;
  }
`
const NameBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  @media only screen and (max-width: 600px) {
    height: 100vh;
  }
`

const emptyImport = {
  exists: false,
  loading: false,
  lastImport: undefined,
  status: {
    topTracks: false,
    topArtists: false,
    relatedArtists: false,
    genres: false,
    specialSauce: false,
  },
}

export function Me() {
  const { currentUser, spotifyToken, userData } = useContext(AuthContext)
  const history = useHistory()
  const [importStatus, setImportStatus] = useState({
    exists: false,
    loading: false,
  } as IImportStatus)
  const [loading, setLoading] = useState(false)
  const { addToast } = useToasts()

  useEffect(() => {
    if (typeof userData.importData === 'undefined') {
      setImportStatus(emptyImport)
    } else {
      setImportStatus(userData.importData)
    }
  }, [userData])

  const [spotifyData, setSpotifyData] = useState({} as ISpotifyUserData)
  useEffect(() => {
    if (
      importStatus.exists &&
      currentUser &&
      differenceInDays(new Date(), importStatus.lastImport.toDate() as Date) >=
        7
    ) {
      if (!loading) {
        setLoading(true)
        firebase.importSpotifyData(currentUser.uid)
        setImportStatus({ ...emptyImport, loading: true })
      }
    }
    const redirectMatch = localStorage.getItem('redirectMatch')
    if (importStatus.exists && currentUser && redirectMatch) {
      localStorage.removeItem('redirectMatch')
      history.push('/match?request=' + redirectMatch)
    } else if (!importStatus.exists && currentUser) {
      firebase.getSpotifyData(currentUser.uid).then((data) => {
        if (data) {
          setSpotifyData(data)
        }
      })
    }
  }, [currentUser, importStatus])

  const [backgroundColor, setBackgroundColor] = useState('#c7ecee')
  const [titleColor, setTitleColor] = useState('#130f40')
  const [menuColor1, setMenuColor1] = useState('#130f40')
  const [menuColor2, setMenuColor2] = useState('#130f40')
  const [menuColor3, setMenuColor3] = useState('#130f40')

  const Menu1 = styled.a`
    border-bottom: ${'1px solid ' + menuColor1};
    color: ${menuColor1} !important;
    :hover {
      background: ${menuColor1};
      color: ${backgroundColor} !important;
    }
  `

  const Menu2 = styled.a`
    border-bottom: ${'1px solid ' + menuColor2};
    color: ${menuColor2} !important;
    :hover {
      background: ${menuColor2};
      color: ${backgroundColor} !important;
    }
  `

  const Menu3 = styled.a`
    border-bottom: ${'1px solid ' + menuColor3};
    color: ${menuColor3} !important;
    :hover {
      background: ${menuColor3};
      color: ${backgroundColor} !important;
    }
  `
  const Menu4 = styled.a`
    border-bottom: ${'1px solid white'};
    color: white !important;
    :hover {
      background: white;
      color: ${backgroundColor} !important;
    }
  `

  const setMenuColors = (
    bg: string,
    title: string,
    hex1: string,
    hex2: string,
    hex3: string
  ) => {
    if (bg !== 'none') {
      let c = Color(bg)
      const t = Color(title)
      if (c.contrast(t) < 4) {
        c = c.lighten(0.4)
      } else if (c.contrast(t) < 7) {
        c = c.lighten(0.2)
      }
      setBackgroundColor(c.hex())
    }
    setTitleColor(title)
    setMenuColor1(hex1)
    setMenuColor2(hex2)
    setMenuColor3(hex3)
  }

  const onGetSpotifyData = (e: any) => {
    e.stopPropagation()
    if (!importStatus.loading) {
      firebase.importSpotifyData(currentUser.uid)
      setImportStatus({ ...emptyImport, loading: true })
    }
  }
  const onReimportSpotifyData = (e: any) => {
    e.stopPropagation()
    if (!importStatus.loading) {
      firebase.importSpotifyData(currentUser.uid, true)
      setImportStatus({ ...emptyImport, loading: true })
    }
  }

  const onClickHandle = (route: string) => (e: any) => history.push(route)

  if (currentUser && spotifyToken) {
    return (
      <>
        <SpotifyApiContext.Provider value={spotifyToken}>
          <Navbar />
          <Helmet>
            <title>
              {currentUser.displayName} - musictaste.space{}
            </title>
            <meta
              name="description"
              content="Get your unique code to share with your friends (or strangers)! \
          musicmatch.space is an app to help you see how compatible your music taste is with your friends."
            />
            <meta name="keywords" content="spotify,music,match,compatibility" />
          </Helmet>
          <div
            className="wrapper"
            style={{ backgroundColor: `${backgroundColor}` }}
          >
            <div className="page-header">
              {Object.entries(spotifyData).length !== 0 ? (
                <ArtistFloaters
                  spotifyData={spotifyData}
                  setMenuColors={setMenuColors}
                />
              ) : (
                <></>
              )}
              <NameBox className="me">
                <NameDiv>
                  <Row className="row-grid text-left">
                    <Col lg="7" md="8">
                      <h1 className="mb-8" style={{ color: `${titleColor}` }}>
                        <strong>{currentUser.displayName}</strong>
                      </h1>
                      {importStatus.exists ? (
                        <>
                          <Menu1 className="menu button1">
                            <span
                              id="menu-button-1"
                              onClick={onClickHandle('/insights')}
                            >
                              My Insights
                            </span>
                          </Menu1>
                          <br />
                          <Menu2
                            className="menu button2"
                            unselectable="on"
                            onClick={onClickHandle('/compatibility')}
                          >
                            Compare With Others
                          </Menu2>
                          <br />
                          <Menu3
                            id="menu-button-3"
                            className="menu button3"
                            unselectable="on"
                            onClick={onClickHandle('/playlist')}
                          >
                            Make Me A Playlist
                          </Menu3>
                          <br />
                          {Math.abs(
                            differenceInDays(
                              importStatus.lastImport.toDate() as Date,
                              new Date()
                            )
                          ) >= 0 ? (
                            <>
                              <Menu1
                                className="menu button3"
                                unselectable="on"
                                onClick={onReimportSpotifyData}
                              >
                                Re-import My Data
                              </Menu1>
                              <br />
                            </>
                          ) : null}
                        </>
                      ) : importStatus.loading ? (
                        <ImportStatus importStatus={importStatus} />
                      ) : (
                        <>
                          <p className="menu menu-text">
                            Hey, first timer! Before we continue...
                          </p>
                          <Menu1
                            className="menu button1"
                            onClick={onGetSpotifyData}
                          >
                            Get My Spotify Data
                          </Menu1>
                        </>
                      )}
                    </Col>
                    <Col lg="3" md="3" />
                  </Row>
                </NameDiv>
              </NameBox>
            </div>
          </div>
        </SpotifyApiContext.Provider>
      </>
    )
  } else {
    return (
      <>
        <Navbar />
        <Helmet>
          <title>Your Dashboard - musictaste.space{}</title>
          <meta
            name="description"
            content="Sign in with Spotify to import your data. \
          musicmatch.space is an app to help you see how compatible your music taste is with your friends."
          />
        </Helmet>
        <div className="waiting">
          <div className="sign-in animated fadeInUp">
            <LogInButton />
          </div>
        </div>
      </>
    )
  }
}

export default Me
