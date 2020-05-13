import Spotify from 'spotify-web-api-js'

const createPlaylist = async (
  accessToken: string,
  spotifyID: string,
  options: {
    name: string
    description?: string
    tracks: string[]
    image?: string
  }
) => {
  const s = new Spotify()
  s.setAccessToken(accessToken)
  const d = (await s
    .createPlaylist(spotifyID, {
      name: options.name,
      description: options.description ? options.description : '',
    })
    .then((res) => res)
    .catch((err) => {
      console.error(err)
      return false
    })) as SpotifyApi.CreatePlaylistResponse
  if (!d) {
    return {
      success: false,
      message:
        'There was an error making the playlist. You might need to log in again to grant more permissions.',
    }
  }
  if (options.image) {
    await s.uploadCustomPlaylistCoverImage(d.id, options.image)
  }
  return s
    .addTracksToPlaylist(d.id, options.tracks.filter(Boolean).slice(0, 50))
    .then(() => ({ success: true, uri: d.uri }))
    .catch((err) => ({
      success: false,
      err,
      message: 'There was an error creating the playlist.',
    }))
}

export default createPlaylist
