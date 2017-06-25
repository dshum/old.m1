<template>
  <div>
    <div class="path" v-if="currentElement">
      <router-link to="/browse">Корень сайта</router-link>
      <template v-for="parent in parents">
        <span class="divider">/</span>
        <router-link :to="{name: 'browse', params: {classId: parent.classId}}">{{parent.name}}</router-link>
      </template>
      <span class="divider">/</span>
      <span>{{currentElement.name}}</span>
    </div>
    <div class="path" v-else>
      <span>Корень сайта</span>
    </div>
    <transition name="show">
      <div class="leaf" v-if="show">
        <div class="buttons">
          <div class="button up" :class="{enabled: currentElement}" @click="up()"><i class="fa fa-level-up"></i><br>Наверх</div>
          <div class="button edit" :class="{enabled: currentElement}"><i class="fa fa-pencil"></i><br>Редактировать</div>
          <div class="button save"><i class="fa fa-floppy-o"></i><br>Сохранить</div>
          <div class="button copy"><i class="fa fa-clone"></i><div>Копировать<span class="halflings halflings-triangle-bottom"></span></div></div>
          <div class="button move"><i class="fa fa-arrow-right"></i><div>Перенести<span class="halflings halflings-triangle-bottom"></span></div></div>
          <div class="button delete"><i class="fa fa-trash-o"></i><br>Удалить</div>
        </div>
        <div class="creates" v-if="creates.length">
          Добавить:<template v-for="(create, index) in creates"><span v-if="index">,</span><a>{{ create.name }}</a></template>
        </div>
        <div v-for="item in items">
          <item :classId="classId" :item="item" v-on:load="load(1)" v-on:empty="load(0)"></item>
        </div>
        <div class="empty" v-if="isEmpty || !items.length">
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
import Item from '@/components/common/Item'

export default {
  name: 'browse',
  components: { Spinner, Item },
  data () {
    return {
      show: false,
      loading: false,
      classId: null,
      currentItem: null,
      currentElement: null,
      parents: [],
      favorite: null,
      creates: [],
      items: [],
      isEmpty: false,
      isAnyone: false,
      loaded: 0
    }
  },
  watch: {
    '$route' (to, from) {
      if (this.classId !== to.params.classId) {
        this.classId = to.params.classId
        this.show = false

        this.getElement()
        this.getBrowse()
      }
    }
  },
  created () {
    this.classId = this.$route.params.classId

    this.getElement()
    this.getBrowse()
  },
  methods: {
    load (n) {
      this.loaded++

      if (n) {
        this.isAnyone = true
      }

      if (this.loaded === this.items.length) {
        this.isEmpty = !this.isAnyone
      }
    },
    getElement () {
      if (this.classId) {
        this.$http.get('/elements/' + this.classId).then((response) => {
          let data = response.body

          if (data.state && data.state === 'error_element_not_found') {
            this.$router.push('/browse')
          } else if (data.state && data.state === 'error_element_access_denied') {
            this.$router.push('/browse')
          } else if (data.element) {
            this.currentItem = data.item
            this.currentElement = data.element
            this.parents = data.parents
            this.favorite = data.favorite

            $(document).attr('title', data.element.name)
          }
        })
      } else {
        this.currentItem = null
        this.currentElement = null
        this.parents = []
        this.favorite = null

        $(document).attr('title', 'Корень сайта')
      }
    },
    getBrowse () {
      this.loading = true
      this.isEmpty = false
      this.isAnyone = false
      this.loaded = 0

      let url = this.classId ? '/browse/' + this.classId : '/browse/root'

      this.$http.get(url).then((response) => {
        let data = response.body

        if (data.creates) {
          this.creates = data.creates
        }

        if (data.items) {
          this.items = data.items
        }

        this.loading = false
        this.show = true
      })
    },
    up () {
      if (this.currentElement && this.currentElement.parent) {
        this.$router.push({name: 'browse', params: {classId: this.currentElement.parent.classId}})
      } else if (this.currentElement) {
        this.$router.push('/browse')
      }
    }
  }
}
</script>

<style scoped>
.creates {
  margin: 2rem 0 0 0;
}

.creates a {
  margin-left: 0.5rem;
}

.empty {
  margin: 2rem 0;
}
</style>
