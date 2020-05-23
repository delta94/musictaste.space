/* eslint-disable @typescript-eslint/camelcase */
import { NowRequest, NowResponse } from '@now/node'
import SimpleCrypto from 'simple-crypto-js'
import firebase from './_firebase'

const cryp = new SimpleCrypto('spotify-compatibility')

export default async (req: NowRequest, res: NowResponse) => {
  res.setHeader(
    'Access-Control-Allow-Origin',
    process.env.BASE_ORIGIN || 'http://localhost:3000'
  )
  // endpoint cache for 30 mins
  res.setHeader('Cache-Control', 'maxage=2, s-maxage=1800')
  if (req.query?.id) {
    const data: undefined | IUsersLookupData = await firebase.admin
      .firestore()
      .collection('users-lookup')
      .doc(req.query.id as string)
      .get()
      .then((d) => (d.exists ? (d.data() as IUsersLookupData) : undefined))
    if (data) {
      data.userId = cryp.encrypt(data.userId)
      return res.json({ success: true, user: data })
    }
  }
  res.json({ success: false })
}
