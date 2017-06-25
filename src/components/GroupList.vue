<template>
  <div>
    <div class="path">
      Группы
    </div>
    <transition name="show">
      <div class="leaf" v-if="show">
        <div v-if="groups.length">
          <table class="groups elements">
          <thead>
          <tr>
            <th>Название</th>
            <th>Права доступа</th>
            <th>Дата</th>
            <th class="remove"><i class="fa fa-times-circle"></i></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="group of groups">
            <td><router-link :to="{name: 'group', params: {id: group.id}}">{{ group.name }}</router-link></td>
            <td>
              <router-link :to="{name: 'groupItems', params: {id: group.id}}">{{ group.default_permission }}</router-link>
              <div v-if="group.admin"><small>Управление пользователями</small></div>
            </td>
            <td>{{ group.created_at | date('DD.MM.YYYY') }}<br><small>{{ group.created_at | date('HH:mm:ss') }}</small></td>
            <td class="remove" @click="confirmDeleteGroup(group)"><i class="fa fa-times-circle"></i></td>
          </tr>
          </tbody>
          </table>
        </div>
        <div>
          <router-link to="/groups/add" class="addnew">Добавить группу<i class="fa fa-arrow-right"></i></router-link>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <spinner v-show="loading" message="Минутку..."></spinner>
    </transition>
    <transition name="fade">  
      <confirm v-show="confirm" confirmButton="Удалить" confirm-button-class="remove" v-on:confirm="deleteGroup(removingGroup)" v-on:cancel="confirm = false">
        Удалить группу &laquo;{{removingGroup.name}}&raquo;?
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
  name: 'groups',
  components: { Spinner, Confirm, Alert },
  data () {
    return {
      show: false,
      loading: false,
      confirm: false,
      alert: false,
      groups: [],
      removingGroup: {},
      errorMessage: null
    }
  },
  created () {
    $(document).attr('title', 'Группы')

    this.$http.get('/groups').then((response) => {
      let data = response.body

      if (data.state && data.state === 'error_admin_access_denied') {
        this.$router.push('/')
      } else if (data.groups) {
        this.groups = data.groups
      }

      this.show = true
    })
  },
  methods: {
    confirmDeleteGroup (group) {
      this.removingGroup = group

      this.confirm = true
    },
    deleteGroup (group) {
      this.confirm = false
      this.loading = true

      this.$http.delete('/groups/' + group.id).then((response) => {
        let data = response.body

        if (data.error) {
          this.errorMessage = data.error

          this.alert = true
        } else if (data.deleted) {
          let index = this.groups.indexOf(group)

          this.groups.splice(index, 1)
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
