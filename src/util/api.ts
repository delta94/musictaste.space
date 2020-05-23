/**
 * Cached resources using Vercel Cloud Function CDN
 */

import SimpleCrypto from 'simple-crypto-js'

const ENDPOINT_MATCH_USER = 'match-user'
const ENDPOINT_TALLY = 'tally'

const cryp = new SimpleCrypto('spotify-compatibility')

export const getUserFromId = async (
  id: string
): Promise<null | IUsersLookupData> => {
  if (id) {
    return await fetch(
      `${process.env.REACT_APP_API_BASE}/${ENDPOINT_MATCH_USER}?id=${id}`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          const data = res.user as IUsersLookupData
          data.userId = cryp.decrypt(data.userId) as string
          return data
        }
        return null
      })
  }
  return null
}

export const getTally = async (): Promise<null | GlobalTally> => {
  return await fetch(`${process.env.REACT_APP_API_BASE}/${ENDPOINT_TALLY}?id=1`)
    .then((res) => res.json())
    .then((res) => (res.success ? res.data : null))
}
