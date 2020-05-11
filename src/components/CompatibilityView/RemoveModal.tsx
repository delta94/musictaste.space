import React from 'react'
import { Button, Modal } from 'reactstrap'

interface RemoveModalProps {
  isOpen: boolean
  toggleModal: () => void
  matchUser: string
  deleteMatch: () => void
}
const RemoveModal = (props: RemoveModalProps) => {
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
      </div>
      <div className="modal-body">
        <p>
          <b>Are you sure you want to delete your match with</b>
        </p>
        <p>{props.matchUser}</p>
      </div>
      <div className="modal-footer">
        <Button
          className="btn-neutral"
          color="link"
          type="button"
          onClick={props.deleteMatch}
        >
          Delete
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

export default RemoveModal
