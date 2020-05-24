import { Timestamp } from '@firebase/firestore-types'
import firebase from 'firebase'
import React, { useContext, useEffect, useState } from 'react'
import GoogleAnalytics from 'react-ga'
import { useHistory } from 'react-router-dom'
import Switch from 'react-switch'
import { useToasts } from 'react-toast-notifications'
import { Button, UncontrolledTooltip } from 'reactstrap'
import { AuthContext } from '../../contexts/Auth'
import { UserDataContext } from '../../contexts/UserData'
import Firebase from '../../util/Firebase'
import MatchCard from './MatchCard'

const MatchContainer = () => {
  const history = useHistory()
  const [matches, setMatches] = useState([] as any)
  const [morePages, setMorePages] = useState(false)
  const { currentUser } = useContext(AuthContext)
  const { userData } = useContext(UserDataContext)
  const { addToast } = useToasts()
  const [lastDoc, setLastDoc] = useState(false as any)
  const [lastPage, setLastPage] = useState(0)
  const [loadPage, setLoadPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [quickDelete, setQuickDelete] = useState(false)

  useEffect(() => {
    const loadMatches = async (user: IUserProfile) => {
      const LIMIT = 5
      if (user.importData && user.importData.exists) {
        setLoading(true)
        let matchRef
        if (!lastDoc) {
          matchRef = Firebase.app
            .firestore()
            .collection('users')
            .doc(currentUser?.uid || '')
            .collection('matches')
            .orderBy('matchDate', 'desc')
            .limit(LIMIT)
        } else {
          matchRef = Firebase.app
            .firestore()
            .collection('users')
            .doc(currentUser?.uid || '')
            .collection('matches')
            .orderBy('matchDate', 'desc')
            .limit(LIMIT)
            .startAfter(lastDoc)
        }
        const docs = await matchRef.get()
        setMatches(matches.concat(docs.docs))
        if (docs.docs.length) {
          setLastDoc(docs.docs[docs.docs.length - 1])
          setLastPage(loadPage)
        }
        docs.docs.length < LIMIT ? setMorePages(false) : setMorePages(true)
        setLoading(false)
      }
    }
    if (loadPage !== lastPage && !loading && userData) {
      loadMatches(userData)
    }
  }, [loadPage, userData, currentUser, lastDoc, matches, lastPage, loading])

  useEffect(() => {
    setLoadPage(1)
  }, [])

  const removeMatch = (id: string, name: string) => (
    e: React.MouseEvent<HTMLInputElement>
  ) => {
    e.stopPropagation()
    setMatches(
      matches.filter((m: firebase.firestore.DocumentSnapshot) => m.id !== id)
    )
    Firebase.deleteMatch(currentUser?.uid || '', id)
    GoogleAnalytics.event({
      category: 'Interaction',
      label: 'Remove Match',
      action: 'Deleted a match from the Compatibility page',
    })
    addToast(`Removed match with ${name}.`, {
      appearance: 'success',
      autoDismiss: true,
    })
  }

  const handleLoadMore = () => {
    setLoadPage(loadPage + 1)
  }
  const onCardClick = (
    matchId: string,
    matchDate: Timestamp,
    id: string
  ) => () => {
    GoogleAnalytics.event({
      category: 'Interaction',
      label: 'Visit Match',
      action: 'Visit a match from the Compatibility page',
    })
    if (userData) {
      if (
        userData.importData?.lastImport &&
        matchDate.toDate() < userData.importData.lastImport.toDate()
      ) {
        history.push('/match/' + matchId + '?r=1&rp=0')
      } else {
        history.push('/match/' + matchId + '?r=1')
      }
    } else {
      history.push('/match/' + matchId + '?r=1')
    }
  }

  const toggleQuickDelete = (b: boolean) => {
    if (b) {
      setQuickDelete(true)
      GoogleAnalytics.event({
        category: 'Interaction',
        label: 'Quick Delete',
        action: 'Toggled quick delete mode on',
      })
      addToast(
        'Pressing delete on matches will remove them without confirmation.',
        {
          appearance: 'warning',
          autoDismiss: true,
        }
      )
    } else {
      setQuickDelete(false)
    }
  }

  return (
    <>
      <div
        style={{ marginBottom: '1em' }}
        className="compatibility title-div sub-title d-flex justify-content-between align-items-center"
      >
        <a id="matches" className="compatibility title" href="#matches">
          Matches
        </a>
        <div className="match-options d-flex flex-row mr-2">
          <div className="d-flex flex-row">
            <div className="trash-container d-flex align-items-center justify-content-center">
              <i
                id="auto-delete-icon"
                style={{
                  color: quickDelete ? '#c0392b' : '#16264c',
                  fontSize: '1.5em',
                  transition: '0.1s',
                }}
                className="far fa-trash-alt trash ml-1 mr-3"
              />
              <UncontrolledTooltip
                placement="bottom"
                target="auto-delete-icon"
                delay={0}
              >
                Delete matches without confirmation
              </UncontrolledTooltip>
              <Switch
                checked={quickDelete}
                onChange={toggleQuickDelete}
                onColor="#3c6382"
                onHandleColor="#2c3e50"
                handleDiameter={25}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={40}
                className="react-switch"
                id="auto-delete-switch"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="matches">
        <div className="matches-container">
          {matches.map((doc: firebase.firestore.DocumentSnapshot) => {
            const data = doc.data() as IPreviewMatchData
            if (data) {
              return (
                <MatchCard
                  matchData={doc}
                  key={doc.id}
                  quickDelete={quickDelete}
                  onRemove={removeMatch(doc.id, data.displayName)}
                  onClick={onCardClick(data.matchId, data.matchDate, doc.id)}
                />
              )
            }
            return null
          })}
        </div>
        {morePages ? (
          <div className="load-more">
            <Button
              className="btn-round sign-in-button"
              size="lg"
              onClick={handleLoadMore}
            >
              Load More
            </Button>
          </div>
        ) : null}
      </div>
    </>
  )
}

export default MatchContainer
