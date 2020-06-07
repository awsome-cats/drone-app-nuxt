import { fireApp } from '@/plugins/firebase'

export const state = () => ({
  categories: [],
  products: [],
  product: null,
  productCategories: []
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
  },
  loadProducts (state, payload) {
    state.products = payload
  },
  loadProduct (state, payload) {
    state.product = payload
  },
  removeProduct (state, payload) {
    const i = state.products.indexOf(payload)
    state.products.splice(i, 1)
  },
  loadProductCategories (state, payload) {
    state.productCategories.push(payload)
  },
  clearProductCategories (state) {
    state.productCategories = []
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
  },
  addProduct ({ dispatch, commit }, payload) {
    const productData = payload
    const categories = payload.belongs

    const image = payload.image
    let imageUrl = ''
    let productKey = ''

    delete productData.belongs
    delete productData.image

    commit('setBusy', true, { root: true })
    commit('clearError', null, { root: true })

    fireApp.database().ref('products').push(productData)

      .then((result) => {
        productKey = result.key
        return fireApp.storage().ref(`products/${image.name}`).put(image)
      })
      .then((fileData) => {
        imageUrl = fileData.metadata.downloadURLs[0]
        return fireApp.database().ref('products').child(productKey).update({ imageUrl })
      })
      .then(() => {
        const productSnippet = {
          name: productData.name,
          price: productData.price,
          status: productData.status,
          imageUrl
        }
        // ここからが味噌
        // ここはよくわからないのでdocumentを読んで
        const catUpdates = {}
        categories.forEach((catKey) => {
          catUpdates[`productCategories/${catKey}/${productKey}`] = productSnippet
        })
        return fireApp.database().ref().update(catUpdates)
      })
      .then(() => {
        dispatch('getProducts')
        commit('setBusy', false, { root: true })
        commit('setJobDone', true, { root: true })
      })
      .catch((error) => {
        commit('setBusy', false, { root: true })
        commit('setError', error, { root: true })
      })
  },
  getProducts ({ commit }, payload) {
    fireApp.database().ref('products').on('value', (snapShot) => {
      // console.log(snapShot)
      const products = []
      let item
      snapShot.forEach((child) => {
        item = child.val()
        item.key = child.key
        products.push(item)
      })
      // reverse()逆の表示
      commit('loadProducts', products.reverse())
    })
  },
  removeProduct ({ commit }, payload) {
    const imageUrl = payload.imageUrl
    // console.log(imageUrl)
    const refUrl = imageUrl.split('?')[0]
    const httpsRef = fireApp.storage().refFromURL(refUrl)
    httpsRef.delete()
      .then(() => {
        return fireApp.database().ref(`products/${payload.key}`).remove()
          .then(() => {
            return fireApp.database().ref('categories').once('value')
              .then((snapShot) => {
                const catKey = Object.keys(snapShot.val())
                const updates = {}
                catKey.forEach((key) => {
                  updates[`productCategories/${key}/${payload.key}`] = null
                })
                return fireApp.database().ref().update(updates)
              })
          })
      })
      .then(() => {
        commit('removeProduct', payload)
      })

      .catch((error) => {
        console.log(error)
      })
  },
  updateProduct ({ dispatch, commit }, payload) {
    // console.log('payload', payload)
    // console.log('TEST', payload)
    const productData = payload
    const categories = productData.belongs
    const image = payload.image
    const productKey = payload.key
    let oldImageUrl = null
    // eslint-disable-next-line prefer-const
    let oldCatsRemoval = {}
    delete productData.belongs
    delete productData.image

    commit('setBusy', true, { root: true })
    commit('clearError', null, { root: true })
    fireApp.database().ref(`products/${productKey}`).update(productData)
      .then(() => {
        if (image) { // もしnew imageが提供されていたらimageをアップする
          return fireApp.storage().ref(`products/${image.name}`).put(image)
        } else {
          return false
        }
      })
      .then((fileData) => { // 新しいimageのurlにproductsのデータを更新する
        if (fileData) {
          oldImageUrl = productData.oldImageUrl
          productData.imageUrl = fileData.metadata.downloadURLs[0]
          return fireApp.database().ref('products').child(productKey).update({ imageUrl: productData.imageUrl })
        }
      })
      .then(() => { // 古いimageが残っており、新しいimageを挿入する場合、古いimageを削除する
        if (oldImageUrl) {
          const refUrl = oldImageUrl.split('?')[0]
          const httpsRef = fireApp.storage().refFromURL(refUrl)
          return httpsRef.delete()
        }
      })
      .then(() => { // 添付のproductCategoriesコレクションの削除の準備
        return fireApp.database().ref('productCategories').on('child_added', (snapShot) => {
          oldCatsRemoval[`productCategories/${snapShot.key}/${productKey}`] = null
        })
      })
      .then(() => { // productCategoriesのデータ削除
        return fireApp.database().ref().update(oldCatsRemoval)
      })
      .then(() => { // productCategoriesに挿入するnew data
        const productSnippet = {
          name: productData.name,
          imageUrl: productData.imageUrl,
          price: productData.price,
          status: productData.status
        }
        // eslint-disable-next-line prefer-const
        let catUpdates = {}
        categories.forEach((catKey) => {
          catUpdates[`productCategories/${catKey}/${productKey}`] = productSnippet
        })
        return fireApp.database().ref().update(catUpdates)
      })
      .then(() => {
        dispatch('getProducts')
        commit('setBusy', false, { root: true })
        commit('setJobDone', true, { root: true })
      })
      .catch((error) => {
        commit('setBusy', false, { root: true })
        commit('setError', error, { root: true })
      })
  },
  productCategories ({ commit }, payload) {
    commit('clearProductCategories')
    fireApp.database().ref('productCategories').on('child_added',
      (snapShot) => {
        const item = snapShot.val()
        item.key = snapShot.key
        if (item[payload] !== undefined) {
          commit('loadProductCategories', item.key)
        }
      })
  }
}

export const getters = {
  categories (state) {
    return state.categories
  },
  products (state) {
    return state.products
  },
  product (state) {
    return state.product
  },
  productCategories (state) {
    return state.productCategories
  }
}
