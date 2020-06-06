
import firebase from 'firebase'
const config = require('../config')()
const fireConfig = config.fireConfig

// eslint-disable-next-line import/no-mutable-exports
let fireApp, adminApp

if (!fireApp && !firebase.apps.length) {
  fireApp = firebase.initializeApp(fireConfig)
  adminApp = firebase.initializeApp(fireConfig, 'fireAdmin')
} else {
  fireApp = firebase.app()
  adminApp = firebase.app('fireAdmin')
}

export { fireApp, adminApp }
// export default fireApp
