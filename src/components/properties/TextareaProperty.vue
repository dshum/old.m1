<template>
  <div v-if="mode === 'browse'">
      <div v-html="text"></div>
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
export default {
  name: 'textarea-property',
  props: ['className', 'mode', 'view', 'model'],
  computed: {
    text () {
      return this.view.value ? this.view.value.replace(/\n/g, '<br />') : ''
    }
  }
}
</script>
