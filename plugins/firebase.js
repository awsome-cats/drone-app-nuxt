import firebase from 'firebase'
import 'firebase/database'
// import 'firebase/firestore'

const config = require('../config')()

if (!firebase.apps.length) {
  const fireConfig = config.fireConfig
  firebase.initializeApp(fireConfig)
}
const fireApp = firebase.app()
// export const auth = firebase.app()
// export {adminApp}
export default fireApp
