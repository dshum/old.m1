<template>
  <div>
    <div class="path">
      Профиль пользователя <b>{{ user.login }}</b>
    </div>
    <transition name="show">
      <div class="leaf" v-if="show">
        <div class="form">
          <form @submit.prevent="submit()">
            <div class="row">
              <div v-if="user.groups">
                Состоит в группах:
                <div v-for="group of user.groups"><a>{{ group.name }}</a></div>
              </div>
              <div v-if="user.super">Суперпользователь</div>
            </div>
            <div class="row">
              Дата создания: {{ user.created_at | date('DD.MM.YYYY') }} <small>{{user.created_at | date('HH:mm:ss') }}</small><br>
              Последний вход: {{ user.last_login | date('DD.MM.YYYY') }} <small>{{user.last_login | date('HH:mm:ss') }}</small>
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
              <label>Аватар:</label><span name="file" label="Фотография" class="error"></span><br>
              <div v-if="user.photo"><img v-bind:src="user.photo" /></div>
              <small class="red">Максимальный размер файла 1024 Кб</small><br />
              <small class="red">Минимальный размер изображения 100&#215;100 пикселей</small><br />
              <div class="loadfile">
                <div class="file" name="file" @click="selectFile($event)">Выберите файл</div>
                <span class="reset" name="file" @click="resetFile($event)">&#215;</span>
                <div class="file-hidden"><input type="file" name="file" @change="changeFile($event)"></div>
              </div>
              <p><input type="checkbox" name="drop" id="drop" v-model="drop" value="1"><label for="drop">Удалить</label></p>
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
  name: 'profile',
  components: { Spinner },
  data () {
    return {
      show: false,
      loading: false,
      user: {},
      file: null,
      drop: false
    }
  },
  created () {
    var self = this

    $(document).attr('title', 'Профиль')

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

    this.$http.get('/profile').then((response) => {
      if (response.body.user) {
        this.user = response.body.user
      }

      this.show = true
    })
  },
  methods: {
    selectFile (event) {
      let name = event.target.getAttribute('name')
      let fileInput = $(':file[name="' + name + '"]')

      fileInput.click()
    },
    changeFile (event) {
      let name = event.target.getAttribute('name')
      let path = event.target.files[0] ? event.target.files[0].name : 'Выберите файл'

      this.file = event.target.files[0]

      $('.file[name="' + name + '"]').html(path)
    },
    resetFile (event) {
      let name = event.target.getAttribute('name')

      $('.file[name="' + name + '"]').html('Выберите файл')
      $(':file[name="' + name + '"]').val('')

      this.file = null
    },
    submit () {
      let formData = new FormData()

      Object.keys(this.user).forEach(name => {
        formData.append(name, this.user[name])
      })

      if (this.file) {
        formData.append('file', this.file, this.file.name)
      } else if (this.drop) {
        formData.append('drop', true)
      }

      $('.error').hide()

      this.loading = true

      this.$http.post('/profile', formData).then((response) => {
        let data = response.body

        if (data.errors) {
          data.errors.forEach(error => {
            $('.error[name="' + error.name + '"]').html(error.message).fadeIn(200)
          })
        } else if (data.user) {
          this.user = data.user

          if (data.user.avatar) {
            $('.avatar > img').attr('src', data.user.avatar)
          }

          $('.file[name="file"]').html('Выберите файл')
          $(':file[name="file"]').val('')

          this.file = null
          this.drop = false
        }

        let self = this

        setTimeout(function () {
          self.loading = false
        }, 200)
      })
    }
  }
}
</script>

<style scoped>
img {
  margin-top: 0.2rem;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.18), 0 2px 9px 0 rgba(0, 0, 0, 0.15);
  border: none;
  border-radius: 2px;
  padding: 0;
}
</style>
