<template>
  <div v-if="mode === 'browse'">
    <div v-html="view.value"></div>
  </div>
  <div v-else-if="mode === 'edit'">
    <label>{{ view.title }}:</label><span :name="view.name" :label="view.title" class="error"></span><br>
    <div class="richtext">
      <tinymce :id="view.name" @change="update" v-model="value" :content="view.value" :options="options"></tinymce>
    </div>
  </div>
  <div v-else-if="mode === 'link'">
    <div class="label textarea"><i class="fa fa-comment"></i><span>{{ view.title }}</span></div>
  </div>
  <div v-else-if="mode === 'search'">
    <div class="label textarea"><i class="fa fa-comment"></i><span>{{ view.title }}</span></div>
    <div><input type="text" :value="view.value" placeholder=""></div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueTinymce from 'vue-tinymce'

Vue.use(VueTinymce)

export default {
  name: 'richtext-property',
  components: {
    VueTinymce
  },
  props: ['className', 'mode', 'view', 'model'],
  data () {
    return {
      value: this.view.value,
      options: {
        language: 'ru',
        plugins: ['lists', 'link', 'image', 'paste', 'table', 'code', 'preview'],
        width: '40rem',
        height: '20rem',
        setup: editor => {
          let self = this

          editor.on('keypress keydown', (event) => {
            return self.$hotkeys.onCtrlS(event, function () {
              self.$emit('save')
            })
          })
        }
      }
    }
  },
  mounted () {
    this.update(this.view.value)
  },
  methods: {
    update () {
      this.$emit('update', {value: this.value})
    }
  }
}
</script>

<style>

</style>
