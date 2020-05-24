/* eslint-disable @typescript-eslint/camelcase */
import { NowRequest, NowResponse } from '@now/node'
import firebase from './_firebase'

export default async (req: NowRequest, res: NowResponse) => {
  res.setHeader(
    'Access-Control-Allow-Origin',
    process.env.BASE_ORIGIN || 'http://localhost:3000'
  )
  // endpoint cache 5 mins
  res.setHeader('Cache-Control', 'max-age=120, s-maxage=300')
  if (req.query?.region) {
    const region = (req.query.region as string).toUpperCase()
    try {
      const globalData = await firebase.admin
        .firestore()
        .collection('app')
        .doc('averages')
        .get()
        .then((d) => d.data())
      const regionalData = (await firebase.admin
        .firestore()
        .collection('app')
        .doc('averages')
        .collection('countries')
        .doc(region)
        .get()
        .then((d) => (d.exists ? d.data() : undefined))) as INationalAverage
      if (regionalData && regionalData.total > 100) {
        return res.json({
          success: true,
          data: {
            hasRegion: true,
            region,
            data: regionalData as INationalAverage,
            stdDev: (globalData as INationalAverage).stdDev || 20,
          },
        })
      } else {
        return res.json({
          success: true,
          data: {
            hasRegion: false,
            data: globalData as INationalAverage,
            stdDev: (globalData as INationalAverage).stdDev || 20,
          },
        })
      }
    } catch (_) {
      return res.json({ success: false, error: 'Internal database error' })
    }
  }
  return res.json({ success: false })
}
