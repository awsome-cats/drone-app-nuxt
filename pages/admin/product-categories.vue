<template>
  <div>
    <section class="section no-top-pad">
      <h5 class="title is-5">
        製品カテゴリー
      </h5><hr>

      <div class="columns">
        <div class="column is-one-third">
          <form @submit.prevent="onSubmit">
            <div class="field">
              <label class="label">New カテゴリー</label>
              <div class="control">
                <input
                  v-model="name"
                  v-validate="'required'"
                  :class="{'is-danger': errors.has('name')}"
                  class="input"
                  type="text"
                  name="category"
                >
                <p v-show="errors.has('name')" class="help is-danger">
                  {{ errors.first('name') }}
                </p>
              </div>
            </div>

            <error-bar :error="error" />

            <div class="field">
              <div class="control">
                <button class="button is-primary" :class="{'is-loading': busy}" :disabled="busy">
                  {{ !category ? '新規作成': '更新' }}
                </button>
                <button v-if="category" class="button" style="margin-left:10px;" type="button" @click.prevent="cancelUpdate()">
                  cancel
                </button>
              </div>
            </div>
          </form>
        </div>
        <!-- 表示 -->

        <div class="column">
          <table class="table is-striped is-fullwidth">
            <thead>
              <tr>
                <th>#</th>
                <th>カテゴリー</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(category, index) in categories" :key="category.key">
                <th>{{ ++index }}</th>
                <td><a href="#" @click.prevent="selectCategory(category)">{{ category.name }}</a></td>
                <td><a href="#" @click.prevent="removeCategory(category)"><span class="icon has-text-danger"><i class="fa fa-lg fa-times-circle" /></span></a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ErrorBar from '@/components/ErrorBar'
import apiJobMixin from '@/mixins/apiJobMixin'
export default {
  components: {
    ErrorBar
  },
  mixins: [apiJobMixin],
  data () {
    return {
      name: '',
      category: null
    }
  },
  computed: {
    categories () {
      return this.$store.getters['product/categories']
    }
  },
  mounted () {
    const loadedCats = this.$store.getters['product/categories']
    if (loadedCats.length === 0) {
      this.$store.dispatch('product/getCategories')
    }
  },
  methods: {
    onSubmit () {
      this.$validator.validateAll()
        .then((result) => {
          if (!this.category) {
            this.$store.dispatch('product/createCategory', {
              name: this.name
            })
          } else {
            this.$swal({
              title: `${this.category.name}を更新しますか?`,
              icon: 'warning',
              buttons: true,
              dangerMode: true
            })
              .then((ok) => {
                this.$store.dispatch('product/updateCategory', { name: this.name, category: this.category })
              })
          }
        })
    },
    selectCategory (category) {
      this.category = category
      this.name = category.name
    },
    removeCategory (category) {
      this.$swal({
        title: `${category.name}を削除しますか?`,
        icon: 'warning',
        buttons: true,
        dangerMode: true
      })
        .then((ok) => {
          if (ok) {
            this.$store.dispatch('product/removeCategory', { category })
          }
        })
    },
    jobsDone () {
      this.category = null
      this.name = ''
      this.$nextTick(() => {
        this.removeErrors()
      })
    },
    cancelUpdate () {
      this.category = null
      this.jobsDone()
    },
    confirm () {
      this.$swal({
        title: `${this.category.name}を作成しますか?`,
        icon: 'warning',
        buttons: true,
        dangerMode: true
      })
    }
  }
}
</script>
