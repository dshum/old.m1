<template>
  <div>
    <div class="path">
      <router-link to="/groups">Группы</router-link><span class="divider">/</span><span>Новая группа</span>
    </div>
    <transition name="show">
      <div class="leaf" v-if="show">
        <div class="form">
          <form @submit.prevent="submit()">
            <div class="row">
              <label>Название:</label><span name="name" label="Название" class="error"></span><br>
              <input type="text" name="name" v-model="group.name" placeholder="Название">
            </div>
            <div class="row">
              <p><input type="checkbox" name="admin" id="admin" v-model="group.admin" value="1"> <label for="admin">Управление пользователями</label></p>
            </div>
            <div class="row">
              <label>Доступ к элементам по умолчанию:</label><span name="default_permission" label="Доступ к элементам" class="error"></span>
              <p><input type="radio" name="default_permission" id="permission_deny" v-model="group.default_permission" value="deny"> <label for="permission_deny">Доступ закрыт</label></p>
              <p><input type="radio" name="default_permission" id="permission_view" v-model="group.default_permission" value="view"> <label for="permission_view">Просмотр</label></p>
              <p><input type="radio" name="default_permission" id="permission_update" v-model="group.default_permission" value="update"> <label for="permission_update">Изменение</label></p>
              <p><input type="radio" name="default_permission" id="permission_delete" v-model="group.default_permission" value="delete"> <label for="permission_delete">Удаление</label></p>
            </div>
            <div class="row" v-if="group.created_at">
                Дата создания: {{ group.created_at | date('DD.MM.YYYY') }} <small>{{ group.created_at | date('HH:mm:ss') }}</small><br>
                Последнее изменение: {{ group.updated_at | date('DD.MM.YYYY') }} <small>{{ group.updated_at | date('HH:mm:ss') }}</small>
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
  name: 'addGroup',
  components: { Spinner },
  data () {
    return {
      show: false,
      loading: false,
      group: {}
    }
  },
  created () {
    var self = this

    $(document).attr('title', 'Новая группа')

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

    this.$http.get('/groups').then((response) => {
      if (response.body.state === 'error_admin_access_denied') {
        this.$router.push('/')
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

      this.$http.post('/groups', this.group).then((response) => {
        let data = response.body

        if (data.errors) {
          data.errors.forEach(error => {
            $('.error[name="' + error.name + '"]').html(error.message).fadeIn(200)
          })
        } else if (data.added) {
          this.$router.push('/groups')
        }

        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
