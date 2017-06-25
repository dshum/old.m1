<template>
  <div>
    <div class="path">
      <router-link to="/search">Поиск</router-link><span class="divider">/</span><span>{{ currentItem.name }}</span>
    </div>
    <transition name="show">
      <div class="leaf" v-if="show">
        <form @submit.prevent="submit()">
          <div class="search-form-links">
            <div class="row">
              <div class="link" v-for="property in properties" :class="property.active ? 'active' : ''" @click="toggle(property)">
                <property :className="property.className" mode="link" :view="property.view" :model="model"></property>
              </div>
            </div>
          </div>
          <div class="search-form-params">
            <div class="row">
              <template v-for="property in properties">
                <transition name="slide-fade">
                  <div class="block" v-show="property.active">
                    <div class="container">
                      <div class="close" @click="close(property)"><i class="fa fa-minus-square-o"></i></div>
                      <property :className="property.className" mode="search" :view="property.view" :model="model"></property>
                    </div>
                  </div>
                </transition>
              </template>
            </div>
            <div class="row">
              <input type="submit" value="Найти" class="btn">
            </div>
          </div>
        </form>
        <div class="item list" v-if="currentItem && showList">
          <div class="buttons">
            <div class="button save enabled"><i class="fa fa-floppy-o"></i><br>Сохранить</div>
            <div class="button copy enabled"><i class="fa fa-clone"></i><div>Копировать<span class="halflings halflings-triangle-bottom"></span></div></div>
            <div class="button move enabled"><i class="fa fa-arrow-right"></i><div>Перенести<span class="halflings halflings-triangle-bottom"></span></div></div>
            <div class="button delete enabled"><i class="fa fa-trash-o"></i><br>Удалить</div>
          </div>
          <ul class="header">
            <li class="h2"><span>{{ currentItem.name }}</span></li>
            <li class="total" v-if="currentItem.total">
              Всего {{ currentItem.total }} {{ selectCaseForNumber(currentItem.total, ['элемент', 'элемента', 'элементов']) }}
            </li>
          </ul>
          <table class="elements">
            <thead>
              <tr>
                <th class="browse"><i class="fa fa-sort"></i></th>
                <th><a href>Название</a></th>
                <th v-for="property in currentItem.properties"><a href>{{ property.title }}</a></th>
                <th class="check"><div class="check"></div></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="element in currentItem.elements">
                <td class="browse"><a><i class="fa fa-angle-right"></i></a></td>
                <td class="name"><a><i class="fa fa-pencil"></i><span>{{ element.name }}</span></a></td>
                <td v-for="property in currentItem.properties">
                  <property :className="property.className" mode="browse" :view="element.views[property.name]"></property>
                </td>
                <td class="check"><div class="check"></div></td>
              </tr>
            </tbody>
          </table>
          <br clear="both">
          <div class="pager" v-if="currentItem.pager">
            <div class="arrow" :class="{active: currentItem.pager.currentPage > 1}" @click="left()"><i class="fa fa-arrow-left"></i></div>
            <div class="arrow" :class="{active: currentItem.pager.currentPage > 1}" @click="first()">1</div>
            <div class="page"><input type="text" v-model="currentItem.pager.currentPage" @keydown="page($event)"></div>
            <div class="arrow" :class="{active: currentItem.pager.currentPage < currentItem.pager.lastPage}" @click="last()">{{ currentItem.pager.lastPage }}</div>
            <div class="arrow" :class="{active: currentItem.pager.currentPage < currentItem.pager.lastPage}" @click="right()"><i class="fa fa-arrow-right"></i></div>
          </div>
        </div>
        <div class="empty" v-if="isEmpty">
          Элементы не найдены.
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
import Property from '@/components/Property'

export default {
  name: 'searchItem',
  components: { Spinner, Property },
  data () {
    return {
      show: false,
      showList: false,
      isEmpty: false,
      loading: false,
      id: null,
      currentItem: {},
      properties: [],
      model: {}
    }
  },
  watch: {
    '$route' (to, from) {
      if (this.id !== to.params.item) {
        this.id = to.params.item
        this.show = false

        this.getItem()
      }
    }
  },
  created () {
    this.id = this.$route.params.item

    this.getItem()
  },
  methods: {
    getItem () {
      this.showList = false
      this.isEmpty = false

      var query = this.$route.query

      this.$http.get('/search/items/' + this.id).then((response) => {
        let data = response.body

        if (data.item && data.properties) {
          this.currentItem = data.item
          this.properties = data.properties
          this.show = true

          if (query['action'] === 'search') {
            this.getElements(1)
          }

          $(document).attr('title', data.item.name)
        }
      })
    },
    toggle (property) {
      property.active = !property.active

      this.updateActive(property)
    },
    close (property) {
      property.active = false

      this.updateActive(property)
    },
    updateActive (property) {
      this.$http.post('/search/active/' + this.id + '/' + property.name, {
        active: property.active
      }).then((response) => {})
    },
    submit () {
      var query = {
        action: 'search'
      }

      this.$router.push({name: 'searchItem', params: {item: this.id}, query: query})

      this.currentItem['pager'] = null

      this.showList = false
      this.isEmpty = false

      this.getElements(1)
    },
    getElements (page = 1, nextPage = false) {
      this.loading = true

      let params = [
        `item=${this.id}`
      ]

      if (page) {
        params.push(`page=${page}`)
      }

      let paramsStr = params.join('&')

      let url = `/search/list?${paramsStr}`

      this.$http.get(url).then((response) => {
        let data = response.body

        if (data.total) {
          this.currentItem.total = data.total
        }

        if (data.pager) {
          this.currentItem.pager = data.pager
        }

        if (data.properties) {
          this.currentItem.properties = data.properties
        }

        if (data.elements) {
          if (nextPage) {
            data.elements.forEach(element => {
              this.currentItem.elements.push(element)
            })
          } else {
            this.currentItem.elements = data.elements
          }
        }

        if (data.total > 0) {
          this.showList = true
        } else {
          this.isEmpty = true
        }

        this.loading = false
      })
    },
    nextPage () {
      if (this.currentItem['pager'].hasMorePages) {
        this.currentItem['pager'].currentPage++

        this.getElements(this.currentItem['pager'].currentPage, true)
      }
    },
    first () {
      if (this.currentItem['pager'].currentPage !== 1) {
        this.currentItem['pager'].currentPage = 1

        this.getElements(this.currentItem['pager'].currentPage)
      }
    },
    left () {
      if (this.currentItem['pager'].currentPage < 1) {
        this.currentItem['pager'].currentPage = 1
      }

      if (this.currentItem['pager'].currentPage > this.currentItem['pager'].lastPage) {
        this.currentItem['pager'].currentPage = this.currentItem['pager'].lastPage
      }

      if (this.currentItem['pager'].currentPage > 1) {
        this.currentItem['pager'].currentPage--

        this.getElements(this.currentItem['pager'].currentPage)
      }
    },
    page (event) {
      var code = event.keyCode || event.which

      if (code === 13) {
        if (this.currentItem['pager'].currentPage < 1) {
          this.currentItem['pager'].currentPage = 1
        }

        if (this.currentItem['pager'].currentPage > this.currentItem['pager'].lastPage) {
          this.currentItem['pager'].currentPage = this.currentItem['pager'].lastPage
        }

        this.getElements(this.currentItem['pager'].currentPage)
      }
    },
    right () {
      if (this.currentItem['pager'].currentPage < 1) {
        this.currentItem['pager'].currentPage = 1
      }

      if (this.currentItem['pager'].currentPage > this.currentItem['pager'].lastPage) {
        this.currentItem['pager'].currentPage = this.currentItem['pager'].lastPage
      }

      if (this.currentItem['pager'].currentPage < this.currentItem['pager'].lastPage) {
        this.currentItem['pager'].currentPage++

        this.getElements(this.currentItem['pager'].currentPage)
      }
    },
    last () {
      if (this.currentItem['pager'].currentPage !== this.currentItem['pager'].lastPage) {
        this.currentItem['pager'].currentPage = this.currentItem['pager'].lastPage

        this.getElements(this.currentItem['pager'].currentPage)
      }
    },
    selectCaseForNumber (number, cases) {
      if ((number % 10) === 1 && (number % 100) !== 11) {
        return cases[0]
      } else if ((number % 10) > 1 && (number % 10) < 5 && (number % 100 < 10 || number % 100 > 20)) {
        return cases[1]
      }

      return cases[2]
    }
  }
}
</script>

<style scoped>
.search-form-params {
  margin-top: 1rem;
}

.list {
  margin-top: 2rem;
}

.item {
  display: block;
}

ul.header {
  margin: 0;
}

ul.header li {
  display: inline-block;
  float: left;
  height: 2rem;
  line-height: 2rem;
  vertical-align: middle;
  padding: 0;
}

ul.header li:last-child {
  float: none;
}

ul.header li.h2 {
  line-height: 1.8rem;
}

ul.header li.h2 span {
  font-size: 1.3rem;
  color: #37a;
}

ul.header li.total {
  margin-left: 1rem;
  font-size: 0.9rem;
  color: #666;
}

table.elements {
  margin: 0;
}

.pager {
  display: inline-block;
  margin: 0;
  margin-left: -1rem;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.pager .arrow {
  display: block;
  float: left;
  width: 4rem;
  height: 2.5rem;
  line-height: 2.5rem;
  border: 2px solid transparent;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  vertical-align: middle;
  text-align: center;
  color: silver;
}

.pager .arrow .fa {
  font-size: 1rem;
}

.pager .arrow.active {
  color: black;
}

.pager .arrow.active:hover {
  background-color: orange;
  transition: 0.2s ease;
}

.pager .page {
  display: block;
  float: left;
}

.pager .page input {
  width: 4rem;
  height: 2.5rem;
  border: 2px solid silver;
  border-radius: 2px;
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
  color: black;
}

.empty {
  margin: 2rem 0;
}
</style>
