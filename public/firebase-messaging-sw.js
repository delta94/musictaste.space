importScripts('https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js')

const firebaseConfig = {
  apiKey: 'AIzaSyCE0od0vpI4dvMqBVvndiD9SMZYBSoQLpg',
  authDomain: 'spotify-compatibility.firebaseapp.com',
  databaseURL: 'https://spotify-compatibility.firebaseio.com',
  projectId: 'spotify-compatibility',
  storageBucket: 'spotify-compatibility.appspot.com',
  messagingSenderId: '612285673498',
  appId: '1:612285673498:web:ab7f38fad14ff8ff80a1a3',
  measurementId: 'G-B9E98KPQFG',
}

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(function (payload) {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    JSON.stringify(payload)
  )
  const notificationTitle = payload.data.title
  const notificationOptions = {
    actions: [{ action: 'view', title: 'View' }],
    body: payload.data.body,
    icon: payload.data.icon,
    requireInteraction: true,
    data: { type: payload.data.type, payload: payload.data.payload },
  }

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  )
})

self.addEventListener('notificationclick', function (event) {
  console.log('EVENT', event.notification.data)
  const data = event.notification.data
  const notification = event.notification

  if (data.type === 'NEW_MATCH') {
    notification.close()
    clients.openWindow(`/match/${data.payload}`)
  }
})
