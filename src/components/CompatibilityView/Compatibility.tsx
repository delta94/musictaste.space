import React, { useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../../contexts/Auth'
import { UserDataContext } from '../../contexts/UserData'
import Footer from '../Footer'
import LogInButton from '../Home/LogInButton'
import Navbar from '../Navbars/Navbar'
import EnterCode from './EnterCode'
import MatchContainer from './MatchContainer'
import UserCodes from './UserCodes'

function Compatibility() {
  const history = useHistory()
  const { currentUser } = useContext(AuthContext)
  const { userData } = useContext(UserDataContext)

  useEffect(() => {
    if (currentUser && userData) {
      if (!userData.importData || !userData.importData?.exists) {
        history.push('/dashboard')
      }
    }
  })
  return (
    <>
      <Navbar />
      <Helmet>
        <title>Compatibilility - musictaste.space</title>
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
            {userData ? <EnterCode userData={userData} /> : null}
            <MatchContainer />
            <Footer />
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
