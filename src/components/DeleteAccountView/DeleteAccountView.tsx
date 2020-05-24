import React, { useContext, useEffect, useState } from 'react'
import GoogleAnalytics from 'react-ga'
import Helmet from 'react-helmet'
import { useHistory } from 'react-router'
import { useToasts } from 'react-toast-notifications'
import { Button } from 'reactstrap'
import { UserDataContext } from '../../contexts/UserData'
import { clearStorage } from '../../util/clearLocalStorage'
import firebase from '../../util/Firebase'
import Navbar from '../Navbars/Navbar'

const DeleteAccountView = () => {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const { userData } = useContext(UserDataContext)
  const history = useHistory()
  const { addToast } = useToasts()
  useEffect(() => {
    if (done) {
      history.push('/')
    }
  })
  const onDelete = async () => {
    if (userData) {
      const matchCode = userData.matchCode
      const anonMatchCode = userData.anonMatchCode
      setLoading(true)
      console.log('deleting', matchCode)
      await firebase.app
        .firestore()
        .collection('users-lookup')
        .doc(matchCode)
        .delete()
        .catch((err) => console.error(err))
      console.log('deleting', anonMatchCode)
      await firebase.app
        .firestore()
        .collection('users-lookup')
        .doc(anonMatchCode)
        .delete()
        .catch((err) => console.error(err))
      console.log('deleting user')
      await firebase.app
        .auth()
        .currentUser?.delete()
        .catch(() =>
          setError(
            'A recent login is required to delete an account. Please log out and in again.'
          )
        )
      setLoading(false)
      setDone(true)
      addToast(
        'Account deleted successfully. If you log in again, a new account will be created.',
        { appearance: 'success', autoDismiss: false }
      )
      GoogleAnalytics.event({
        category: 'Account',
        label: 'Delete Account',
        action: 'Deleted user account',
      })
      clearStorage()
    }
  }
  return (
    <>
      <Navbar />
      <Helmet>
        <title>Delete Account - musictaste.space</title>
        <meta
          name="description"
          content="Delete your musictaste.space account."
        />
      </Helmet>
      <div className="about">
        <div className="container text-box">
          {' '}
          <h2 className="heading">Delete Account</h2>
          <div className="row">
            <div className="col-md-6">
              <p>
                Are you sure you want to delete your account? This is an{' '}
                <b>irreversible action</b>. Your data will be lost.
              </p>
              <p>
                By deleting your account, the following tasks will be performed:
              </p>
              <div>
                <ul style={{ fontSize: '1.1em', textAlign: 'justify' }}>
                  <li>
                    Your account will be removed from the musictaste.space
                    database.
                  </li>
                  <li>Your match codes will no longer work.</li>
                  <li>
                    Existing matches <strong>will</strong> be deleted from{' '}
                    <strong>your</strong> profile.
                  </li>
                  <li>
                    Existing matches <strong>will not</strong> be deleted from{' '}
                    <strong>other users</strong> you have already matched with.
                  </li>
                  <li>
                    Creating a new account will provision you with new match
                    codes and <strong>you will no longer have access</strong> to
                    your previous matches.
                  </li>
                </ul>
              </div>
              <p>
                Please note that deletion of match codes may take up to 30
                minutes to propagate.
              </p>
              <p>
                Before you continue,{' '}
                <strong>
                  please ensure you log out and back in again to verify your
                  identity, or the delete action will not complete successfully.{' '}
                </strong>
                To proceed, click the button below:
              </p>
              <div className="mt-2">
                {userData && !error ? (
                  <Button
                    className="btn-round sign-in-button"
                    size="md"
                    onClick={onDelete}
                  >
                    {loading ? 'Please Wait' : 'Delete Account'}
                  </Button>
                ) : null}
              </div>
              {error ? <p className="mt-3 text-center">{error}</p> : null}
              <div className="mb-5 mt-5" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeleteAccountView
