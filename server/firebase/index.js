const firebase = require('firebase')
const { config } = require('./firebaseConfig')

const firebaseApp = firebase.initializeApp(config)

const auth = firebaseApp.auth()
const db = firebaseApp.firestore()
const firestore = firebase.firestore
db.settings({timestampsInSnapshots: true})

module.exports = { firebaseApp, auth, db, firestore }
