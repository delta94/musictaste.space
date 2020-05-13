import { Timestamp } from '@firebase/firestore-types'
import React, { useContext, useEffect, useState } from 'react'
import GoogleAnalytics from 'react-ga'
import { useHistory } from 'react-router-dom'
import { Button } from 'reactstrap'
import { AuthContext } from '../../contexts/Auth'
import firebase from '../../util/Firebase'
import MatchCard from './MatchCard'

const MatchContainer = () => {
  const history = useHistory()
  const [matches, setMatches] = useState([] as any)
  const [morePages, setMorePages] = useState(false)
  const { currentUser, userData } = useContext(AuthContext)
  const [lastDoc, setLastDoc] = useState(false as any)
  const [lastPage, setLastPage] = useState(0)
  const [loadPage, setLoadPage] = useState(0)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const loadMatches = async (user: IUserProfile) => {
      const LIMIT = 10
      if (user.importData && user.importData.exists) {
        setLoading(true)
        let matchRef
        if (!lastDoc) {
          matchRef = firebase.app
            .firestore()
            .collection('users')
            .doc(currentUser.uid)
            .collection('matches')
            .orderBy('matchDate', 'desc')
            .limit(LIMIT)
        } else {
          matchRef = firebase.app
            .firestore()
            .collection('users')
            .doc(currentUser.uid)
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
    if (loadPage !== lastPage && !loading) {
      loadMatches(userData)
    }
  }, [loadPage, userData, currentUser.uid, lastDoc, matches, lastPage, loading])

  useEffect(() => {
    setLoadPage(1)
  }, [])

  const removeMatch = (id: string) => (e: any) => {
    e.stopPropagation()
    setMatches(matches.filter((m: any) => m.id !== id))
    firebase.deleteMatch(currentUser.uid, id)
    GoogleAnalytics.event({
      category: 'Interaction',
      label: 'Remove Match',
      action: 'Deleted a match from the Compatibility page',
    })
  }

  const handleLoadMore = (e: any) => {
    setLoadPage(loadPage + 1)
  }
  const onCardClick = (matchId: string, matchDate: Timestamp, id: string) => (
    e: any
  ) => {
    GoogleAnalytics.event({
      category: 'Interaction',
      label: 'Visit Match',
      action: 'Visit a match from the Compatibility page',
    })
    if (Object.entries(userData).length) {
      if (matchDate.toDate() < userData.importData.lastImport.toDate()) {
        history.push('/match/' + matchId + '?r=1&rp=0')
      } else {
        history.push('/match/' + matchId + '?r=1')
      }
    } else {
      history.push('/match/' + matchId + '?r=1')
    }
  }

  return (
    <>
      <div className="matches">
        <div className="matches-container">
          {matches.map((doc: any) => {
            return (
              <MatchCard
                history={history}
                matchData={doc}
                key={doc.id}
                onRemove={removeMatch(doc.id)}
                onClick={onCardClick(
                  doc.data().matchId,
                  doc.data().matchDate,
                  doc.id
                )}
              />
            )
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
