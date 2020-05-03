declare module 'react-spotify-api'
declare module 'react-rewards'

interface IImportStatus {
  exists: boolean
  lastImport?: Timestamp
  status?: {
    topTracks: boolean
    topArtists: boolean
    relatedArtists: boolean
    genres: boolean
    specialSauce: boolean
  }
  loading?: boolean
}

interface IArtist {
  id: string
  genres: string[]
}
interface ITrack {
  id: string
  artist: string
}

interface IGenreDict {
  [genre: string]: {
    count: number
    index: number
  }
}

interface IPreviewMatchData {
  anon: boolean
  bgCode: {
    id: string
    type: string
  }
  displayName: string
  matchDate: Timestamp
  matchId: string
  photoURL: string
  score: number
}

interface ISpotifyUserData {
  topRelatedArtists: IArtist[]
  topArtistsLongTerm: IArtist[]
  topGenres: IGenreDict
  topGenresRelated: IGenreDict
  topTracksLongTerm: ITrack[]
  topTracksMediumTerm: ITrack[]
  topTracksShortTerm: ITrack[]
}

interface IUsersLookupData {
  anon: boolean
  displayName: string
  imageURL: string
  userId: string
}

interface IMatchedSpotifyPoint {
  id: string
  indexA: number
  indexB: number
  rank: number
}
interface IMatchData {
  matchedTracksLongTerm: IMatchedSpotifyPoint[]
  matchedTracksMediumTerm: IMatchedSpotifyPoint[]
  matchedTracksShortTerm: IMatchedSpotifyPoint[]
  matchedArtists: IMatchedSpotifyPoint[]
  matchedGenres: {
    genre: string
    valuesA: {
      index: number
      count: number
    }
    valuesB: {
      index: number
      count: number
    }
    rank: number
  }[]
  scoreComponents: {
    artists: number
    tracksST: number
    tracksLT: number
    tracksMT: number
    genres: number
  }
  score: number
  users: string[]
  matchDate: Timestamp
}

interface IUserProfile {
  accessToken: string
  accessTokenRefresh: string
  matchCode: string
  anonMatchCode: string
  displayName: string
  refreshToken: string
  spotifyAuthCode: string
  spotifyID: string
  photoURL: string
  state: string
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

interface IDemoMatch {
  score: number
  topArtists: {
    name: string
    images: string[]
    external_urls: {
      spotify: string
    }
  }[]
  topTrack: {
    name: string
    images: string[]
    artist: string
    external_urls: {
      spotify: string
    }
  }
}

interface IDemoUser {
  name: string
  imageURL: string
}

interface IDemoData {
  matches: IDemoMatch[]
  users: IDemoUser[]
}
