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
    <edit v-if="currentElement && mode === 'edit'"
      v-on:updateElement="updateElement(arguments[0])"
      :classId="classId" 
      :item="currentItem" 
      :element="currentElement"
      :parents="parents"
      :favorite="favorite"></edit>
    <browse v-else
      :classId="classId" 
      :item="currentItem" 
      :element="currentElement"
      :parents="parents"
      :favorite="favorite"></browse>
  </div>
</template>

<script>
import Spinner from '@/components/common/Spinner'
import Browse from '@/components/Browse'
import Edit from '@/components/Edit'

export default {
  name: 'element',
  components: { Spinner, Browse, Edit },
  data () {
    return {
      show: false,
      loading: false,
      classId: null,
      currentItem: null,
      currentElement: null,
      parents: [],
      favorite: null,
      mode: null
    }
  },
  watch: {
    '$route' (to, from) {
      var update = false

      if (this.classId !== to.params.classId) {
        this.classId = to.params.classId

        update = true
      }

      if (this.mode !== to.query.mode) {
        this.mode = to.query.mode

        update = true
      }

      if (update) {
        this.show = false

        this.getElement()
      }
    }
  },
  created () {
    this.classId = this.$route.params.classId
    this.mode = this.$route.query.mode

    this.getElement()
  },
  methods: {
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
    updateElement (value) {
      this.currentElement = value.element
      this.parents = value.parents
    }
  }
}
</script>

<style scoped>

</style>
