<template>
  <div>
    <div class="path">
      Журнал
    </div>
    <transition name="show">
      <div class="leaf" v-if="show">
        <form @submit.prevent="submit()">
          <div class="log search-form-params">
            <div class="row">
              <div class="block">
                <div class="container">
                  <div class="label">Комментарий</div>
                  <input type="text" name="comments" v-model="model.comments" placeholder="Комментарий">
                </div>
              </div>
              <div class="block">
                <div class="container">
                  <div class="label">Пользователь</div>
                  <select name="user" v-model="model.user">
                    <option value="">Все пользователи</option>
                    <option v-for="user of users" v-bind:value="user.id">{{ user.login }} ({{ user.first_name }} {{ user.last_name }})</option>
                  </select>
                </div>
              </div>
              <div class="block">
                <div class="container">
                  <div class="label">Тип операции</div>
                  <select name="type" v-model="model.type">
                    <option value="">Все операции</option>
                    <option v-for="type of types" v-bind:value="type.name">{{ type.title }}</option>
                  </select>
                </div>
              </div>
              <div class="block">
                <div class="container">
                  <div class="label">Дата</div>
                  <div>
                    <datepicker v-bind:monday-first="true" format="dd.MM.yyyy" input-class="date" language="ru" v-model="model.from" name="from" placeholder="От"></datepicker> &mdash;
                    <datepicker v-bind:monday-first="true" format="dd.MM.yyyy" input-class="date" language="ru" v-model="model.to" name="to" placeholder="До"></datepicker>
                    <span class="reset" @click="reset()">&#215;</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <input type="submit" value="Найти" class="btn">
            </div>
          </div>
        </form>
        <div v-if="showList">
          <p v-if="pager.total" class="result">Всего операций: {{ pager.total }}. Отсортировано по дате.</p>
          <p v-if="!pager.total" class="result">Операций не найдено.</p>
          <div v-for="page in pages">
            <div v-if="page > 1 && actions[page]" class="page">Страница {{ page }}</div>
            <ul class="log">
              <li v-for="action in actions[page]">
                <div class="avatar"><img v-bind:src="action.user.avatar" /></div>
                <div class="date">{{ action.created_at | date('DD.MM.YYYY')}}<br><span class="time">{{action.created_at | date('HH:mm:ss') }}</span></div>
                <span class="user">{{ action.user.login }}</span> <small>{{ action.user.first_name }} {{action.user.last_name }}</small><br>
                <span class="title">{{ action.action_type_name }}</span> <span>{{ action.comments }}</span>
              </li>
            </ul>
          </div>
          <div class="next" v-if="pager.hasMorePages" @click="nextPage()">
            Дальше<i class="fa fa-arrow-right"></i>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <spinner v-show="loading" message="Минутку..."></spinner>
    </transition>
  </div>
</template>

<script>
import moment from 'moment'
import Spinner from '@/components/common/Spinner'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'log',
  components: { Spinner, Datepicker },
  data () {
    return {
      show: false,
      showList: false,
      loading: false,
      users: [],
      types: [],
      pages: [],
      actions: [],
      statePage: [],
      pager: {
        total: 0,
        currentPage: 1,
        nextPage: 1,
        hasMorePages: false
      },
      model: {
        action: '',
        comments: '',
        user: '',
        type: '',
        from: '',
        to: ''
      }
    }
  },
  created () {
    $(document).attr('title', 'Журнал')

    var query = this.$route.query

    if (query['action']) this.model.action = query['action']
    if (query['comments']) this.model.comments = query['comments']
    if (query['user']) this.model.user = query['user']
    if (query['type']) this.model.type = query['type']
    if (query['from']) this.model.from = query['from']
    if (query['to']) this.model.to = query['to']

    this.$http.get('/log/form').then((response) => {
      let data = response.body

      if (data.users && data.types) {
        this.users = data.users
        this.types = data.types
      }

      this.show = true
    })

    if (this.model.action === 'search') {
      this.getList()
    }
  },
  methods: {
    toDate (date) {
      return date ? moment(date).format('YYYY-MM-DD') : null
    },
    reset () {
      this.model.from = null
      this.model.to = null
    },
    submit () {
      var params = {
        action: 'search'
      }

      if (this.model.comments) params['comments'] = this.model.comments
      if (this.model.user) params['user'] = this.model.user
      if (this.model.type) params['type'] = this.model.type
      if (this.model.from) params['from'] = this.toDate(this.model.from)
      if (this.model.to) params['to'] = this.toDate(this.model.to)

      this.$router.push({path: '/log', query: params})

      this.pages = []
      this.actions = []
      this.pager.total = 0
      this.pager.hasMorePages = false
      this.showList = false

      this.getList()
    },
    nextPage () {
      this.getList(this.pager.nextPage)
    },
    getList (page = 1) {
      this.loading = true

      this.pages.push(page)

      let params = [
        `comments=${this.model.comments}`,
        `user=${this.model.user}`,
        `type=${this.model.type}`,
        `from=${this.toDate(this.model.from)}`,
        `to=${this.toDate(this.model.to)}`,
        `page=${page}`
      ].join('&')

      let url = `/log?${params}`

      this.$http.get(url).then((response) => {
        let data = response.body

        if (data.actions && data.pager) {
          this.actions[page] = data.actions
          this.pager = data.pager
          this.showList = true
          this.loading = false
        }
      })
    }
  }
}
</script>

<style>
.log.search-form-params input[type="text"] {
    width: 10rem;
}

.log.search-form-params input[type="text"].date {
    width: 5rem;
    border-color: #999;
}

.log.search-form-params select {
    max-width: 15rem;
}

.result {
  margin: 2rem 0 1rem 0;
}

ul.log {
    margin: 1rem 0;
}

ul.log li {
  border-bottom: 1px solid #ccc;
}

ul.log li .user {
  margin-right: 2rem;
  color: midnightblue;
}

ul.log li .title {
  margin-right: 2rem;
  color: maroon;
}

ul.log li .date {
  float: right;
  margin-left: 2rem;
  padding-right: 0.5rem;
  font-size: 1rem;
  color: #333;
}

ul.log li .date .time {
  font-size: 0.9rem;
  color: #666;
}

ul.log li .avatar {
  float: left;
  margin-top: 0.1rem;
  padding-right: 1rem;
}

ul.log li .avatar img {
  width: 3rem;
  height: 3rem;
  border: 1px solid #ccc;
  border-radius: 50%;
}

ul.log li:last-child {
  border: none;
}

.page {
  border-bottom: 1px solid tan;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
  color: darkgoldenrod;
}
</style>
