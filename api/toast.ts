/* eslint-disable @typescript-eslint/camelcase */
import { NowRequest, NowResponse } from '@now/node'
import firebase from './_firebase'

export default async (req: NowRequest, res: NowResponse) => {
  res.setHeader(
    'Access-Control-Allow-Origin',
    process.env.BASE_ORIGIN || 'http://localhost:3000'
  )
  // endpoint cache 60 seconds
  res.setHeader('Cache-Control', 'max-age=30, s-maxage=60')
  const data: undefined | {} = await firebase.admin
    .firestore()
    .collection('app')
    .doc('alert')
    .get()
    .then((d) => (d.exists ? (d.data() as ToastNotification) : undefined))
  if (data) {
    return res.json({ success: true, data })
  }
  res.json({ success: false })
}
