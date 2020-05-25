import format from 'date-fns/format'
import formatDistance from 'date-fns/formatDistance'
import React, { useContext, useState } from 'react'
import GoogleAnalytics from 'react-ga'
import { useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { Button, Modal } from 'reactstrap'
import { AuthContext } from '../../contexts/Auth'
import { UserDataContext } from '../../contexts/UserData'
import { clearStorage } from '../../util/clearLocalStorage'
import firebase from '../../util/Firebase'
import { Dot } from '../Aux/Dot'

const ProfileModal = (props: { isOpen: boolean; toggleModal: () => void }) => {
  const history = useHistory()
  const { currentUser } = useContext(AuthContext)
  const { userData, fromCache } = useContext(UserDataContext)
  const { addToast } = useToasts()
  const [cacheCleared, setCacheCleared] = useState(false)

  const clearCache = () => {
    clearStorage()
    addToast('Cache cleared 👍. Refresh the page.', { appearance: 'success' })
    setCacheCleared(true)
  }
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
            backgroundImage: `url(${currentUser?.photoURL})`,
          }}
          onClick={toTally}
        />
      </div>
      <div className="modal-body">
        <div className="text-left d-flex" style={{ fontSize: '1.3em' }}>
          <p>
            <strong>{currentUser?.displayName}</strong>
          </p>
        </div>
        <hr />
        {userData ? (
          <>
            <div className="row">
              <div className="col-8 text-left d-flex flex-column">
                <span className="data-title">
                  <strong>Profile ID</strong>
                </span>
                <span className="data">
                  {currentUser?.uid || ''.replace('spotify:', '')}
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
              <div className="col-8 text-left d-flex flex-column">
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
                  <strong>Created</strong>
                </span>
                <span className="data">
                  {userData.created
                    ? format(userData.created.toDate(), 'd MMMM yy')
                    : 'Legacy'}
                </span>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-4 text-left d-flex flex-column">
                <span className="data-title cache" onClick={clearCache}>
                  <strong>Cache {!fromCache ? <Dot>•</Dot> : ''}</strong>
                </span>
                <span className="data">
                  {cacheCleared
                    ? 'Cleared'
                    : fromCache
                    ? formatDistance(fromCache, new Date())
                    : 'Fresh'}
                </span>
              </div>
              <div className="col-4 text-left d-flex flex-column">
                <span className="data-title">
                  <strong>Token</strong>
                </span>
                <span className="data">
                  {userData.accessTokenRefresh &&
                    formatDistance(
                      userData.accessTokenRefresh.toDate(),
                      new Date()
                    )}
                </span>
              </div>
              <div className="col-4 text-left d-flex flex-column">
                <span className="data-title">
                  <strong>Import</strong>
                </span>
                <span className="data">
                  {userData.importData?.exists && userData.importData.lastImport
                    ? format(
                        userData.importData.lastImport.toDate(),
                        'd MMMM yy'
                      )
                    : 'None'}
                </span>
              </div>
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
