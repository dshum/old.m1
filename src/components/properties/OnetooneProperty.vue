<template>
  <div v-if="mode === 'browse'">
      <div v-if="view.value"><a>{{ view.value.name }}</a></div>
      <div v-else class="undefined">Не определено</div>
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
export default {
  name: 'onetoone-property',
  props: ['className', 'mode', 'view', 'model']
}
</script>

<style scoped>
.undefined {
  color: #999;
}
</style>
