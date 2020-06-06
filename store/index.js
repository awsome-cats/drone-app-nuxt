/* eslint-disable no-console */
import { fireApp } from '@/plugins/firebase'

export const state = () => ({
  user: null,
  error: null,
  busy: false,
  jobDone: false

})

export const mutations = {
  setError (state, payload) {
    state.error = payload
  },
  clearError (state) {
    state.error = null
  },
  setBusy (state, payload) {
    state.busy = payload
  },
  setJobDone (state, payload) {
    state.jobDone = payload
  },
  setUser (state, payload) {
    state.user = payload
  }

}
// firebase version問題
// 4.12.0では返ってくる値がuserだが、最新ではわからない
// 調べておくように
// 現在2020年ではこの書き方はできない: updateProfile
export const actions = {
  signUpUser ({ commit }, payload) {
    commit('setBusy', true)
    commit('clearError')
    let newUser = null
    fireApp.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then((user) => {
        // console.log('result', user.uid)
        newUser = user
        return user.updateProfile({ displayName: payload.fullName })
          .then(() => {
            // store保管用のuserのdata
            const currentUser = {
              id: user.uid,
              email: payload.email,
              password: payload.password,
              role: 'consumer'
            }
            console.log('USER', user)
            commit('setUser', currentUser)
            console.log('currentUser', currentUser)
          })
      })
      .then(() => {
        // database保管用
        const userData = {
          email: payload.email,
          password: payload.password,
          fullName: payload.fullName,
          createdAt: new Date().toISOString()
        }
        // newUserにはuserが代入されている{ email, password, uid }
        return fireApp.database().ref(`users/${newUser.uid}`).set(userData)
      })
      .then(() => {
        fireApp.database().ref('groups').orderByChild('name').equalTo('Customer').once('value')
          .then((snapShot) => {
            const groupKey = Object.keys(snapShot.val())[0]
            const groupedUser = {}
            // newUser.uidと記述しているとこがわからない
            groupedUser[newUser.uid] = payload.fullName
            // groupedUserにはfullnameが入る
            return fireApp.database().ref(`userGroups/${groupKey}`).update(groupedUser)
          })
      })
      .then(() => {
        commit('setJobDone', true)
        commit('setBusy', false)
      })
      .catch((error) => {
        commit('setBusy', false)
        commit('setError', error)
      })
  },
  loginUser ({ commit }, payload) {
    commit('setBusy', true)
    commit('clearError')
    fireApp.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then((user) => {
        console.log(user)
        const authUser = {
          id: user.uid,
          email: user.email,
          name: user.displayName
        }
        console.log('authUser', authUser)
        return fireApp.database().ref('groups').orderByChild('name').equalTo('Administrator').once('value')
          .then((snapShot) => {
            console.log('snapShot', snapShot)
            const groupKey = Object.keys(snapShot.val())[0]
            console.log('groupKey', groupKey)
            return fireApp.database().ref(`userGroups/${groupKey}`).child(`${authUser.id}`).once('value')
              .then((ugroupSnap) => {
                if (ugroupSnap.exists()) {
                  authUser.role = 'admin'
                } else {
                  authUser.role = 'customer'
                }
                commit('setUser', authUser)
                commit('setBusy', false)
                commit('setJobDone', true)
              })
          })
      })
      .catch((error) => {
        commit('setBusy', false)
        commit('setError', error)
      })
  },
  logOut ({ commit }) {
    fireApp.auth().signOut()
    commit('setUser', null)
  },
  // default.vueで使用する
  setAuthStatus ({ commit }) {
    fireApp.auth().onAuthStateChanged((user) => {
      if (user) {
        const authUser = {
          id: user.id,
          email: user.email,
          name: user.displayName
        }
        fireApp.database().ref('groups').orderByChild('name').equalTo('Administrator').once('value')
          .then((snapShot) => {
            console.log('snapShot', snapShot)
            const groupKey = Object.keys(snapShot.val())[0]
            console.log('groupKey', groupKey)
            return fireApp.database().ref(`userGroups/${groupKey}`).child(`${authUser.id}`).once('value')
              .then((ugroupSnap) => {
                if (ugroupSnap.exists()) {
                  authUser.role = 'admin'
                } else {
                  authUser.role = 'customer'
                }
                commit('setUser', authUser)
                // commit('setBusy', false)
                // commit('setJobDone', true)
              })
          })
      }
    })
  },
  updateProfile ({ commit, getters }, payload) {
    // 1. Update user name with updateProfile
    // 2. Upadate user email with updateEmail
    // 3. Update the database
    // 4. Will divide the code into chunks

    commit('setBusy', true)
    commit('clearError')
    const userData = getters.user
    const user = fireApp.auth().currentUser
    const updateEmail = () => {
      return user.updateEmail(payload.email)
    }
    const updateDb = () => {
      const updateObj = {}
      if (userData.role === 'admin') {
        updateObj[`userGroups/-M8xd3z4xBcmzR9AzoVJ/${user.uid}`] = payload.fullName
      }
      updateObj[`userGroups/-M8xZCh83Z7tNxePIqlc/${user.uid}`] = payload.fullName
      updateObj[`users/${user.uid}/email`] = payload.email
      updateObj[`users/${user.uid}/fullName`] = payload.fullName
      return fireApp.database().ref().update(updateObj)
    }
    console.log('USER', user)
    user.updateProfile({ displayName: payload.fullName })
      .then(updateEmail)
      .then(updateDb)
      .then(() => {
        const userObj = {
          id: userData.id,
          email: payload.email,
          name: payload.fullName,
          role: userData.role
        }
        console.log('userObj', userObj)
        commit('setUser', userObj)
        commit('setBusy', false)
        commit('setJobDone', true)
      })
      .catch((error) => {
        commit('setBusy', false)
        commit('setError', error)
      })
    commit('setBusy', false)
    commit('setJobDone', true)
  }
}
export const getters = {
  user (state) {
    return state.user
  },
  // 永続化じゃないよ
  loginStatus (state) {
    return state.user !== null && state.user !== undefined
  },
  userRole (state) {
    const isLoggedIn = state.user !== null && state.user !== undefined
    return (isLoggedIn) ? state.user.role : 'customer'
  },
  error (state) {
    return state.error
  },
  busy (state) {
    return state.busy
  },
  jobDone (state) {
    return state.jobDone
  }
}
