<template>
  <div>
    <section class="section no-top-pad">
      <h5 class="title is-5">
        ユーザー作成フォーム
      </h5><hr>

      <div class="columns">
        <div class="column is-one-third">
          <form @submit.prevent="onSubmit">
            <div class="field">
              <label v-if="!group" class="label">新規ユーザーグループ</label>
              <label v-else class="label">ユーザーグループの編集</label>
              <div class="control">
                <input
                  v-model="name"
                  v-validate="'required|min:4'"
                  class="input"
                  type="text"
                  name="name"
                  :class="{'is-danger': errors.has('name')}"
                >
                <p v-show="errors.has('name')" class="help is-danger">
                  {{ errors.first('name') }}
                </p>
              </div>
            </div>
            <!-- エラー -->
            <!-- <transition name="slide" type="animation">
              <div v-if="error" class="notification is-danger">
                {{ error.message }}
              </div>
            </transition> -->
            <error-bar :error="error" />

            <div class="field">
              <div class="control">
                <button type="submit" class="button is-primary" :class="{'is-loading':busy}" :disabled="busy">
                  {{ !group ? '新規グループ作成': '編集' }}
                </button>
                <button v-if="group" type="button" style="margin-left: 10px;" class="button" @click="cancelUpdate()">
                  キャンセル
                </button>
              </div>
            </div>
          </form>
        </div>
        <div class="column">
          <table class="table is-striped is-fullwidth">
            <thead>
              <tr>
                <th>#</th>
                <th>ユーザーグループ</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(group, index) in groups" :key="group.key">
                <th>{{ ++index }}</th>
                <td><a href="#" @click.prevent="selectGroup(group)">{{ group.name }}</a></td>
                <td><a href="#" @click.prevent="removeGroup(group)"><span class="icon has-text-danger"><i class="fa fa-lg fa-times-circle" /></span></a></td>
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
export default {
  middleware: 'verify-admin',
  components: { ErrorBar },
  data () {
    return {
      name: '',
      group: null
    }
  },
  computed: {
    groups () {
      return this.$store.getters['admin/groups']
    },
    error () {
      return this.$store.getters.error
    },
    busy () {
      return this.$store.getters.busy
    },
    jobDone () {
      return this.$store.getters.jobDone
    }
  },
  watch: {
    jobDone (value) {
      if (value) {
        this.$store.commit('setJobDone')
        this.jobsDone()
      }
    }
  },
  created () {
    const loadedGroups = this.$store.getters['admin/groups']
    if (loadedGroups.length === 0) {
      this.$store.dispatch('admin/getGroups')
    }
  },
  methods: {
    onSubmit () {
      // vee-validate
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            if (!this.group) {
              this.$swal({
                title: 'グループを作成しますか?',
                icon: 'warning',
                buttons: true,
                dangerMode: true
              })
                .then((ok) => {
                  this.$store.dispatch('admin/createGroup', {
                    name: this.name
                  })
                })
            } else {
              this.$swal({
                title: 'グループを編集しますか?',
                icon: 'warning',
                buttons: true,
                dangerMode: true
              })
                .then((ok) => {
                  this.$store.dispatch('admin/updateGroup', {
                    name: this.name,
                    group: this.group
                  })
                })
            }
          }
        })
    },
    // v-modelのnameがgroupとして取得され、nameはgroupのnameにもなる
    // だからgetしたgroupをclickするとinputに表示される
    selectGroup (group) {
      this.group = group
      this.name = group.name
    },
    cancelUpdate () {
      this.group = null
      this.jobsDone()
    },
    removeGroup (group) {
      this.$swal({
        title: 'グループを削除しますか?',
        icon: 'warning',
        buttons: true,
        dangerMode: true
      })
        .then((ok) => {
          if (ok) {
            this.$store.dispatch('admin/removeGroup', { group })
          }
        })
    },
    jobsDone () {
      this.group = null
      this.name = ''
      // vee-validateが正しく動くようにするため
      this.$nextTick(() => {
        this.removeErrors()
      })
    },
    removeErrors () {
      // vee-validateが正しく動くようにするため
      this.$validator.reset()
      this.$store.commit('clearError')
    }
  }
}
</script>
