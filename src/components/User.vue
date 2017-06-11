<template>
  <div>
    <div class="path">
      <router-link to="/users">Пользователи</router-link><span class="divider">/</span><span>{{user.login}}</span>
    </div>
    <transition name="show">
      <div class="leaf" v-if="show">
        <div class="form">
          <form @submit.prevent="submit()">
            <div class="row">
              <label>Логин:</label><span name="login" label="Логин" class="error"></span><br>
              <input type="text" name="login" v-model="user.login" placeholder="Логин">
            </div>
            <div class="row">
              <label>Имя:</label><span name="first_name" label="Имя" class="error"></span><br>
              <input type="text" name="first_name" v-model="user.first_name" placeholder="Имя">
            </div>
            <div class="row">
              <label>Фамилия:</label><span name="last_name" label="Фамилия" class="error"></span><br>
              <input type="text" name="last_name" v-model="user.last_name" placeholder="Фамилия">
            </div>
            <div class="row">
              <label>E-mail:</label><span name="email" label="E-mail" class="error"></span><br>
              <input type="text" name="email" v-model="user.email" placeholder="E-mail">
            </div>
            <div class="row">
              <label>Группы:</label><span name="groups" label="Группы" class="error"></span>
              <p v-for="group in groups"><input type="checkbox" v-bind:id="group.id" v-bind:value="group.id" v-model="user.groups"><label v-bind:for="group.id">{{ group.name }}</label></p>
            </div>
            <div class="row" v-if="user.created_at">
              <div v-if="user.created_at">Дата создания: {{ user.created_at | date('DD.MM.YYYY') }} <small>{{user.created_at | date('HH:mm:ss') }}</small></div>
              <div v-if="user.updated_at">Последнее изменение: {{ user.updated_at | date('DD.MM.YYYY') }} <small>{{user.updated_at | date('HH:mm:ss') }}</small></div>
              <div v-if="user.last_login">Последний вход: {{ user.last_login | date('DD.MM.YYYY') }} <small>{{user.last_login | date('HH:mm:ss') }}</small></div>
            </div>
            <div class="row submit">
              <input type="submit" value="Сохранить" class="btn">
            </div>
          </form>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <spinner v-show="loading" message="Минутку..."></spinner>
    </transition>
  </div>
</template>

<script>
import Spinner from '@/components/common/Spinner'

export default {
  name: 'user',
  components: { Spinner },
  data () {
    return {
      show: false,
      loading: false,
      id: null,
      groups: [],
      user: {}
    }
  },
  created () {
    var self = this

    $(document).attr('title', 'Пользователь')

    $(document)
      .on('keypress', function (event) {
        return self.$hotkeys.onCtrlS(event, function () {
          self.submit()
        })
      })
      .on('keydown', function (event) {
        return self.$hotkeys.onCtrlS(event, function () {
          self.submit()
        })
      })

    this.id = this.$route.params.id

    this.$http.get('/users/' + this.id).then((response) => {
      if (response.body.state === 'error_admin_access_denied') {
        this.$router.push('/')
      } else if (response.body.state === 'error_user_not_found') {
        this.$router.push('/users')
      } else if (response.body.state === 'error_user_access_denied') {
        this.$router.push('/users')
      }

      if (response.body.groups) {
        this.groups = response.body.groups
      }

      if (response.body.user) {
        this.user = response.body.user
      }

      this.show = true
    }).catch(() => {
      this.$router.push('/users')
    })
  },
  methods: {
    submit () {
      $('.error').hide()

      this.loading = true

      this.$http.post('/users/' + this.id, this.user).then((response) => {
        let data = response.body

        if (data.errors) {
          data.errors.forEach(error => {
            $('.error[name="' + error.name + '"]').html(error.message).fadeIn(200)
          })
        } else if (data.added) {
          this.$router.push('/users')
        }

        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
