<template>
  <div>
    <nav @click="closeMenu()">
      <div class="container">
        <div class="logo"><router-link to="/">Moonlight</router-link></div>
        <ul class="right">
          <li v-if="loggedUser && loggedUser.avatar">
            <div class="avatar" @click.stop="toggleMenu()">
              <img v-bind:src="loggedUser.avatar" /><i class="fa fa-caret-down" aria-hidden="true"></i>
            </div>
          </li>
        </ul>
        <ul class="switch">
          <li v-bind:class="{ active: mode === 'favorites' }" @click="switchMode('favorites')"><span>Избранное</span></li>
          <li v-bind:class="{ active: mode === 'tree' }" @click="switchMode('tree')"><span>Страницы</span></li>
          <li v-bind:class="{ active: mode === 'search' }" @click="switchMode('search')"><span>Поиск</span></li>
          <li v-bind:class="{ active: mode === 'trash' }" @click="switchMode('trash')"><span>Корзина</span></li>
          <li v-bind:class="{ active: mode === 'users' }" @click="switchMode('users')"><span>Пользователи</span></li>
        </ul>
        <transition name="fade">
          <div class="menu" v-if="loggedUser && showMenu">
            <ul>
              <li class="title">{{loggedUser.first_name}} {{loggedUser.last_name}}<br /><small>{{loggedUser.email}}</small></li>
              <li><router-link to="/groups">Группы</router-link></li>
              <li><router-link to="/users">Пользователи</router-link></li>
              <li><router-link to="/log">Журнал</router-link></li>
              <li class="divider"></li>
              <li><router-link to="/parameters">Параметры</router-link></li>
              <li><router-link to="/profile">Редактировать профиль</router-link></li>
              <li><router-link to="/password">Сменить пароль</router-link></li>
              <li class="divider"></li>
              <li @click="logout()"><span>Выход</span></li>
            </ul>
          </div>
        </transition>
      </div>
    </nav>
    <div @click="closeMenu()">
      <div class="main">
        <div class="container">
          <router-view></router-view>
        </div>
      </div>
      <div class="sidebar">
        <div class="container">
          <transition name="switch">
            <div v-show="mode === 'favorites'">
              <div class="block-elements" v-for="rubric in rubrics">
                  <h2>{{ rubric.name }}</h2>
                  <ul class="elements" v-for="favorite in favorites[rubric.id]">
                      <li><router-link :to="{name: 'browse', params: {classId: favorite.class_id}}">{{ favorite.name }}</router-link></li>
                  </ul>
              </div>
            </div>
          </transition>
          <transition name="switch">
            <div v-show="mode === 'tree'">
              <div class="tree">
                <tree-folder></tree-folder>
              </div>
            </div>
          </transition>
          <transition name="switch">
            <div v-show="mode === 'search'">
              <input type="text" id="searchFilter" placeholder="Название">
              <ul class="search items">
                <li v-for="item in searchItems"><router-link :to="{name: 'searchItem', params: {item: item.id}}">{{ item.name }}</router-link><br><small>{{ item.id }}</small></li>
              </ul>
            </div>
          </transition>
          <transition name="switch">
            <div v-show="mode === 'trash'">
              <input type="text" id="trashFilter" placeholder="Название">
              <ul class="trash items">
                <template v-for="item in trashItems">
                  <li v-if="item.count"><a>{{ item.name }}</a><span class="total">{{ item.count }}</span><br><small>{{ item.id }}</small></li>
                </template>
              </ul>
            </div>
          </transition>
          <transition name="switch">
            <div v-show="mode === 'users'">
              <ul class="menu">
                <li><router-link to="/groups"><i class="fa fa-user" aria-hidden="true"></i>Группы</router-link></li>
                <li><router-link to="/users"><i class="fa fa-users" aria-hidden="true"></i>Пользователи</router-link></li>
                <li><router-link to="/log"><i class="fa fa-clock-o" aria-hidden="true"></i>Журнал</router-link></li>
                <li><router-link to="/profile"><i class="fa fa-pencil" aria-hidden="true"></i>Редактировать профиль</router-link></li>
                <li><router-link to="/password"><i class="fa fa-lock" aria-hidden="true"></i>Сменить пароль</router-link></li>
                <li @click="logout()"><span><i class="fa fa-sign-out" aria-hidden="true"></i>Выход</span></li>
              </ul>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TreeFolder from '../components/common/TreeFolder'

export default {
  name: 'base',
  components: { TreeFolder },
  data () {
    return {
      loggedUser: null,
      showMenu: false,
      mode: null,
      rubrics: [],
      favorites: [],
      searchItems: [],
      trashItems: []
    }
  },
  created () {
    if (!localStorage.getItem('loggedUser')) {
      this.logout()
    } else {
      this.$http.get('/profile').then((response) => {
        if (response.body.user) {
          this.loggedUser = response.body.user
        } else {
          this.logout()
        }
      }).catch(() => {
        this.logout()
      })
    }

    this.mode = localStorage.getItem('activeMode')
      ? localStorage.getItem('activeMode')
      : 'favorites'

    $.expr[':'].contains = function (a, i, m) {
      return $(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0
    }

    // Favorites

    this.$http.get('/favorites').then((response) => {
      let data = response.body

      if (data.rubrics && data.favorites) {
        this.rubrics = data.rubrics
        this.favorites = data.favorites
      }
    })

    // Search

    this.$http.get('/search/items').then((response) => {
      let data = response.body

      if (data.items) {
        this.searchItems = data.items
      }
    })

    $('#searchFilter').keyup(function () {
      var str = $(this).val()

      console.log('a')

      if (str.length > 0) {
        $('ul.search.items > li:not(:contains("' + str + '"))').hide()
        $('ul.search.items > li:contains("' + str + '")').show()
      } else {
        $('ul.search.items > li').show()
      }
    }).change(function () {
      var str = $(this).val()

      console.log('b')

      if (str.length > 0) {
        $('ul.search.items > li:not(:contains("' + str + '"))').hide()
        $('ul.search.items > li:contains("' + str + '")').show()
      } else {
        $('ul.search.items > li').show()
      }
    })

    // Trash

    this.$http.get('/trash/items').then((response) => {
      let data = response.body

      if (data.items) {
        this.trashItems = data.items

        this.trashItems.forEach(item => {
          this.$http.get('/trash/count/' + item.id).then((response) => {
            let data = response.body

            if (data && data.count > 0) {
              item.count = data.count
            } else {
              item.count = 0
            }
          })
        })
      }
    })
  },
  mounted () {
    $('#searchFilter').keyup(function () {
      let str = $(this).val()

      if (str.length > 0) {
        $('ul.search.items > li:not(:contains("' + str + '"))').hide()
        $('ul.search.items > li:contains("' + str + '")').show()
      } else {
        $('ul.search.items > li').show()
      }
    }).change(function () {
      let str = $(this).val()

      if (str.length > 0) {
        $('ul.search.items > li:not(:contains("' + str + '"))').hide()
        $('ul.search.items > li:contains("' + str + '")').show()
      } else {
        $('ul.search.items > li').show()
      }
    })

    $('#trashFilter').keyup(function () {
      let str = $(this).val()

      if (str.length > 0) {
        $('ul.trash.items > li:not(:contains("' + str + '"))').hide()
        $('ul.trash.items > li:contains("' + str + '")').show()
      } else {
        $('ul.trash.items > li').show()
      }
    }).change(function () {
      let str = $(this).val()

      if (str.length > 0) {
        $('ul.trash.items > li:not(:contains("' + str + '"))').hide()
        $('ul.trash.items > li:contains("' + str + '")').show()
      } else {
        $('ul.trash.items > li').show()
      }
    })
  },
  methods: {
    toggleMenu () {
      this.showMenu = !this.showMenu
    },
    closeMenu () {
      this.showMenu = false
    },
    switchMode (mode) {
      this.mode = null

      let self = this

      setTimeout(function () {
        self.mode = mode
        localStorage.setItem('activeMode', mode)
      }, 100)
    },
    logout () {
      localStorage.removeItem('loggedUser')

      this.$router.push('/login')
    }
  }
}
</script>

<style>
nav {
    position: fixed;
    display: block;
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;
    height: 5rem;
    line-height: 5rem;
    border-bottom: 1px solid #eaeaea;
    background-color: white;
    color: black;
}

nav div.container {
    z-index: 110;
    height: 5rem;
}

nav .logo {
    display: block;
    position: relative;
    float: left;
    margin-left: 2rem;
    color: inherit;
    font-size: 1.5rem;
}

nav .logo a {
    font-size: 1.5rem;
    text-decoration: none;
    color: inherit;
}

nav .logo .glyphicons {
    top: 15px;
    font-size: 1.5rem;
}

nav ul.switch {
    position: absolute;
    left: 20%;
    margin-left: 2rem;
}

nav ul.switch > li {
    float: left;
    margin-right: 3rem;
    height: 5rem;
    line-height: 5rem;
    vertical-align: middle;
    padding: 0;
    font-size: 1.2rem;
    cursor: pointer;
}

nav ul.switch > li a {
    color: inherit;
    text-decoration: none;
    padding: 0;
}

nav ul.switch > li.active {
    border-bottom: 2px solid orangered;
}

nav ul.right {
    float: right;
}

nav ul.right > li {
    float: left;
    margin-left: 3rem;
    height: 5rem;
    line-height: 5rem;
    vertical-align: middle;
    font-size: 1.2rem;
    padding: 0;
}

nav ul.right > li a {
    color: inherit;
    text-decoration: none;
    padding: 0;
}

nav .avatar {
    position: relative;
    top: 0.5rem;
    height: 4rem;
    line-height: 4rem;
    margin: 0 1rem 0 1rem;
    text-align: center;
    vertical-align: middle;
    overflow: hidden;
    cursor: pointer;
}

nav .avatar img {
    width: 4rem;
    height: 4rem;
    border: none;
    border-radius: 2px;
    background-color: white;
}

nav .avatar i.fa {
    position: relative;
    top: -1.3rem;
    margin-left: 1rem;
    font-size: 1.5rem;
    color: inherit;
}

nav .menu {
    display: block;
    position: absolute;
    z-index: 100;
    top: 5rem;
    right: 0;
    margin: 0;
    padding: 0;
    box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.18), 0 2px 11px 0 rgba(0, 0, 0, 0.15);
    border: none;
    border-collapse: separate;
    border-spacing: 1px;
    background-color: white;
    font-size: 1rem;
}

nav .menu ul {
    margin: 0;
    padding: 0;
}

nav .menu ul > li {
    float: none;
    height: 3rem;
    line-height: 3rem;
    margin: 0;
    padding: 0;
    white-space: nowrap;
    color: black;
}

nav .menu ul > li:hover {
    background-color: #eee;
    transition: 0.2s;
}

nav .menu ul > li.title {
    height: auto;
    line-height: 1.5rem;
    padding: 1rem 3rem 0.5rem 2rem;
    background-color: white;
    color: #357;
}

nav .menu ul > li.divider {
    height: 1px;
    background-color: #ddd;
    padding: 0;
}

nav .menu ul > li a {
    display: block;
    padding: 0 3rem 0 2rem;
    text-decoration: none;
    color: black;
}

nav .menu ul > li span {
    padding: 0 3rem 0 2rem;
    text-decoration: none;
    color: black;
    cursor: pointer;
}

.main > div.container::-webkit-scrollbar,
.sidebar::-webkit-scrollbar {
    width: 10px;
    background-color: rgba(127, 127, 127, 0.2);
}

.main > div.container::-webkit-scrollbar-thumb,
.sidebar::-webkit-scrollbar-thumb {
    background-color: rgba(127, 127, 127, 0.5);
}

.sidebar {
    position: absolute;
    z-index: 120;
    top: 5rem;
    left: 0;
    bottom: 0;
    width: 20%;
    background-color: white;
    color: black;
    overflow-y: auto;
    overflow-x: hidden;
    margin: 2rem 0;
    padding: 0;
}

.sidebar div.container {
    position: absolute;
    z-index: 130;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 2rem;
}

.sidebar a {
    color: inherit;
}

.sidebar small {
    color: #234e9e;
}

.sidebar div[mode] {
    display: none;
}

.sidebar ul.menu {
    margin: 0;
}

.sidebar ul.menu > li {
    margin: 0;
    padding: 0.5rem 0 1rem 0;
}

.sidebar ul.menu > li a {
    text-decoration: underline;
    color: inherit;
}

.sidebar ul.menu > li span {
    text-decoration: underline;
    color: inherit;
    cursor: pointer;
}

.sidebar ul.menu > li .router-link-active {
    color: teal;
}

.sidebar ul.menu > li i.fa {
  margin-right: 0.5rem;
  width: 1.5rem;
  text-align: left;
  color: #357;
}

.sidebar input[type="text"] {
    margin: 0 0 2rem 0;
    width: 10rem;
    border: 1px solid #999;
    color: black;
}

.sidebar input[type="text"]:focus:not([readonly]) {
    border: 1px solid #999;
    background-color: white;
}

.sidebar ::-webkit-input-placeholder {
    color: #666;
}

.sidebar :-moz-placeholder {
    color: #666;
}

.sidebar ::-moz-placeholder {
    color: #666;
}

.sidebar :-ms-input-placeholder {
    color: #666;
}

.sidebar ul.items > li {
    margin: 0;
    padding: 0 0 1rem 0;
}

.sidebar ul.items > li a.router-link-active {
    color: teal;
}

.sidebar ul.items > li .total {
    position: relative;
    display: inline-block;
    top: 1px;
    margin-left: 1rem;
    height: 1.5rem;
    line-height: 1.5rem;
    padding: 0 0.5rem;
    background-color: tan;
    color: black;
    font-weight: normal;
    border-radius: 2px;
}

.sidebar .block-elements {
    margin: 0 0 1rem 0;
}

.sidebar .block-elements h2 {
    margin: 0 0 0.5rem 0;
    color: #37a;
    font-size: 1.3rem;
    font-weight: normal;
}

.sidebar .block-elements ul > li {
    padding: 0 0 0.5rem 0.25rem;
}

.sidebar .block-elements ul > li.router-link-active {
    color: teal;
}

.sidebar context {
    display: block;
    position: absolute;
    z-index: 100;
    top: -9999px;
    left: -9999px;
    margin: 0;
    margin-bottom: 2rem;
    padding: 0;
    box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.18), 0 2px 11px 0 rgba(0, 0, 0, 0.15);
    border: none;
    border-collapse: separate;
    border-spacing: 1px;
    background-color: white;
}

.sidebar context ul {
    margin: 0;
    padding: 0;
}

.sidebar context ul > li {
    float: none;
    height: 3rem;
    line-height: 3rem;
    margin: 0;
    padding: 0;
    white-space: nowrap;
    color: black;
}

.sidebar context ul > li:hover {
    background-color: #eee;
    transition: 0.2s;
}

.sidebar context ul > li.divider {
    height: 1px;
    background-color: #ddd;
    padding: 0;
}

.sidebar context ul > li a {
    display: block;
    padding: 0 3rem 0 2rem;
    text-decoration: none;
    color: black;
}

.main {
    position: absolute;
    top: 5rem;
    left: 20%;
    bottom: 0;
    width: 80%;
    padding: 0;
}

.main > .container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: scroll;
    padding: 2rem 2rem;
    background-color: white;
}

.main div.leaf {
    display: table;
    margin-bottom: 3rem;
}

.main .path {
    display: table;
    margin: 0 0 1rem 0;
    color: black;
    font-size: 1.5rem;
    line-height: 1.5rem;
}

.main .path b {
  font-weight: normal;
  color: darkorchid;
}

.main .path a {
    display: block;
    float: left;
    text-decoration: none;
    border-bottom: 1px solid #37a;
    color: #357;
}

.main .path span {
    display: block;
    float: left;
    text-decoration: none;
    border-bottom: 1px solid transparent;
}

.main .path .divider {
    display: block;
    float: left;
    margin: 0 1rem;
    color: silver;
}

/* Tree */

.tree {
  display: block;
  margin-bottom: 3rem;
}

.tree a {
  color: inherit;
  text-decoration: underline;
  white-space: nowrap;
}

.tree a.router-link-active {
  color: teal;
  text-decoration: underline;
}

.tree .margin {
  margin: 5px 0 10px 0;
  white-space: nowrap;
}

.tree .item {
  margin: 0.5rem 0 0 0;
  font-size: 0.8rem;
  color: #234e9e;
  font-weight: bold;
}

.tree > div > div[item] > .item {
  font-size: 1.3rem;
  color: #37a;
  font-weight: normal;
}

.tree .padding {
  margin-left: 1rem;
  padding-left: 2rem;
  overflow: hidden;
}

.tree .plus {
  width: 1rem;
  height: 1rem;
  float: left;
  margin: 0 0.5rem 0 0;
  cursor: pointer;
  cursor: hand;
}

.tree .minus {
  width: 1rem;
  height: 1rem;
  float: left;
  margin: 0 0.5rem 0 0;
  cursor: pointer;
  cursor: hand;
}

.tree .empty {
  width: 1rem;
  height: 1rem;
  float: left;
  margin: 1px 0.5rem 0 0;
}

.tree .fa {
  position: relative;
  top: -2px;
  color: #3a7;
  font-size: 1.5rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.switch-enter-active {
  transition: opacity .8s;
}

.switch-enter {
  opacity: 0;
}

.fade-leave-to {
  display: none;
}

.show-enter-active,
.show-leave-active {
  transition: opacity .4s;
}

.show-enter,
.show-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.4s;
  overflow: hidden;
}

.slide-enter,
.slide-leave-to {
  max-height: 0;
}

.slide-enter-to,
.slide-leave {
  max-height: 30rem;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: max-width 0.6s, max-height 0.4s, opacity 0.2s;
  overflow: hidden;
}

.slide-fade-enter,
.slide-fade-leave-to {
  max-width: 0;
  max-height: 0;
  opacity: 0;
  visibility: hidden;
}

.slide-fade-enter-to,
.slide-fade-leave {
  max-width: 30rem;
  max-height: 30rem;
  opacity: 1;
  visibility: visible;
}
</style>
