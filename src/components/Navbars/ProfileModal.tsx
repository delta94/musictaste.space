import differenceInMinutes from 'date-fns/differenceInMinutes'
import format from 'date-fns/format'
import React, { useContext } from 'react'
import GoogleAnalytics from 'react-ga'
import { useHistory } from 'react-router-dom'
import { Button, Modal } from 'reactstrap'
import { AuthContext } from '../../contexts/Auth'
import firebase from '../../util/Firebase'

const ProfileModal = (props: { isOpen: boolean; toggleModal: () => void }) => {
  const history = useHistory()
  const { currentUser, userData } = useContext(AuthContext)

  const signOut = () => {
    firebase.app.auth().signOut()
    props.toggleModal()
    GoogleAnalytics.event({
      category: 'Account',
      label: 'Sign Out',
      action: 'Signed out from modal',
    })
  }

  const deleteAccount = () => {
    history.push('/account/delete')
    GoogleAnalytics.event({
      category: 'Account',
      label: 'Delete Account',
      action: 'Visited delete account page',
    })
  }

  const toTally = () => {
    GoogleAnalytics.event({
      category: 'App',
      label: 'Tally',
      action: 'Visited tally page from modal',
    })
    history.push('/tally')
  }

  return (
    <Modal
      modalClassName="modal-mini modal-primary"
      isOpen={props.isOpen}
      toggle={props.toggleModal}
    >
      <div className="modal-header justify-content-left">
        <button className="close" onClick={props.toggleModal}>
          <i className="tim-icons icon-simple-remove text-white" />
        </button>
        <div
          className="modal-img-div shadow-lg"
          style={{
            backgroundImage: `url(${currentUser.photoURL})`,
          }}
          onClick={toTally}
        />
      </div>
      <div className="modal-body">
        <div className="text-left d-flex" style={{ fontSize: '1.3em' }}>
          <p>
            <strong>{currentUser.displayName}</strong>
          </p>
        </div>
        <hr />
        <div className="row">
          <div className="col-8 text-left d-flex flex-column">
            <span className="data-title">
              <strong>Profile ID</strong>
            </span>
            <span className="data">
              {currentUser.uid.replace('spotify:', '')}
            </span>
          </div>
          <div className="col-4 text-left d-flex flex-column">
            <span className="data-title">
              <strong>Country</strong>
            </span>
            <span className="data">
              {userData.region ? userData.region : 'n/a'}
            </span>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-4 text-left d-flex flex-column">
            <span className="data-title">
              <strong>Match Code</strong>
            </span>
            <span className="data">
              {userData.importData?.exists && userData.matchCode
                ? userData.matchCode
                : '-'}
            </span>
          </div>
          <div className="col-4 text-left d-flex flex-column">
            <span className="data-title">
              <strong>Anon Code</strong>
            </span>
            <span className="data">
              {userData.importData?.exists && userData.anonMatchCode
                ? userData.anonMatchCode
                : '-'}
            </span>
          </div>
          <div className="col-4 text-left d-flex flex-column">
            <span className="data-title">
              <strong>Data</strong>
            </span>
            <span className="data">
              {userData.importData?.exists
                ? format(userData.importData.lastImport.toDate(), 'd MMMM yy')
                : 'None'}
            </span>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-4 text-left d-flex flex-column">
            <span className="data-title">
              <strong>API</strong>
            </span>
            <span className="data">
              {userData.accessToken ? 'Connected' : 'Error'}
            </span>
          </div>
          <div className="col-4 text-left d-flex flex-column">
            <span className="data-title">
              <strong>Spotify</strong>
            </span>
            <span className="data">
              {userData.accessTokenRefresh &&
              differenceInMinutes(
                new Date(),
                userData.accessTokenRefresh.toDate() as Date
              ) < 60
                ? 'Token OK'
                : 'Token Expired'}
            </span>
          </div>
          <div className="col-4 text-left d-flex flex-column">
            <span className="data-title">
              <strong>Discord</strong>
            </span>
            <span className="data">
              {userData.discordId ? 'Linked' : 'Not Linked'}
            </span>
          </div>
        </div>
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
          onClick={deleteAccount}
        >
          Delete Account
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
  )
}

export default ProfileModal
