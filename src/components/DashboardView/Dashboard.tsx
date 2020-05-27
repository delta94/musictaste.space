import Color from 'color'
import differenceInDays from 'date-fns/differenceInDays'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import React, { useContext, useEffect, useState } from 'react'
import GoogleAnalytics from 'react-ga'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'
import { SpotifyApiContext } from 'react-spotify-api'
import { Col, Row } from 'reactstrap'
import styled from 'styled-components'
import { AuthContext } from '../../contexts/Auth'
import { UserDataContext } from '../../contexts/UserData'
import firebase from '../../util/Firebase'
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
  const { currentUser } = useContext(AuthContext)
  const {
    userData,
    spotifyToken,
    importData,
    startSub,
    endSub,
    subExists,
  } = useContext(UserDataContext)
  const history = useHistory()
  const [importStatus, setImportStatus] = useState({
    exists: false,
    loading: false,
  } as IImportStatus)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)
  useEffect(() => {
    if (userData) {
      if (!userData.importData) {
        setImportStatus(emptyImport)
      } else {
        setImportStatus(userData.importData)
      }
    }
  }, [userData])

  useEffect(() => {
    if (
      importStatus.exists &&
      currentUser &&
      differenceInDays(
        new Date(),
        importStatus?.lastImport?.toDate() as Date
      ) >= 7
    ) {
      if (!loading) {
        setLoading(true)
        firebase.importSpotifyData(currentUser?.uid || '')
        setImportStatus({ ...emptyImport, loading: true })
      }
    }
    const redirectMatch = localStorage.getItem('redirectMatch')
    const redirectPage = localStorage.getItem('redirectPage')
    if (importStatus.exists && currentUser) {
      if (redirectMatch) {
        localStorage.removeItem('redirectMatch')
        history.push('/request/' + redirectMatch)
      } else if (redirectPage) {
        localStorage.removeItem('redirectPage')
        history.push(redirectPage)
      }
    }
  }, [currentUser, importStatus, history, loading])

  const [backgroundColor, setBackgroundColor] = useState('#c7ecee')
  const [titleColor, setTitleColor] = useState('#130f40')
  const [menuColor1, setMenuColor1] = useState('#130f40')
  const [menuColor2, setMenuColor2] = useState('#130f40')
  const [menuColor3, setMenuColor3] = useState('#130f40')
  const [importClick, setImportClick] = useState(false)

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
  // const Menu4 = styled.a`
  //   border-bottom: ${'1px solid white'};
  //   color: white !important;
  //   :hover {
  //     background: white;
  //     color: ${backgroundColor} !important;
  //   }
  // `

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

  useEffect(() => {
    if (userData) {
      if (!userData.importData?.exists && !subExists) {
        startSub()
      }
      if (userData.importData?.exists && subExists) {
        if (
          differenceInSeconds(
            new Date(),
            userData.importData.lastImport?.toDate() as Date
          ) < 5
        ) {
          endSub()
        }
      }
    }
  }, [userData, subExists, startSub, endSub])

  const onGetSpotifyData = (e: any) => {
    startSub()
    e.stopPropagation()
    const brokenImport =
      importStatus.loading &&
      importStatus.lastImport &&
      differenceInSeconds(new Date(), importStatus.lastImport.toDate()) >= 4
    if (!importStatus.loading || brokenImport) {
      setImportClick(true)
      setImportStatus({ ...emptyImport, loading: true })
      firebase.importSpotifyData(currentUser?.uid || '').then((data) => {
        if (!data.success) {
          GoogleAnalytics.event({
            category: 'Error',
            action: 'Import Data Error',
            label: 'Not enough Spotify data displayed',
          })
          if (data.error) {
            setError(data.error)
          } else {
            setError('Unknown server error.')
          }
        } else {
          GoogleAnalytics.event({
            category: 'Interaction',
            action: 'Imported Spotify data',
            label: 'Import Data',
          })
        }
      })
    }
  }
  const onReimportSpotifyData = (e: any) => {
    startSub()
    e.stopPropagation()
    if (!importStatus.loading) {
      setImportClick(true)
      setImportStatus({ ...emptyImport, loading: true })
      firebase.importSpotifyData(currentUser?.uid || '', true).then((data) => {
        if (!data.success) {
          GoogleAnalytics.event({
            category: 'Error',
            action: 'Import Data Error',
            label: 'Not enough Spotify data displayed',
          })
          if (data.error) {
            setError(data.error)
          } else {
            setError('Unknown server error.')
          }
        } else {
          GoogleAnalytics.event({
            category: 'Interaction',
            action: 'Re-imported Spotify data',
            label: 'Re-import Data',
          })
        }
      })
    }
  }

  const onClickHandle = (route: string) => (e: any) => history.push(route)

  if (currentUser) {
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
              {importData ? (
                <ArtistFloaters
                  spotifyData={importData}
                  setMenuColors={setMenuColors}
                />
              ) : null}
              <NameBox className="me">
                <NameDiv>
                  <Row className="row-grid text-left me-max">
                    <Col lg="7" md="8">
                      <h1 className="mb-8" style={{ color: `${titleColor}` }}>
                        <strong>{currentUser.displayName}</strong>
                      </h1>
                      {error ? (
                        <>
                          <p
                            className="text-left"
                            style={{ color: titleColor }}
                          >
                            Oops{' '}
                            <span role="img" aria-label="sad-emoji">
                              😢!
                            </span>{' '}
                            There was an error with importing your Spotify data.
                          </p>
                          <p
                            className="text-left"
                            style={{ color: titleColor, fontSize: '0.7em' }}
                          >
                            Error: {error}
                          </p>
                          <a
                            href="#nothing"
                            onClick={() => window.location.reload()}
                            className="cool-link animated fadeInUp delay-3s"
                          >
                            Click here to retry
                          </a>
                        </>
                      ) : importStatus.exists ? (
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
                              importStatus.lastImport?.toDate() as Date,
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
                      ) : importStatus.loading &&
                        importStatus.lastImport &&
                        differenceInSeconds(
                          new Date(),
                          importStatus.lastImport.toDate()
                        ) < 4 ? (
                        <ImportStatus importStatus={importStatus} />
                      ) : importStatus.loading && importClick ? (
                        <ImportStatus importStatus={importStatus} />
                      ) : userData ? (
                        <>
                          <p className="menu menu-text">
                            {importStatus.loading
                              ? "Looks like something may have gone wrong, let's try that again..."
                              : 'Hey, first timer! Before we continue...'}
                          </p>
                          <Menu1
                            className="menu button1"
                            onClick={onGetSpotifyData}
                          >
                            Get My Spotify Data
                          </Menu1>
                        </>
                      ) : (
                        <p className="menu menu-text">Loading...</p>
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
