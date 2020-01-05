import React, { useContext, useState, useEffect } from 'react'
import { SpotifyApiContext } from 'react-spotify-api'
import { AuthContext } from '../../contexts/Auth'
import firebase from '../Firebase'
import Navbar from '../Navbars/Navbar'
import { ArtistFloaters } from './Floaters'
import ImportStatus from './ImportStatus'

import Color from 'color'

import { Row, Col } from 'reactstrap'
import styled from 'styled-components'

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

export function Me() {
  const { currentUser, spotifyToken } = useContext(AuthContext)
  const [importStatus, setImportStatus] = useState({
    exists: false,
    loading: false,
  } as IImportStatus)
  useEffect(() => {
    let sub = () => {}
    if (currentUser) {
      sub = firebase.app
        .firestore()
        .collection('users')
        .doc(currentUser.uid)
        .onSnapshot(doc => {
          const source = doc.metadata.hasPendingWrites
          if (!source) {
            // @ts-ignore
            if (typeof doc.data().importData === 'undefined') {
              setImportStatus({
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
              })
            } else {
              // @ts-ignore
              setImportStatus(doc.data().importData)
            }
          }
        })
    }
    return sub
  }, [currentUser])

  const [spotifyData, setSpotifyData] = useState({} as ISpotifyUserData)
  useEffect(() => {
    if (importStatus.exists) {
      firebase.getSpotifyData(currentUser.uid).then(data => {
        if (data) {
          console.log(data)
          setSpotifyData(data)
        }
      })
    }
  }, [importStatus])

  const [backgroundColor, setBackgroundColor] = useState('#c7ecee')
  const [titleColor, setTitleColor] = useState('#130f40')
  const [menuColor1, setMenuColor1] = useState('#130f40')
  const [menuColor2, setMenuColor2] = useState('#130f40')
  const [menuColor3, setMenuColor3] = useState('#130f40')

  let Menu1 = styled.a`
    border-bottom: ${'1px solid ' + menuColor1};
    color: ${menuColor1} !important;
    :hover {
      background: ${menuColor1};
      color: ${backgroundColor} !important;
    }
  `

  let Menu2 = styled.a`
    border-bottom: ${'1px solid ' + menuColor2};
    color: ${menuColor2} !important;
    :hover {
      background: ${menuColor2};
      color: ${backgroundColor} !important;
    }
  `

  let Menu3 = styled.a`
    border-bottom: ${'1px solid ' + menuColor3};
    color: ${menuColor3} !important;
    :hover {
      background: ${menuColor3};
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
    if (bg != 'none') {
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
    firebase.importSpotifyData(currentUser.uid)
  }

  if (currentUser && spotifyToken) {
    return (
      <>
        <SpotifyApiContext.Provider value={spotifyToken}>
          <Navbar />
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
                          <Menu1 className="menu button1">My Insights</Menu1>
                          <br />
                          <Menu2 className="menu button2">Compatibility</Menu2>
                          <br />
                          <Menu3 className="menu button3">
                            Me Against The World
                          </Menu3>
                          <br />
                        </>
                      ) : importStatus.loading ? (
                        <ImportStatus importStatus={importStatus} />
                      ) : (
                        <>
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
    return <Navbar />
  }
}

export default Me
