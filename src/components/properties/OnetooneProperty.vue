<template>
  <div v-if="mode === 'browse'">
    <div v-if="view.value"><a>{{ view.value.name }}</a></div>
    <div v-else class="undefined">Не определено</div>
  </div>
  <div v-else-if="mode === 'edit'">
    <label>{{ view.title }}:</label>
    <span v-if="element">
      <router-link :to="{name: 'browse', params: {classId: element.classId}, query: {mode: 'edit'}}">{{ element.name }}</router-link>
    </span>
    <span v-else>
      Не определено
    </span>
    <span :name="view.name" :label="view.title" class="error"></span><br>
    <autocomplete :name="view.name" :value="initial" :item="view.relatedClass" v-on:update="update(arguments[0])" placeholder="ID или название"></autocomplete>
    <span class="reset" @click="reset()">&#215;</span>
  </div>
  <div v-else-if="mode === 'link'">
    <div class="label one"><i class="fa fa-tag"></i><span>{{ view.title }}</span></div>
  </div>
  <div v-else-if="mode === 'search'">
    <div class="label one"><i class="fa fa-tag"></i><span>{{ view.title }}</span></div>
    <div><input type="text" :value="view.value" placeholder="ID или название"></div>
  </div>
</template>

<script>
import Autocomplete from '../common/Autocomplete'

export default {
  name: 'onetoone-property',
  components: {
    Autocomplete
  },
  props: ['className', 'mode', 'view'],
  watch: {
    view (to, from) {
      this.initial = null
    }
  },
  data () {
    return {
      initial: null,
      element: this.view.value
    }
  },
  mounted () {
    let value = this.element ? this.element.id : null

    this.$emit('update', {value: value})
  },
  methods: {
    update (value) {
      this.element = value ? {
        id: value.id,
        classId: value.classId,
        name: value.value
      } : null

      this.initial = value ? value.value : null

      value = this.element ? this.element.id : null

      this.$emit('update', {value: value})
    },
    reset () {
      this.element = null
      this.initial = null

      this.$emit('update', {value: null})
    }
  }
}
</script>

<style scoped>
.undefined {
  color: #999;
}
</style>
