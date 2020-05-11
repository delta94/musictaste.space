import React, { useContext, useEffect } from 'react'
import Navbar from '../Navbars/Navbar'
import EnterCode from './EnterCode'
import MatchContainer from './MatchContainer'
import UserCodes from './UserCodes'
import { Helmet } from 'react-helmet'
import { AuthContext } from '../../contexts/Auth'
import LogInButton from '../Home/LogInButton'

function Compatibility({ history }: { history: any }, ...props: any) {
  const { currentUser, userData } = useContext(AuthContext)
  useEffect(() => {
    if (currentUser && Object.entries(userData).length) {
      if (userData.importData && !userData.importData.exists) {
        history.push('/dashboard')
      }
    }
  }, [currentUser, userData])
  return (
    <>
      <Navbar />
      <Helmet>
        <title>Compatibililty - musictaste.space{}</title>
        <meta
          name="description"
          content="Get your unique code to share with your friends (or strangers)! \
          musicmatch.space is an app to help you see how compatible your music taste is with your friends."
        />
        <meta name="keywords" content="spotify,music,match,compatibility" />
      </Helmet>
      <div className="wrapper">
        {currentUser ? (
          <div className="container main-container">
            <div className="compatibility title-div page-title">
              <a
                id="your-code"
                className="compatibility title"
                href="#your-code"
              >
                Your Code
              </a>
            </div>
            <UserCodes />
            <div className="compatibility title-div sub-title">
              <a
                id="enter-a-code"
                className="compatibility title"
                href="#your-code"
              >
                Enter A Code
              </a>
            </div>
            <EnterCode history={history} userData={userData} />
            <div className="compatibility title-div  sub-title">
              <a id="matches" className="compatibility title" href="#matches">
                Matches
              </a>
            </div>
            <MatchContainer history={history} />
          </div>
        ) : (
          <div className="waiting">
            <div className="sign-in animated fadeInUp">
              <LogInButton />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Compatibility
