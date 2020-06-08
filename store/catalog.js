import { fireApp } from '@/plugins/firebase'

export const state = () => ({
  products: [],
  categories: []
})

export const mutations = {
  loadProducts (state, payload) {
    state.products = payload
  },
  loadCategories (state, payload) {
    state.categories = payload
    // console.log('payload', payload)
  }
}
export const actions = {
  getProducts ({ commit }) {
    fireApp.database().ref('products').limitToLast(50).once('value')
      .then((snapShot) => {
        const products = []
        let item = {}
        snapShot.forEach((child) => {
          item = child.val()
          item.key = child.key
          products.push(item)
        })
        // reverse(): 降順
        commit('loadProducts', products.reverse())
      })
      .catch((error) => {
        console.log(error)
      })
  },
  getCategories ({ commit }) {
    fireApp.database().ref('categories').once('value')
      .then((snapShot) => {
        const categories = []
        let item = {}
        snapShot.forEach((child) => {
          item = child.val()
          item.key = child.key
          categories.push(item)
        })
        // reverse(): 降順
        commit('loadCategories', categories)
      })
      .catch((error) => {
        console.log(error)
      })
  },
  productSearch ({ commit }, payload) {
    let ref = 'products'
    if (payload.category) {
      ref = `productCategories/${payload.category}`
    }

    fireApp.database().ref(`${ref}`).orderByChild('name').limitToLast(50).startAt(payload.keyword).endAt(payload.keyword + '\uF8FF').once('value')
      .then((snapShot) => {
        let products = []
        let item = {}
        snapShot.forEach((child) => {
          item = child.val()
          item.key = child.key
          products.push(item)
        })

        if (payload.sort) {
          if (payload.sort === 'low') {
            products.sort(function (a, b) {
              return a.price - b.price
            })
          } else {
            products.sort(function (a, b) {
              return b.price - a.price
            })
          }
        } else {
          products = products.reverse()
        }

        commit('loadProducts', products)
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
export const getters = {
  products (state) {
    return state.products
  },
  categories (state) {
    return state.categories
  }
}
