import { fireApp } from '@/plugins/firebase'

export const state = () => ({
  categories: []
})

export const mutations = {
  loadCategories (state, payload) {
    state.categories.push(payload)
  },
  updateCategory (state, payload) {
    const i = state.categories.indexOf(payload.category)
    state.categories[i].name = payload.name
  },
  removeCategory (state, payload) {
    const i = state.categories.indexOf(payload.category)
    state.categories.splice(i, 1)
  }
}

export const actions = {
  createCategory ({ commit }, payload) {
    commit('setBusy', true, { root: true })
    commit('clearError', null, { root: true })
    fireApp.database().ref('categories').push(payload)
      .then(() => {
        commit('setBusy', false, { root: true })
        commit('setJobDone', true, { root: true })
      })
      .catch((error) => {
        commit('setBusy', false, { root: true })
        commit('setError', error, { root: true })
      })
  },
  getCategories ({ commit }) {
    fireApp.database().ref('categories').on('child_added',
      (snapShot) => {
        const item = snapShot.val()
        item.key = snapShot.key
        commit('loadCategories', item)
      })
  },
  updateCategory ({ commit }, payload) {
    commit('setBusy', true, { root: true })
    commit('clearError', null, { root: true })
    fireApp.database().ref(`categories/${payload.category.key}`)
      .update({ name: payload.name })
      .then(() => {
        commit('setBusy', false, { root: true })
        commit('setJobDone', true, { root: true })
        const categoryData = {
          name: payload.name,
          category: payload.category
        }
        commit('updateCategory', categoryData)
      })
      .catch((error) => {
        commit('setBusy', false, { root: true })
        commit('setError', error, { root: true })
      })
  },
  removeCategory ({ commit }, payload) {
    fireApp.database().ref(`categories/${payload.category.key}`)
      .remove()
      .then(() => {
        commit('removeCategory', payload)
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

export const getters = {
  categories (state) {
    return state.categories
  }
}
