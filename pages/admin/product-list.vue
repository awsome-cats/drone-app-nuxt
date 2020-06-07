<template>
  <div>
    <section class="section no-top-pad">
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <h5 class="title is-5">
              プロダクト
            </h5>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <nuxt-link class="button is-primary" to="/admin/product-edit">
              追加
            </nuxt-link>
          </div>
        </div>
      </nav>
      <hr>
      <table class="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>#</th>
            <th>画像</th>
            <th>プロダクト</th>
            <th>コード</th>
            <th>ブランド</th>
            <th class="has-text-centered">
              ストック
            </th>
            <th class="has-text-centered">
              ステータス
            </th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="product.key">
            <th>{{ ++index }}</th>
            <td><img :src="product.imageUrl" class="image is-48x48"></td>
            <td><a href="#" @click.prevent="editProduct(product)">{{ product.name }}</a></td>

            <td>{{ product.code }}</td>
            <td>
              {{ product.brand }}
            </td>
            <td class="has-text-centered">
              {{ product.stock }}
            </td>
            <td class="has-text-centered">
              {{ product.status == 1 ? 'Available': 'Not Available' }}
            </td>
            <td><a href="#" @click.prevent="removeProduct(product)"><span class="icon has-text-danger"><i class="fa fa-lg fa-times-circle" /></span></a></td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
export default {
  computed: {
    products () {
      return this.$store.getters['product/products']
    }
  },
  created () {
    const loadProducts = this.$store.getters['product/products']
    if (!loadProducts.length) {
      this.$store.dispatch('product/getProducts')
    }
    // single productをnullにする
    // productCategoriesをからの配列にする
    this.$store.commit('product/loadProduct', null)
    this.$store.commit('product/clearProductCategories')
  },
  methods: {
    editProduct (product) {
      // console.log('product', product)
      this.$store.commit('product/loadProduct', product)
      this.$router.push('product-edit')
    },
    removeProduct (product) {
      this.$swal({
        title: `${product.name}削除しますか?`,
        icon: true,
        button: true,
        dangerMode: true
      })
        .then((ok) => {
          this.$store.dispatch('product/removeProduct', product)
        })
    }
  }
}
</script>

<style scoped>

</style>
