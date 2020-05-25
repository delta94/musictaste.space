export const clearStorage = () => {
  localStorage.removeItem('profileLoaded')
  localStorage.removeItem('userProfile')
  localStorage.removeItem('spotifyData')
  localStorage.removeItem('matches')
}

export const clearMatchStorage = () => {
  localStorage.removeItem('matches')
}
