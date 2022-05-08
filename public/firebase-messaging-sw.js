// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js")
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
)

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyCdE8qgT_13VVMRJr5tWtD19PKwGQv6x5U",
  authDomain: "ariesv1.firebaseapp.com",
  projectId: "ariesv1",
  storageBucket: "ariesv1.appspot.com",
  messagingSenderId: "484913933460",
  appId: "1:484913933460:web:51134c4537f1aa7af85881",
  measurementId: "G-CY7WJVMND5",
}

firebase.initializeApp(firebaseConfig)

// Retrieve firebase messaging
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload)

  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
