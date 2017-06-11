<template>
  <div class="login">
    <div class="container">
      <div class="path">
        Вход
      </div>
      <div class="block">
        <transition name="slide">
          <div v-if="message" class="error">{{ message }}</div>
        </transition>
        <form @submit.prevent="submit()">
          <div class="row">
            <input type="text" v-model="login" name="login" placeholder="Логин">
          </div>
          <div class="row">
            <input type="password" v-model="password" name="password" placeholder="Пароль">
          </div>
          <div class="row">
            <input type="submit" value="Войти" class="btn">
          </div>
        </form>
      </div>
      <div>
        <router-link to="/restore">Забыли пароль?</router-link>
      </div>
    </div>
    <transition name="fade">
      <spinner v-show="loading" message="Минутку..."></spinner>
    </transition>
  </div>
</template>

<script>
import Spinner from '@/components/common/Spinner'

export default {
  name: 'login',
  components: { Spinner },
  data () {
    return {
      loading: false,
      message: '',
      login: '',
      password: ''
    }
  },
  created () {
    if (localStorage.getItem('loggedUser')) {
      this.$router.push('/')
    }
  },
  methods: {
    submit () {
      if (!this.login) {
        this.message = 'Введите логин.'
        $('input[name="login"]').focus()
      } else if (!this.password) {
        this.message = 'Введите пароль.'
        $('input[name="password"]').focus()
      } else {
        const params = {
          'login': this.login,
          'password': this.password
        }

        this.loading = true

        this.$http.post('/login', params).then((response) => {
          if (response.body.error) {
            this.message = response.body.error
            this.loading = false
          } else if (response.body.token) {
            localStorage.setItem('loggedUser', JSON.stringify({
              login: this.login,
              token: response.body.token
            }))

            this.$router.push('/')
          }
        }).catch(() => {
          this.message = 'Произошла какая-то ошибка.'
          this.loading = false
        })
      }
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-enter,
.slide-leave-to {
  height: 0;
}

.login {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-image: url(http://yandex.ru/images/today?size=1920x1080);
  background-position: center;
  background-size: 100% 100%;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.login .container {
  position: absolute;
  top: 25%;
  left: 0;
  right: 0;
  margin: auto;
  width: 20rem;
}

.login .path {
  display: table;
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  background-color: gold;
  color: black;
  opacity: 0.9;
  border-radius: 2px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.18);
  font-size: 1.2rem;
}

.login .block {
  display: block;
  padding: 0;
  box-shadow: 0 2px 5px 0 rgba(30, 50, 100, 0.3), 0 2px 10px 0 rgba(30, 50, 100, 0.2);
  background-color: rgba(25, 30, 33, 0.8);
  border: none;
  border-radius: 2px;
  color: white;
}

.login .error {
  display: block;
  margin: 0;
  padding: 1rem 2rem;
  border: none;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  background-color: rgba(255, 69, 0, 0.8);
  color: white;
}

.login a {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 2px;
  background-color: rgba(30, 90, 120, 0.8);
  color: white;
}

.login .row {
  margin: 0;
  padding: 1rem 2rem;
}

.login .row:first-child {
  padding-top: 2rem;
}

.login .row:last-child {
  padding-bottom: 2rem;
}

.login .btn {
  box-shadow: 0 2px 5px 0 rgba(100, 150, 200, 0.16), 0 2px 10px 0 rgba(100, 150, 200, 0.12);
  background-color: orange;
  color: rgb(25, 30, 33);
}

.login input[type=text],
.login input[type=password] {
  height: 3rem;
  width: 100%;
  outline: none;
  box-shadow: none;
  box-sizing: content-box;
  border: none;
  border-bottom: 1px solid #666;
  transition: all .2s;
  padding: 0;
  background-color: transparent;
  color: white;
  font-size: 1rem;
}

.login input[type=text]:focus,
.login input[type=password]:focus {
  border: none;
  background-color: transparent;
  border-bottom: 1px solid gold;
}

.login form ::-webkit-input-placeholder {
  color: #abc;
}

.login form :-moz-placeholder {
  color: #abc;
}

.login form ::-moz-placeholder {
  color: #abc;
}

.login form :-ms-input-placeholder {
  color: #abc;
}

.login form input:-webkit-autofill,
.login form input:-webkit-autofill:hover,
.login form input:-webkit-autofill:focus,
.login form input:-webkit-autofill:active {
  transition: background-color 99999s ease-in-out 0s;
  -webkit-text-fill-color: white !important;
}
</style>
