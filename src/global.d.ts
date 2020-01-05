declare module 'react-spotify-api'

interface IImportStatus {
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

interface ISpotifyUserData {
  topRelatedArtists: IArtist[]
  topArtistsLongTerm: IArtist[]
  topGenres: IGenreDict
  topGenresRelated: IGenreDict
  topTracksLongTerm: ITrack[]
  topTracksMediumTerm: ITrack[]
  topTracksShortTerm: ITrack[]
}
