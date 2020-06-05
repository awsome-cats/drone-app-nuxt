<template>
  <div>
    <section class="section no-top-pad">
      <h5 class="title is-5">
        ユーザー登録
      </h5><hr>

      <div class="columns is-centered is-mobile">
        <div class="column is-half-desktop is-full-mobile is-full-tablet">
          <form @submit.prevent="onSignUp">
            <div class="field">
              <label class="label">お名前</label>
              <div class="control">
                <input
                  v-model="fullName"
                  v-validate="'required|min:4'"
                  class="input"
                  type="text"
                  name="fullName"
                  :class="{'is-danger': errors.has('fullName')}"
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
                  :class="{'is-danger': errors.has('email')}"
                >
                <p v-show="errors.has('email')" class="help is-danger">
                  {{ errors.first('email') }}
                </p>
              </div>
            </div>
            <div class="field">
              <label class="label">パスワード</label>
              <div class="control">
                <input
                  v-model="password"
                  v-validate="'required|min:6'"
                  class="input"
                  type="password"
                  name="password"
                  :class="{'is-danger': errors.has('password')}"
                >
                <p v-show="errors.has('password')" class="help is-danger">
                  {{ errors.first('password') }}
                </p>
              </div>
            </div>
            <error-bar :error="error" />
            <div class="field">
              <div class="control">
                <button type="submit" class="button is-primary" :class="{'is-loading':busy}" :disabled="busy">
                  送信
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
  components: { ErrorBar },
  mixins: [apiJobMixin],
  data () {
    return {
      fullName: '',
      email: '',
      password: ''
    }
  },

  methods: {
    onSignUp () {
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            const signUpData = {
              fullName: this.fullName,
              email: this.email,
              password: this.password
            }
            this.$store.dispatch('signUpUser', signUpData)
          }
        })
    },
    jobsDone () {
      this.removeErrors()
      // 初でpush以外
      this.$router.replace('/')
    }

  }
}
</script>
