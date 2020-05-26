export const clearStorage = () => {
  localStorage.removeItem('profileLoaded')
  localStorage.removeItem('userProfile')
  localStorage.removeItem('spotifyData')
  localStorage.removeItem('matches')
  localStorage.removeItem('matchPreviews')
}

export const clearMatchStorage = () => {
  localStorage.removeItem('matches')
}
