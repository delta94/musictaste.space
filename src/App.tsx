import React from 'react'
import GoogleAnalytics from 'react-ga'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { ToastProvider } from 'react-toast-notifications'

import AppWideToast from './AppWideToast'
import About from './components/AboutView/About'
import PrivacyPolicy from './components/AboutView/PrivacyPolicy'
import Compatibility from './components/CompatibilityView/Compatibility'
import Dashboard from './components/DashboardView/Dashboard'
import DeleteAccountView from './components/DeleteAccountView/DeleteAccountView'
import Discord from './components/DiscordView/Discord'
import HomeView from './components/Home/HomeView'
import Insights from './components/InsightsView/Insights'
import InsightsAll from './components/InsightsView/InsightsAll'
import LinkDiscord from './components/LinkDiscord'
import Lockdown from './components/LockdownView'
import Login from './components/Login'
import Match from './components/MatchView/Match'
import Create from './components/PlaylistView/Create'
import Playlist from './components/PlaylistView/Playlist'
import RedirectMatch from './components/RedirectView'
import Result from './components/ResultView/Result'
import Tally from './components/TallyView/Tally'

import { AuthProvider } from './contexts/Auth'
import { ServiceWorkerProvider } from './contexts/ServiceWorker'
import { UserDataProvider } from './contexts/UserData'
import { withTracker } from './hooks/withTracker'

/// <reference path="./global.d.ts" />
import { Helmet } from 'react-helmet'
import './assets/css/nucleo-icons.css'
import './assets/scss/blk-design-system-react.scss'

export default function SpotifyCompatibility() {
  GoogleAnalytics.initialize(
    process.env.REACT_APP_FIREBASE_MEASUREMENT_ID as string
  )
  const isMobile = window.matchMedia('only screen and (max-width: 350px)')
    .matches
  return (
    <ToastProvider placement="bottom-right">
      <ServiceWorkerProvider>
        <AuthProvider>
          <UserDataProvider>
            <AppWideToast>
              <Helmet>
                <title>Compare Your Music Taste! - musictaste.space</title>
                <meta name="theme-color" content="#f6e58d" />
              </Helmet>
              {isMobile ? (
                <div
                  style={{ height: '100vh', width: '100vw' }}
                  className="d-flex flex-column align-items-center justify-content-center"
                >
                  <span className="m-3 text-center">
                    Sorry, your device is unfortunately unsupported. Please
                    visit musictaste.space on a mobile device with a larger
                    screen or on a desktop.
                  </span>
                </div>
              ) : (
                <Router>
                  <div>
                    <Route
                      exact={true}
                      path="/"
                      component={withTracker(HomeView)}
                    />
                    <Route
                      exact={true}
                      path="/about"
                      component={withTracker(About)}
                    />
                    <Route
                      exact={true}
                      path="/privacy-policy"
                      component={withTracker(PrivacyPolicy)}
                    />
                    <Route
                      exact={true}
                      path="/dashboard"
                      component={withTracker(Dashboard)}
                    />
                    <Route
                      exact={true}
                      path="/login"
                      component={withTracker(Login)}
                    />
                    <Route
                      exact={true}
                      path="/compatibility"
                      component={withTracker(Compatibility)}
                    />
                    <Route
                      exact={true}
                      path="/match"
                      component={withTracker(RedirectMatch)}
                    />
                    <Route
                      exact={true}
                      path="/request/:matchId"
                      component={withTracker(Match)}
                    />
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
                    <Route
                      exact={true}
                      path="/insights/all"
                      component={withTracker(InsightsAll)}
                    />
                    <Route
                      exact={true}
                      path="/playlist/:matchId"
                      component={withTracker(Create)}
                    />
                    <Route
                      exact={true}
                      path="/discord"
                      component={withTracker(Discord)}
                    />
                    <Route
                      exact={true}
                      path="/discord/login"
                      component={withTracker(LinkDiscord)}
                    />
                    <Route
                      exact={true}
                      path="/tally"
                      component={withTracker(Tally)}
                    />
                    <Route
                      exact={true}
                      path="/account/delete"
                      component={withTracker(DeleteAccountView)}
                    />
                    <Route
                      exact={true}
                      path="/lockdown"
                      component={withTracker(Lockdown)}
                    />
                  </div>
                </Router>
              )}
            </AppWideToast>
          </UserDataProvider>
        </AuthProvider>
      </ServiceWorkerProvider>
    </ToastProvider>
  )
}
