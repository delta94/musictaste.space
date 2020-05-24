import React, { useContext, useEffect, useState } from 'react'
import GoogleAnalytics from 'react-ga'
import { useHistory } from 'react-router'
import { Button } from 'reactstrap'
import { AuthContext } from '../../contexts/Auth'
import { UserDataContext } from '../../contexts/UserData'
import firebase from '../../util/Firebase'
import MatchCard from '../CompatibilityView/MatchCard'

const MatchContainer = () => {
  const history = useHistory()
  const [matches, setMatches] = useState([] as any)
  const [morePages, setMorePages] = useState(false)
  const { currentUser } = useContext(AuthContext)
  const { userData } = useContext(UserDataContext)
  const [lastDoc, setLastDoc] = useState(false as any)
  const [loadPage, setLoadPage] = useState(0)
  const [lastPage, setLastPage] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadMatches = async (user: IUserProfile) => {
      const LIMIT = 10
      if (user.importData) {
        setLoading(true)
        let matchRef
        if (!lastDoc) {
          matchRef = firebase.app
            .firestore()
            .collection('users')
            .doc(currentUser?.uid || '')
            .collection('matches')
            .orderBy('matchDate', 'desc')
            .limit(LIMIT)
        } else {
          matchRef = firebase.app
            .firestore()
            .collection('users')
            .doc(currentUser?.uid || '')
            .collection('matches')
            .orderBy('matchDate', 'desc')
            .limit(LIMIT)
            .startAfter(lastDoc)
        }
        const docs = await matchRef.get()
        setMatches(
          matches.concat(docs.docs.filter((d) => d.data().score > 0.5))
        )
        setLastPage(loadPage)
        if (docs.docs.length) {
          setLastDoc(docs.docs[docs.docs.length - 1])
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

  const onCardClick = (matchId: string) => (e: any) => {
    GoogleAnalytics.event({
      category: 'Interaction',
      label: 'Visit Playlist',
      action: 'Visited create playlist page from playlist page',
    })
    history.push('/playlist/' + matchId)
  }

  const handleLoadMore = (e: any) => {
    setLoadPage(loadPage + 1)
  }
  return (
    <>
      <div className="matches">
        <div className="matches-container">
          {matches.map((doc: any) => {
            return (
              <MatchCard
                matchData={doc}
                key={doc.id}
                onClick={onCardClick(doc.data().matchId)}
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
