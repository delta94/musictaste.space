import { DocumentData } from '@firebase/firestore-types'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'

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
  private functions: {
    httpsCallable: (s: string) => firebase.functions.HttpsCallable
  }
  constructor() {
    this.app = firebase.initializeApp({
      apiKey: process.env.REACT_APP_FIREBASE_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID,
      measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
    })
    this.functions = this.app.functions('asia-northeast1')
    if (process.env.NODE_ENV === 'development') {
      const functions = firebase.functions()
      functions.useFunctionsEmulator('http://localhost:5001')
      this.functions = functions
    }
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
    const res = await fetch(
      (process.env.REACT_APP_FUNCTION_REFRESH_CREDENTIALS as string) +
        '?uid=' +
        uid
    ).catch((err) => {
      console.log(err)
      return undefined
    })
    if (res) {
      const data = (await res.json()) as {
        token?: string
        uid: string
        error?: any
      }
      return data.token
    }
  }

  public async importSpotifyData(uid: string, force = false): Promise<boolean> {
    const cf = this.functions.httpsCallable('getSpotifyData')
    const call = await cf({ uid, force }).then((res) => res.data)
    return call ? call.success : false
  }

  public async compareUsers(
    user: string,
    matchUser: string,
    state: string,
    uid: string,
    tries = 0
  ): Promise<string | boolean> {
    const cf = this.functions.httpsCallable('compareUsers')
    const res = await cf({
      userId: user,
      compareUserId: matchUser,
      state,
      uid,
    }).then((res) => res.data)
    if (res) {
      return res.matchId
    } else {
      if (tries === 2) {
        return false
      }
      return await this.compareUsers(user, matchUser, state, uid, tries + 1)
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
  ): Promise<{ exists: boolean; id?: string }> {
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
      return { exists: true, id: collection.docs[0].id }
    }
  }

  public async generatePlaylist(
    matchId: string,
    reqUser: string,
    state: string
  ): Promise<{
    success: boolean
    error?: string[]
    tracks?: string[]
  }> {
    const cf = this.functions.httpsCallable('createPlaylist')
    const data = await cf({ matchId, userId: reqUser, state }).then(
      (res) => res.data
    )
    if (data) {
      return data
    } else {
      return { success: false }
    }
  }

  public async createPlaylistInUser(
    userId: string,
    matchUser: string,
    playlistId: string,
    data: any
  ) {
    return await this.app
      .firestore()
      .collection('users')
      .doc(userId)
      .collection('matches')
      .doc(matchUser)
      .collection('playlists')
      .doc(playlistId)
      .set({ data })
  }

  public async getDemoData(): Promise<IDemoData | undefined> {
    const data = (await this.app
      .firestore()
      .collection('app')
      .doc('demo')
      .get()
      .then((doc) => doc.data())) as IDemoData
    return data
  }

  public async getAverages(
    region: string
  ): Promise<{ hasRegion: boolean; region?: string; data: INationalAverage }> {
    const regionalData = await this.app
      .firestore()
      .collection('app')
      .doc('averages')
      .collection('countries')
      .doc(region)
      .get()
      .then((d) => (d.exists ? d.data() : undefined))
    if (regionalData) {
      return {
        hasRegion: true,
        region,
        data: regionalData as INationalAverage,
      }
    } else {
      const globalData = await this.app
        .firestore()
        .collection('app')
        .doc('averages')
        .get()
        .then((d) => d.data())
      return { hasRegion: false, data: globalData as INationalAverage }
    }
  }
}

export default new Firebase()
