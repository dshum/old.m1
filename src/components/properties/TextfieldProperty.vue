<template>
  <div v-if="mode === 'browse'">
    <div v-html="view.value"></div>
  </div>
  <div v-else-if="mode === 'edit'">
    <label>{{ view.title }}:</label><span :name="view.name" :label="view.title" class="error"></span><br>
    <input type="text" :class="{mainp: view.isMainProperty}" :name="view.name" v-on:input="update($event.target.value)" :value="view.value" :disabled="view.readonly" :placeholder="view.title">
  </div>
  <div v-else-if="mode === 'link'">
    <div v-if="view.isMainProperty" class="label mainp"><i class="fa fa-flag"></i><span>ID или название</span></div>
    <div v-else class="label textfield"><i class="fa fa-pencil"></i><span>{{ view.title }}</span></div>
  </div>
  <div v-else-if="mode === 'search'">
    <div v-if="view.isMainProperty" class="label mainp"><i class="fa fa-flag"></i><span>ID или название</span></div>
    <div v-else class="label textfield"><i class="fa fa-pencil"></i><span>{{ view.title }}</span></div>
    <div><input type="text" :value="view.value" placeholder=""></div>
  </div>
</template>

<script>
export default {
  name: 'textfield-property',
  props: ['className', 'mode', 'view', 'model'],
  mounted () {
    this.update(this.view.value)
  },
  methods: {
    update (value) {
      this.$emit('update', {value: value})
    }
  }
}
</script>

<style scoped>
input[type="text"].mainp {
  width: 30rem;
  height: 3rem;
  color: steelblue;
  font-size: 1.2rem;
}
</style>
