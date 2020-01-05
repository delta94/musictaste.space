import React, { useContext } from 'react'
import { Button, Modal } from 'reactstrap'
import { AuthContext } from '../../contexts/Auth'
import firebase from '../Firebase'

//@ts-ignore
const ProfileModal = props => {
  const { currentUser } = useContext(AuthContext)

  const signOut = () => {
    firebase.app.auth().signOut()
  }

  return (
    <Modal
      modalClassName="modal-mini modal-primary"
      isOpen={props.isOpen}
      toggle={props.toggleModal}
    >
      <div className="modal-header justify-content-center">
        <button className="close" onClick={props.toggleModal}>
          <i className="tim-icons icon-simple-remove text-white" />
        </button>
        <img
          className="img-fluid rounded-circle shadow-lg"
          src={currentUser.photoURL}
          alt=""
        />
      </div>
      <div className="modal-body">
        <p>
          <b>{currentUser.displayName}</b>
        </p>
        <p>{currentUser.uid}</p>
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
