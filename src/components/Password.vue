<template>
  <div>
    <div class="path">
      Пароль
    </div>
    <transition name="show">
      <div class="leaf" v-if="show">
        <div class="form">
          <form @submit.prevent="submit()" autocomplete="true">
            <div class="row">
              <label>Текущий пароль:</label><span name="password_old" label="Текущий пароль" class="error"></span><br>
              <input type="password" name="password_old" v-model="model.password_old">
            </div>
            <div class="row">
              <label>Новый пароль:</label><span name="password" label="Новый пароль" class="error"></span><br>
              <input type="password" name="password" v-model="model.password">
            </div>
            <div class="row">
              <label>Подтверждение:</label><span name="password_confirmation" label="Подтверждение" class="error"></span><br>
              <input type="password" name="password_confirmation" v-model="model.password_confirmation">
            </div>
            <div class="row submit">
              <input type="submit" value="Изменить" class="btn">
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
  name: 'password',
  components: { Spinner },
  data () {
    return {
      show: false,
      loading: false,
      model: {}
    }
  },
  created () {
    var self = this

    $(document).attr('title', 'Пароль')

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

    setTimeout(function () {
      self.show = true
    }, 200)
  },
  methods: {
    submit () {
      $('.error').hide()

      this.loading = true

      this.$http.post('/password', this.model).then((response) => {
        let data = response.body

        if (data.errors) {
          data.errors.forEach(error => {
            $('.error[name="' + error.name + '"]').html(error.message).fadeIn(200)
          })
        } else {
          this.model = {}
        }

        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
