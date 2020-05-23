/* eslint-disable @typescript-eslint/camelcase */
import { NowRequest, NowResponse } from '@now/node'
import firebase from './_firebase'

export default async (req: NowRequest, res: NowResponse) => {
  res.setHeader(
    'Access-Control-Allow-Origin',
    process.env.BASE_ORIGIN || 'http://localhost:3000'
  )
  // endpoint cache 59 seconds
  res.setHeader('Cache-Control', 'max-age=10, s-maxage=59')
  const data: undefined | GlobalTally = await firebase.admin
    .firestore()
    .collection('app')
    .doc('tally_live')
    .get()
    .then((d) => (d.exists ? (d.data() as GlobalTally) : undefined))
  if (data) {
    data.lastMatch.users = []
    return res.json({ success: true, data })
  }
  res.json({ success: false })
}
