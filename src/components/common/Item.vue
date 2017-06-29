<template>
  <transition name="fade-item">
    <div class="item" :class="{active: total}" v-if="total">
      <ul class="header">
        <li class="h2" @click="toggle()"><span>{{ item.name }}</span></li>
        <li class="total" v-if="total">
          Всего {{ total }} {{ selectCaseForNumber(total, ['элемент', 'элемента', 'элементов']) }}
        </li>
      </ul>
      <transition name="fade">
        <div v-if="opened && elements">
          <table class="elements">
            <thead>
              <tr>
                <th class="browse"><i class="fa fa-sort"></i></th>
                <th><a href>Название</a></th>
                <th v-for="property in properties"><a href>{{ property.title }}</a></th>
                <th class="check"><div class="check"></div></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="element in elements">
                <td class="browse"><router-link :to="{name: 'browse', params: {classId: element.classId}}"><i class="fa fa-angle-right"></i></router-link></td>
                <td class="name"><router-link :to="{name: 'browse', params: {classId: element.classId}, query: {mode: 'edit'}}"><i class="fa fa-pencil"></i><span>{{ element.name }}</span></router-link></td>
                <td v-for="property in properties">
                  <property :className="property.className" mode="browse" :view="element.views[property.name]"></property>
                </td>
                <td class="check"><div class="check"></div></td>
              </tr>
            </tbody>
          </table>
          <div class="pager" v-if="pager">
            <div class="arrow" :class="{active: pager.currentPage > 1}" @click="left()"><i class="fa fa-arrow-left"></i></div>
            <div class="arrow" :class="{active: pager.currentPage > 1}" @click="first()">1</div>
            <div class="page"><input type="text" v-model="pager.currentPage" @keydown="page($event)"></div>
            <div class="arrow" :class="{active: pager.currentPage < pager.lastPage}" @click="last()">{{ pager.lastPage }}</div>
            <div class="arrow" :class="{active: pager.currentPage < pager.lastPage}" @click="right()"><i class="fa fa-arrow-right"></i></div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import Property from '@/components/Property'

export default {
  name: 'item',
  components: { Property },
  props: ['classId', 'item'],
  data () {
    return {
      show: false,
      opened: this.item.open,
      total: 0,
      properties: [],
      elements: [],
      pager: null
    }
  },
  watch: {
    '$props' (to, from) {
      this.opened = this.item.open
      this.total = 0
      this.properties = []
      this.elements = []
      this.pager = null

      if (this.opened) {
        this.getElements()
      } else {
        this.getCount()
      }
    }
  },
  created () {
    if (this.opened) {
      this.getElements()
    } else {
      this.getCount()
    }
  },
  methods: {
    getCount () {
      let params = [
        `item=${this.item.id}`,
        `classId=${this.classId}`
      ].join('&')

      let url = `/elements/count?${params}`

      this.$http.get(url).then((response) => {
        let data = response.body

        if (data.count) {
          this.total = data.count

          this.$emit('load')
        } else {
          this.$emit('empty')
        }
      })
    },
    getElements () {
      let page = this.pager && this.pager.currentPage ? this.pager.currentPage : 1

      let params = [
        `item=${this.item.id}`,
        `classId=${this.classId}`,
        `page=${page}`
      ].join('&')

      let url = `/elements/list?${params}`

      this.$http.get(url).then((response) => {
        let data = response.body

        if (data.total) {
          this.total = data.total

          this.$emit('load')
        } else {
          this.$emit('empty')
        }

        if (data.pager) {
          this.pager = data.pager
        }

        if (data.properties) {
          this.properties = data.properties
        }

        if (data.elements) {
          this.elements = data.elements
        }

        this.opened = true
      })
    },
    toggle () {
      if (this.opened) {
        this.close()
      } else {
        if (this.elements.length) {
          this.open()
        } else {
          this.getElements()
        }
      }
    },
    open () {
      let params = [
        `item=${this.item.id}`,
        `classId=${this.classId}`
      ].join('&')

      let url = `/elements/open?${params}`

      this.$http.get(url).then((response) => {})

      this.opened = true
    },
    close () {
      let params = [
        `item=${this.item.id}`,
        `classId=${this.classId}`
      ].join('&')

      let url = `/elements/close?${params}`

      this.$http.get(url).then((response) => {})

      this.opened = false
    },
    first () {
      if (this.pager.currentPage !== 1) {
        this.pager.currentPage = 1

        this.getElements()
      }
    },
    left () {
      if (this.pager.currentPage < 1) {
        this.pager.currentPage = 1
      }

      if (this.pager.currentPage > this.pager.lastPage) {
        this.pager.currentPage = this.pager.lastPage
      }

      if (this.pager.currentPage > 1) {
        this.pager.currentPage--

        this.getElements()
      }
    },
    page (event) {
      var code = event.keyCode || event.which

      if (code === 13) {
        if (this.pager.currentPage < 1) {
          this.pager.currentPage = 1
        }

        if (this.pager.currentPage > this.pager.lastPage) {
          this.pager.currentPage = this.pager.lastPage
        }

        this.getElements()
      }
    },
    right () {
      if (this.pager.currentPage < 1) {
        this.pager.currentPage = 1
      }

      if (this.pager.currentPage > this.pager.lastPage) {
        this.pager.currentPage = this.pager.lastPage
      }

      if (this.pager.currentPage < this.pager.lastPage) {
        this.pager.currentPage++

        this.getElements()
      }
    },
    last () {
      if (this.pager.currentPage !== this.pager.lastPage) {
        this.pager.currentPage = this.pager.lastPage

        this.getElements()
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
.fade-item-enter-active {
  transition: opacity .8s;
}

.fade-item-enter {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity .2s ease-out;
}

.fade-enter {
  opacity: 0;
}

.item {
  margin-top: 2rem;
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
  color: #ccc;
}

.item.active ul.header li.h2 span {
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
</style>
