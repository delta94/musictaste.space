import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { AuthContext } from '../contexts/Auth'

// @ts-ignore
const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { currentUser } = useContext(AuthContext)
  console.log(currentUser)
  return (
    <Route
      {...rest}
      // tslint:disable-next-line: jsx-no-lambda
      render={routeProps => {
        if (currentUser) {
          return <RouteComponent {...routeProps} />
        } else {
          // return <Redirect to={'/login'} />
          return <RouteComponent {...routeProps} />
        }
      }}
    />
  )
}

export default PrivateRoute
