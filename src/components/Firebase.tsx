import { DocumentData } from '@firebase/firestore-types'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

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
  }

  /**
   * Returns the stored SpotifyToken for a given user.
   * @param uid User ID of logged in user
   * @returns access token or null
   */
  public async getSpotifyToken(uid: string): Promise<string | undefined> {
    const doc = await this.app
      .firestore()
      .collection('users')
      .doc(uid)
      .get()
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
    const doc = await this.app
      .firestore()
      .collection('users')
      .doc(uid)
      .get()
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
    const doc = await this.app
      .firestore()
      .collection('users')
      .doc(uid)
      .get()
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
    ).catch(err => {
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
    const res = await fetch(
      force
        ? (process.env.REACT_APP_FUNCTION_GET_SPOTIFY_DATA as string) +
            '?force=true&uid=' +
            uid
        : (process.env.REACT_APP_FUNCTION_GET_SPOTIFY_DATA as string) +
            '?uid=' +
            uid
    ).catch(err => {
      console.log(err)
      return undefined
    })
    if (res) {
      const data = (await res.json()) as {
        success: boolean
      }
      return data.success
    } else {
      return false
    }
  }

  public async compareUsers(
    user: string,
    matchUser: string,
    state: string
  ): Promise<string | boolean> {
    const res = await fetch(
      (process.env.REACT_APP_FUNCTION_COMPARE_USERS as string) +
        '?userId=' +
        user +
        '&compareUserId=' +
        matchUser +
        '&state=' +
        state
    ).catch(err => {
      console.log(err)
      return undefined
    })
    if (res) {
      const data = (await res.json()) as {
        success: boolean
        matchId: string
      }
      console.log(data)
      return data.matchId
    } else {
      return false
    }
  }

  /**
   * Get the status of Spotify import data for a user.
   * @param uid User ID
   */
  public async getImportStatus(
    uid: string
  ): Promise<IImportStatus | undefined> {
    const doc = await this.app
      .firestore()
      .collection('users')
      .doc(uid)
      .get()
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
    const doc = await this.app
      .firestore()
      .collection('spotify')
      .doc(uid)
      .get()
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
  ): Promise<IMatchData | boolean> {
    const doc = await this.app
      .firestore()
      .collection('users')
      .doc(user)
      .collection('matches')
      .doc(id)
      .get()
    if (doc.exists) {
      const d = doc.data()
      return d ? d.matchId : false
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
}
export default new Firebase()
