import React, { useContext, useEffect, useState } from 'react'
import GoogleAnalytics from 'react-ga'
import { useHistory } from 'react-router'
import { Button } from 'reactstrap'
import { AuthContext } from '../../contexts/Auth'
import { UserDataContext } from '../../contexts/UserData'
import firebase from '../../util/Firebase'
import MatchCard from '../CompatibilityView/MatchCard'
import MatchDataProvider from '../CompatibilityView/MatchDataProvider'

const MatchContainer = () => {
  const history = useHistory()
  const [matches, setMatches] = useState<Array<[string, IPreviewMatchData]>>([])
  const [morePages, setMorePages] = useState(false)
  const { currentUser } = useContext(AuthContext)
  const { userData } = useContext(UserDataContext)
  const [loadPage, setLoadPage] = useState(0)
  const [lastPage, setLastPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [MDP, setMDP] = useState<null | MatchDataProvider>(null)

  useEffect(() => {
    const loadMatches = async (user: IUserProfile) => {
      const LIMIT = 10
      if (user.importData && user.importData.exists) {
        setLoading(true)
        if (!MDP) {
          const latestMatch = await firebase.app
            .firestore()
            .collection('users')
            .doc(currentUser?.uid || '')
            .collection('matches')
            .orderBy('matchDate', 'desc')
            .limit(1)
            .get()
            .then((d) => (d.empty ? null : d.docs[0].data()))

          const mdp = new MatchDataProvider(
            latestMatch as IPreviewMatchData,
            currentUser?.uid || ''
          )
          setMDP(mdp)
          const data = await mdp.initialise(LIMIT)
          setMatches(data.filter((d) => d[1].score > 0.5))
          setMorePages(mdp.morePages)
          setLastPage(loadPage)
        } else {
          const data = await MDP.moreMatches(LIMIT)
          setMatches(data.filter((d) => d[1].score > 0.5))
          setMorePages(MDP.morePages)
          setLastPage(loadPage)
        }
        setLoading(false)
      }
    }
    if (loadPage !== lastPage && !loading && userData) {
      loadMatches(userData)
    }
  }, [loadPage, userData, currentUser, lastPage, loading, MDP])

  useEffect(() => setLoadPage(1), [])

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
          {matches.map(([id, match]) => {
            return (
              <MatchCard
                matchId={id}
                matchData={match}
                key={id}
                onClick={onCardClick(match.matchId)}
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
