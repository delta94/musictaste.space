import { Timestamp } from '@firebase/firestore-types'
import { motion } from 'framer-motion'
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
import MatchDataProvider from './MatchDataProvider'

const MatchContainer = () => {
  const history = useHistory()
  const [matches, setMatches] = useState<Array<[string, IPreviewMatchData]>>([])
  const [morePages, setMorePages] = useState(false)
  const { currentUser } = useContext(AuthContext)
  const { userData } = useContext(UserDataContext)
  const { addToast } = useToasts()
  const [loadPage, setLoadPage] = useState(0)
  const [lastPage, setLastPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [quickDelete, setQuickDelete] = useState(false)
  const [MDP, setMDP] = useState<null | MatchDataProvider>(null)

  useEffect(() => {
    const loadMatches = async (user: IUserProfile) => {
      const LIMIT = 10
      if (user.importData && user.importData.exists) {
        setLoading(true)
        if (!MDP) {
          const latestMatch = await Firebase.app
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
          setMatches(data)
          setMorePages(mdp.morePages)
          setLastPage(loadPage)
        } else {
          const data = await MDP.moreMatches(LIMIT)
          setMatches(data)
          setMorePages(MDP.morePages)
          setLastPage(loadPage)
        }
        setLoading(false)
      }
    }
    if (loadPage !== lastPage && !loading && userData) {
      loadMatches(userData)
    }
  }, [loadPage, userData, currentUser, matches, lastPage, loading, MDP])

  useEffect(() => {
    setLoadPage(1)
  }, [])

  const removeMatch = (id: string, name: string) => (
    e: React.MouseEvent<HTMLInputElement>
  ) => {
    e.stopPropagation()
    if (MDP) {
      setMatches(MDP.deleteMatch(id))
    }
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
        <motion.div className="matches-container" animate={true}>
          {matches.length ? (
            matches.map(([id, match]) => {
              if (match) {
                return (
                  <MatchCard
                    matchData={match}
                    matchId={id}
                    key={id}
                    quickDelete={quickDelete}
                    onRemove={removeMatch(id, match.displayName)}
                    onClick={onCardClick(match.matchId, match.matchDate, id)}
                  />
                )
              }
              return null
            })
          ) : (
            <div className="pl-3 pr-3 text-center animated fadeInUp delay-2s">
              If you had matches, they would appear here. Get machin&apos;!
            </div>
          )}
        </motion.div>
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
