import { motion } from 'framer-motion'
import React, { useContext, useState } from 'react'
import GoogleAnalytics from 'react-ga'
import { useHistory } from 'react-router-dom'
import { Button, Modal } from 'reactstrap'
import { float } from '../../constants/animationVariants'
import { AuthContext } from '../../contexts/Auth'
import { UserDataContext } from '../../contexts/UserData'
import useWindowSize from '../../hooks/useWindowSize'
import { clearStorage } from '../../util/clearLocalStorage'
import firebase from '../../util/Firebase'
import SizedConfetti from '../../util/SizedConfetti'

const ProfileModal = (props: { isOpen: boolean; toggleModal: () => void }) => {
  const history = useHistory()
  const { currentUser } = useContext(AuthContext)
  const { userData } = useContext(UserDataContext)
  const [displayConfetti, setDisplayConfetti] = useState(false)
  const { width, height } = useWindowSize()

  const signOut = () => {
    firebase.app.auth().signOut()
    props.toggleModal()
    clearStorage()
    GoogleAnalytics.event({
      category: 'Account',
      label: 'Sign Out',
      action: 'Signed out from modal',
    })
    history.push('/')
    window.location.reload()
  }

  const ToAccountSettings = () => {
    history.push('/account')
  }

  const toTally = () => {
    GoogleAnalytics.event({
      category: 'App',
      label: 'Tally',
      action: 'Visited tally page from modal',
    })
    history.push('/tally')
  }

  const shootConfetti = () => {
    if (!displayConfetti) {
      setDisplayConfetti(true)
      setTimeout(() => setDisplayConfetti(false), 5000)
    }
  }
  return (
    <>
      {displayConfetti ? (
        <SizedConfetti
          // @ts-ignore
          confettiSource={{
            w: 10,
            h: 10,
            x:
              (width as number) > 900
                ? (width as number) / 2
                : (width as number) / 2,
            y: (height as number) / 4,
          }}
          run={displayConfetti}
          recycle={false}
          numberOfPieces={50}
          initialVelocityX={20}
          initialVelocityY={20}
        />
      ) : null}

      <Modal
        modalClassName="modal-mini modal-primary"
        isOpen={props.isOpen}
        toggle={props.toggleModal}
      >
        <div className="modal-header justify-content-left">
          <button className="close" onClick={props.toggleModal}>
            <i className="tim-icons icon-simple-remove text-white" />
          </button>
          <div className="d-flex flex-row justify-content-center">
            <div
              className="modal-img-div shadow-lg"
              style={{
                backgroundImage: `url(${currentUser?.photoURL})`,
              }}
              onClick={toTally}
            />
          </div>
        </div>
        <div className="modal-body">
          {userData ? (
            <>
              <div className="d-flex align-items-center justify-content-center">
                <motion.div
                  className="frame"
                  animate="float"
                  initial={{ opacity: 1 }}
                  variants={float()}
                >
                  <div className="logo-floater" onClick={shootConfetti} />
                </motion.div>
              </div>
            </>
          ) : null}

          <hr />
        </div>
        <div
          className="modal-footer"
          style={{ paddingBottom: '0em', marginBottom: '-1em' }}
        >
          <Button
            className="btn-neutral"
            color="link"
            type="button"
            onClick={ToAccountSettings}
          >
            Account Settings
          </Button>
        </div>
        <div className="modal-footer">
          <Button
            className="btn-neutral"
            color="link"
            type="button"
            onClick={signOut}
          >
            Sign Out
          </Button>
          <Button
            className="btn-neutral"
            color="link"
            onClick={props.toggleModal}
            type="button"
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default ProfileModal
