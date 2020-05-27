import qs from 'query-string'
import React from 'react'
import { Redirect, useHistory, useLocation } from 'react-router-dom'

const RedirectMatch = () => {
  const location = useLocation()
  const query = qs.parse(location.search)
  const history = useHistory()
  if (!query.request) {
    history.push('/compatibility')
  }
  return <Redirect to={`/request/${query.request}`} />
}

export default RedirectMatch
