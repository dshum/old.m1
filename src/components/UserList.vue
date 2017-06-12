<template>
  <div>
    <div class="path">
      Пользователи
    </div>
    <transition name="show">
      <div class="leaf" v-if="show">
        <div v-if="users.length">
          <table class="users elements">
          <thead>
          <tr>
            <th>Логин</th>
            <th>Имя</th>
            <th>Группы</th>
            <th>Дата</th>
            <th class="remove"><i class="fa fa-times-circle"></i></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="user of users">
            <td><router-link :to="{name: 'user', params: {id: user.id}}">{{ user.login }}</router-link></td>
            <td>{{ user.first_name }} {{ user.last_name }}<br><small>{{ user.email }}</small></td>
            <td>
              <div v-for="group of user.groups"><router-link :to="{name: 'group', params: {id: group.id}}">{{ group.name }}</router-link></div>
              <div v-if="user.super">Суперпользователь</div>
            </td>
            <td>{{ user.created_at | date('DD.MM.YYYY') }}<br><small>{{ user.created_at | date('HH:mm:ss') }}</small></td>
            <td class="remove" @click="confirmDeleteUser(user)"><i class="fa fa-times-circle"></i></td>
          </tr>
          </tbody>
          </table>
        </div>
        <div>
          <router-link to="/users/add" class="addnew">Добавить пользователя<i class="fa fa-angle-right"></i></router-link>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <spinner v-show="loading" message="Минутку..."></spinner>
    </transition>
    <transition name="fade">  
      <confirm v-show="confirm" confirmButton="Удалить" confirm-button-class="remove" v-on:confirm="deleteUser(removingUser)" v-on:cancel="confirm = false">
        Удалить пользователя &laquo;{{ removingUser.first_name }} {{ removingUser.last_name }}&raquo;?
      </confirm>
    </transition>
    <transition name="fade">
      <alert v-show="alert" v-on:cancel="alert = false">
        {{ errorMessage }}
      </alert>
    </transition>
  </div>
</template>

<script>
import Spinner from '@/components/common/Spinner'
import Confirm from '@/components/common/Confirm'
import Alert from '@/components/common/Alert'

export default {
  name: 'users',
  components: { Spinner, Confirm, Alert },
  data () {
    return {
      show: false,
      loading: false,
      confirm: false,
      alert: false,
      users: [],
      removingUser: {},
      errorMessage: null
    }
  },
  created () {
    $(document).attr('title', 'Пользователи')

    this.$http.get('/users').then((response) => {
      let data = response.body

      if (data.state && data.state === 'error_admin_access_denied') {
        this.$router.push('/')
      } else if (data.users) {
        this.users = data.users
      }

      this.show = true
    })
  },
  methods: {
    confirmDeleteUser (user) {
      this.removingUser = user

      this.confirm = true
    },
    deleteUser (user) {
      this.confirm = false
      this.loading = true

      this.$http.delete('/users/' + user.id).then((response) => {
        let data = response.body

        if (data.error) {
          this.errorMessage = data.error

          this.alert = true
        } else if (data.deleted) {
          let index = this.users.indexOf(user)

          this.users.splice(index, 1)
        }

        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
th.remove,
td.remove {
  text-align: center;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  cursor: pointer;
}

td.remove .fa {
  color: crimson;
}
</style>
