import admin from 'firebase-admin'

class Firebase {
  public admin: admin.app.App
  constructor() {
    this.admin = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: 'spotify-compatibility',
        privateKey: Buffer.from(
          process.env.FIREBASE_PRIVATE_KEY as string,
          'base64'
        ).toString('binary'),
        clientEmail: process.env.FIREBASE_SERVICE_EMAIL,
      }),
      databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    })
  }
}

export default new Firebase()
