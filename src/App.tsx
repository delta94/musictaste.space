import React from 'react'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import { AuthProvider } from './contexts/Auth'
import PageHeader from './components/Home/PageHeader'
import Login from './components/Login'
import Me from './components/MeView/Me'

/// <reference path="./global.d.ts" />
import './assets/css/nucleo-icons.css'
import './assets/scss/blk-design-system-react.scss'
import PrivateRoute from './components/PrivateRoute'

// This site has 3 pages, all of which are rendered
// dynamically in the browser (not server rendered).
//
// Although the page does not ever refresh, notice how
// React Router keeps the URL up to date as you navigate
// through the site. This preserves the browser history,
// making sure things like the back button and bookmarks
// work properly.

export default function BasicExample() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Route exact={true} path="/" component={PageHeader} />
          <PrivateRoute exact={true} path="/dashboard" component={Me} />
          <Route exact={true} path="/login" component={Login} />
        </div>
      </Router>
    </AuthProvider>
  )
}

// You can think of these components as "pages"
// in your app.

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  )
}
