<template>
  <div>
    <section class="section no-top-pad">
      <h5 class="title is-5">
        パスワードの変更
      </h5><hr>

      <div class="columns is-centered is-mobile">
        <div class="column is-half-desktop is-full-mobile is-full-tablet">
          <form @submit.prevent="changePwd">
            <div class="field">
              <label class="label">New password</label>
              <div class="control">
                <input
                  v-model="password"
                  v-validate="'required|min:6'"
                  class="input"
                  :class="{'is-danger': errors.has('password')}"
                  type="password"
                  name="password"
                >
                <p
                  v-show="errors.has('password')"
                  class="help is-danger"
                >
                  {{ errors.first('password') }}
                </p>
              </div>
            </div>
            <div class="field">
              <label class="label">パスワード</label>
              <div class="control">
                <input
                  v-model="password_confirm"
                  v-validate="'required|min:6|confirmed:password'"
                  class="input"
                  :class="{'is-danger': errors.has('password_confirm')}"
                  type="password"
                  name="password_confirmation"
                >
                <p
                  v-show="errors.has('password_confirm')"
                  class="help is-danger"
                >
                  {{ errors.first('password_confirm') }}
                </p>
              </div>
            </div>
            <error-bar :error="error" />
            <div class="field">
              <div class="control">
                <button type="submit" :class="{ 'is-loading': busy }" :disabled="busy" class="button is-primary">
                  パスワードを変更
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
      password: '',
      password_confirm: ''
    }
  },
  methods: {
    changePwd () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$swal({
            title: 'パスワードを変更しますか?',
            icon: 'warning'
          })
            .then((ok) => {
              if (ok) {
                this.$store.dispatch('changePwd', { password: this.password })
              }
            })
        }
      })
    },
    jobsDone () {
      this.password = ''
      this.password_confirm = ''
      this.removeErrors()
      this.$swal({
        title: 'パスワードが変更されました',
        icon: 'success'
      })
    }
  }

}
</script>
