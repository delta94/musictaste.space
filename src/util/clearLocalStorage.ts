export const clearStorage = () => {
  localStorage.removeItem('profileLoaded')
  localStorage.removeItem('userProfile')
  localStorage.removeItem('spotifyData')
}
