import React from 'react'
import GoogleAnalytics from 'react-ga'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import About from './components/AboutView/About'
import Compatibility from './components/CompatibilityView/Compatibility'
import Dashboard from './components/DashboardView/Dashboard'
import HomeView from './components/Home/HomeView'
import Insights from './components/InsightsView/Insights'
import Login from './components/Login'
import Match from './components/MatchView/Match'
import Playlist from './components/PlaylistView/Playlist'
import Result from './components/ResultView/Result'
import { withTracker } from './contexts/Analytics'
import { AuthProvider } from './contexts/Auth'

/// <reference path="./global.d.ts" />
import { Helmet } from 'react-helmet'
import './assets/css/animate/animate.css'
import './assets/css/nucleo-icons.css'
import './assets/scss/blk-design-system-react.scss'

export default function SpotifyCompatibility() {
  GoogleAnalytics.initialize(process.env
    .REACT_APP_FIREBASE_MEASUREMENT_ID as string)
  return (
    <AuthProvider>
      <Helmet>
        <title>Compare Your Music Taste! - musictaste.space</title>
        <meta name="theme-color" content="#f6e58d" />
      </Helmet>
      <Router>
        <div>
          <Route exact={true} path="/" component={withTracker(HomeView)} />
          <Route exact={true} path="/about" component={withTracker(About)} />
          <Route
            exact={true}
            path="/dashboard"
            component={withTracker(Dashboard)}
          />
          <Route exact={true} path="/login" component={withTracker(Login)} />
          <Route
            exact={true}
            path="/compatibility"
            component={withTracker(Compatibility)}
          />
          <Route exact={true} path="/match" component={withTracker(Match)} />
          <Route
            exact={true}
            path="/playlist"
            component={withTracker(Playlist)}
          />
          <Route
            exact={true}
            path="/match/:matchId"
            component={withTracker(Result)}
          />
          <Route
            exact={true}
            path="/insights"
            component={withTracker(Insights)}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}
