<template>
  <div v-if="mode === 'browse'">
      <div v-html="view.value"></div>
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
  name: 'richtext-property',
  props: ['className', 'mode', 'view', 'model']
}
</script>
