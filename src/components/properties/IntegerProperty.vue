<template>
  <div v-if="mode === 'browse'">
    <div v-html="view.value"></div>
  </div>
  <div v-else-if="mode === 'edit'">
    <label>{{ view.title }}:</label><span :name="view.name" :label="view.title" class="error"></span><br>
    <input type="text" class="number" :name="view.name" v-on:input="update($event.target.value)" :value="view.value" :disabled="view.readonly" :placeholder="view.title">
  </div>
  <div v-else-if="mode === 'link'">
    <div class="label number"><i class="fa fa-calculator"></i><span>{{ view.title }}</span></div>
  </div>
  <div v-else-if="mode === 'search'">
    <div class="label number"><i class="fa fa-calculator"></i><span>{{ view.title }}</span></div>
    <div>
      <input type="text" class="number" :value="view.value" placeholder="От"> &mdash;
      <input type="text" class="number" :value="view.value" placeholder="До">
    </div>
  </div>
</template>

<script>
export default {
  name: 'integer-property',
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
input[type="text"].number {
  width: 5rem;
}
</style>
