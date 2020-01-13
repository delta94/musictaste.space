import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/Auth'
import firebase from '../Firebase'
import MatchCard from './MatchCard'
import { Button } from 'reactstrap'

const MatchContainer = ({ history }: { history: any }, ...props: any) => {
  const [matches, setMatches] = useState([] as any)
  const [morePages, setMorePages] = useState(false)
  const { currentUser, userData } = useContext(AuthContext)
  const [lastDoc, setLastDoc] = useState(false as any)
  const [loadPage, setLoadPage] = useState(0)
  useEffect(() => {
    const loadMatches = async (user: any) => {
      const LIMIT = 5
      if (typeof user.importData !== 'undefined') {
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
        }
        docs.docs.length < LIMIT ? setMorePages(false) : setMorePages(true)
      }
    }
    loadMatches(userData)
  }, [loadPage, userData])

  const handleLoadMore = (e: any) => {
    setLoadPage(loadPage + 1)
  }
  return (
    <>
      <div className="matches">
        <div className="matches-container">
          {matches.map((doc: any) => {
            return <MatchCard history={history} matchData={doc} key={doc.id} />
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
