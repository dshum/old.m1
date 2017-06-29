<template>
  <div v-if="mode === 'browse'">
    <div v-html="view.value"></div>
  </div>
  <div v-else-if="mode === 'edit'">
    <label>{{ view.title }}:</label><br>
    <div v-html="view.value"></div>
  </div>
</template>

<script>
export default {
  name: 'virtual-property',
  props: ['className', 'mode', 'view', 'model']
}
</script>
