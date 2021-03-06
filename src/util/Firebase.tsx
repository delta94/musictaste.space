import { DocumentData } from '@firebase/firestore-types'
import firebase from 'firebase/app'
import { firestore } from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/messaging'

interface IUserData extends DocumentData {
  data?: {
    accessToken: string
    accessTokenRefresh: string
    anonId: string
    displayName: string
    refreshToken: string
    spotifyAuthCode: string
    spotifyID: string
    profilePicUrl: string
    importData: {
      exists: boolean
      lastImport?: Date
      status?: {
        topTracks: boolean
        topArtists: boolean
        relatedArtists: boolean
        genres: boolean
        specialSauce: boolean
      }
      loading?: boolean
    }
  }
}

class Firebase {
  public app: firebase.app.App
  public messaging: null | firebase.messaging.Messaging
  private functions: {
    httpsCallable: (s: string) => firebase.functions.HttpsCallable
  }
  constructor() {
    this.app = firebase.initializeApp(
      JSON.parse(atob(process.env.REACT_APP_FIREBASE_INIT as string))
    )
    this.functions = this.app.functions('asia-northeast1')
    if (process.env.NODE_ENV === 'development') {
      const functions = firebase.functions()
      functions.useFunctionsEmulator('http://localhost:5001')
      this.functions = functions
    }
    this.messaging = firebase.messaging.isSupported()
      ? this.app.messaging()
      : null
  }

  /**
   * Returns the stored SpotifyToken for a given user.
   * @param uid User ID of logged in user
   * @returns access token or null
   */
  public async getSpotifyToken(uid: string): Promise<string | undefined> {
    const doc = await this.app.firestore().collection('users').doc(uid).get()
    if (!doc.exists) {
      return undefined
    } else {
      const data: IUserData | undefined = doc.data()
      if (data) {
        return data.accessToken
      }
    }
    return undefined
  }

  /**
   * Returns the Spotify display name of a user.
   * @param uid User ID of a user
   */
  public async getDisplayName(uid: string): Promise<string | undefined> {
    const doc = await this.app.firestore().collection('users').doc(uid).get()
    if (!doc.exists) {
      return undefined
    } else {
      const data: IUserData | undefined = doc.data()
      if (data) {
        return data.displayName
      }
    }
    return undefined
  }

  /**
   * Returns the URL for the profile picture of a user.
   * @param uid User ID
   */
  public async getProfilePicture(uid: string): Promise<string | undefined> {
    const doc = await this.app.firestore().collection('users').doc(uid).get()
    if (!doc.exists) {
      return undefined
    } else {
      const data = doc.data() as IUserData
      if (data) {
        return data.profilePicUrl
      }
    }
    return undefined
  }

  /**
   * Refreshes and returns a new spotify access token for a given user.
   * @param uid User ID
   */
  public async refreshSpotifyToken(uid: string): Promise<string | undefined> {
    const cf = this.functions.httpsCallable('refreshCredentials')
    const data = await cf({}).then((res) => res.data)
    if (data) {
      return data.token
    } else {
      return undefined
    }
  }

  public async importSpotifyData(
    uid: string,
    force = false
  ): Promise<{ success: boolean; error?: string }> {
    const cf = this.functions.httpsCallable('getSpotifyData')
    const call = await cf({ uid, force }).then((res) => res.data)
    return call
      ? call
      : { success: false, error: 'function did not send a response' }
  }

  public async compareUsers(
    user: string,
    matchUser: string,
    state: string,
    uid: string,
    region: string,
    tries = 0
  ): Promise<{ success: boolean; error?: string; code?: string }> {
    const cf = this.functions.httpsCallable('compareUsers')
    const res = await cf({
      userId: user,
      compareUserId: matchUser,
      state,
      uid,
      region,
    }).then((res) => res.data)
    if (res.success) {
      return { success: true, code: res.matchId }
    }
    if (!res.success) {
      return { success: false, error: res.error || 'Internal server error.' }
    } else {
      return { success: false, error: 'Internal server error.' }
    }
  }

  /**
   * Get the status of Spotify import data for a user.
   * @param uid User ID
   */
  public async getImportStatus(
    uid: string
  ): Promise<IImportStatus | undefined> {
    const doc = await this.app.firestore().collection('users').doc(uid).get()
    if (!doc.exists) {
      return undefined
    } else {
      const data = doc.data() as IUserData
      if (data) {
        if (typeof data.importData === 'undefined') {
          return {
            exists: false,
            lastImport: undefined,
            status: {
              topTracks: false,
              topArtists: false,
              relatedArtists: false,
              genres: false,
              specialSauce: false,
            },
          }
        }
        return data.importData
      }
    }
    return undefined
  }

  /**
   * Returns all imported Spotify data for a given user.
   * @param uid User ID
   */
  public async getSpotifyData(uid: string) {
    const doc = await this.app.firestore().collection('spotify').doc(uid).get()
    if (!doc.exists) {
      return undefined
    } else {
      const data = doc.data() as ISpotifyUserData
      if (data) {
        return data
      }
    }
    return undefined
  }

  /**
   * Returns info about a user based on a match id.
   * @param id match id of a user
   */
  public async getUserFromID(
    id: string
  ): Promise<IUsersLookupData | undefined> {
    const doc = await this.app
      .firestore()
      .collection('users-lookup')
      .doc(id)
      .get()
    if (!doc.exists) {
      return undefined
    } else {
      const data = doc.data() as IUsersLookupData
      if (data) {
        return data
      }
    }
    return undefined
  }

  /**
   * Returns whether a user has a pre-existing match with an id.
   * @param id match id of a user
   */
  public async userHasMatchForId(
    user: string,
    id: string
  ): Promise<IPreviewMatchData | boolean> {
    const doc = await this.app
      .firestore()
      .collection('users')
      .doc(user)
      .collection('matches')
      .doc(id)
      .get()
    if (doc.exists) {
      const d = doc.data()
      return d ? (d as IPreviewMatchData) : false
    } else {
      return false
    }
  }

  /**
   * Returns information about a match from a given matchId
   * @param matchId match id unique to two users
   */
  public async getMatch(matchId: string): Promise<IMatchData | undefined> {
    const doc = await this.app
      .firestore()
      .collection('matches')
      .doc(matchId)
      .get()
    if (!doc.exists) {
      return undefined
    } else {
      const data = doc.data() as IMatchData
      if (data) {
        return data
      }
    }
    return undefined
  }

  /**
   * Returns whether a user has access to a certain matchId
   * @param user userId of query
   * @param matchId match id unique to two users
   */
  public async userHasMatchForMatchId(
    user: string,
    matchId: string
  ): Promise<{ exists: boolean; id?: string; data?: IPreviewMatchData }> {
    const collection = await this.app
      .firestore()
      .collection('users')
      .doc(user)
      .collection('matches')
      .where('matchId', '==', matchId)
      .get()
    if (collection.empty) {
      return { exists: false }
    } else {
      return {
        exists: true,
        id: collection.docs[0].id,
        data: collection.docs[0].data() as IPreviewMatchData,
      }
    }
  }

  public async generatePlaylist(
    matchId: string,
    reqUser: string,
    accessToken: string
  ): Promise<{
    success: boolean
    error?: string[]
    tracks?: string[]
  }> {
    const cf = this.functions.httpsCallable('createPlaylist')
    const data = await cf({
      matchId,
      userId: reqUser,
      token: accessToken,
    }).then((res) => res.data)
    if (data) {
      return data
    } else {
      return { success: false }
    }
  }

  public async getAverages(
    region: string
  ): Promise<{
    hasRegion: boolean
    region?: string
    data: INationalAverage
    stdDev: number
  }> {
    const globalData = await this.app
      .firestore()
      .collection('app')
      .doc('averages')
      .get()
      .then((d) => d.data())
    const regionalData = (await this.app
      .firestore()
      .collection('app')
      .doc('averages')
      .collection('countries')
      .doc(region)
      .get()
      .then((d) => (d.exists ? d.data() : undefined))) as INationalAverage
    if (regionalData && regionalData.total > 100) {
      return {
        hasRegion: true,
        region,
        data: regionalData as INationalAverage,
        stdDev: (globalData as INationalAverage).stdDev || 20,
      }
    } else {
      return {
        hasRegion: false,
        data: globalData as INationalAverage,
        stdDev: (globalData as INationalAverage).stdDev || 20,
      }
    }
  }

  public async deleteMatch(uid: string, id: string) {
    await this.app
      .firestore()
      .collection('users')
      .doc(uid)
      .collection('matches')
      .doc(id)
      .delete()
  }

  /**
   * Requests permission to send notifications to the user and
   * updates the relevant Firestore document.
   * @param uid user's musictaste uid
   */
  public async requestNotificationPermission(uid: string) {
    if (this.messaging) {
      return this.messaging.requestPermission().then(async () => {
        if (!this.messaging) {
          throw Error('Unsupported browser.')
        }
        const token = await this.messaging.getToken()
        console.log('[Notifications 📲] token:', token)
        let currentTokens = await this.app
          .firestore()
          .collection('users')
          .doc(uid)
          .get()
          .then((d) => d.data() as IUserProfile)
          .then((profile) => profile.notificationTokens)

        if (currentTokens) {
          let index = -1
          for (const [i, device] of Array.from(currentTokens.entries())) {
            if (device.title === navigator.userAgent) {
              index = i
            }
          }
          if (index !== -1) {
            currentTokens.splice(index, 1)
          }
          currentTokens.push({
            token,
            dateCreated: firestore.Timestamp.fromDate(new Date()),
            title: navigator.userAgent,
          })
        } else {
          currentTokens = [
            {
              token,
              dateCreated: firestore.Timestamp.fromDate(new Date()),
              title: navigator.userAgent,
            },
          ]
        }
        console.log('[Notifications 📲] writing:', currentTokens)
        await this.app.firestore().collection('users').doc(uid).set(
          {
            notificationTokens: currentTokens,
            notifications: true,
          },
          { merge: true }
        )
      })
    } else {
      throw Error('Unsupported browser.')
    }
  }

  public async disableNotifications(uid: string) {
    return this.app
      .firestore()
      .collection('users')
      .doc(uid)
      .set({ notificationTokens: [], notifications: false }, { merge: true })
  }
}

export default new Firebase()
