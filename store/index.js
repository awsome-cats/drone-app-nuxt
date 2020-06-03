/* eslint-disable no-console */
import fireApp from '@/plugins/firebase'
// import { auth } from '@/plugins/firebase'
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
        user.updateProfile({ displayName: payload.fullName })
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
      .then(() => {
        const userData = {
          email: payload.email,
          password: payload.password,
          fullName: payload.fullName,
          createdAt: new Date().toISOString()
        }
        fireApp.database().ref(`users/${newUser.uid}`).set(userData)
      })
      .then(() => {
        commit('setJobDone', true)
        commit('setBusy', false)
      })
      .catch((error) => {
        commit('setBusy', false)
        commit('setError', error)
      })
  }
}
export const getters = {
  user (state) {
    return state.user
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
