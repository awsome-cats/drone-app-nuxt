<template>
  <div>
    <section class="section no-top-pad">
      <h5 class="title is-5">
        プロフィール
      </h5><hr>

      <div class="columns is-centered is-mobile">
        <div class="column is-half-desktop is-full-mobile is-full-tablet">
          <form @submit.prevent="updateProfile">
            <div class="field">
              <label class="label">お名前</label>
              <div class="control">
                <input
                  v-model="fullName"
                  v-validate="'required|min:4'"
                  class="input"
                  type="text"
                  name="fullName"
                  :class="{ 'is-danger': errors.has('fullName') }"
                >
                <p v-show="errors.has('fullName')" class="help is-danger">
                  {{ errors.first('fullName') }}
                </p>
              </div>
            </div>
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input
                  v-model="email"
                  v-validate="'required|email'"
                  class="input"
                  type="email"
                  name="email"
                  :class="{ 'is-danger': errors.has('email') }"
                >
                <p v-show="errors.has('email')" class="help is-danger">
                  {{ errors.first('email') }}
                </p>
              </div>
            </div>

            <error-bar :error="error" />

            <div class="field">
              <div class="control">
                <button type="submit" class="button is-primary" :class="{ 'is-loading': busy }" :disabled="busy">
                  更新
                </button>
              </div>
            </div>
          </form>
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
      email: '',
      fullName: ''
    }
  },
  // If data gone after page reload
  computed: {
    userData () {
      return this.$store.getters.user
    }
  },
  watch: {
    userData (value) {
      if (value) {
        this.email = value.email
        this.fullName = value.name
      }
    }
  },
  mounted () {
    this.$store.commit('clearError')
    const user = this.$store.getters.user
    if (user) {
      this.email = user.email
      this.fullName = user.name
    }
  },
  methods: {
    updateProfile () {
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            this.$store.dispatch('updateProfile', { fullName: this.fullName, email: this.email })
          }
        })
    },
    jobsDone () {
      this.$swal({
        title: 'Profile updated successfuly',
        icon: 'success'
      })
    }
  }
}
</script>
