<template>
  <div v-if="mode === 'browse'">
    <div v-if="view.value">Да</div>
    <div v-else class="false">Нет</div>
  </div>
  <div v-else-if="mode === 'edit'">
    <p><input type="checkbox" :name="view.name" :id="view.name" v-on:change="update($event.target.checked)" :checked="view.value" :disabled="view.readonly" value="1"> <label :for="view.name">{{ view.title }}</label></p>
  </div>
  <div v-else-if="mode === 'link'">
    <div class="label checkbox"><i class="fa fa-check-square"></i><span>{{ view.title }}</span></div>
  </div>
  <div v-else-if="mode === 'edit'">
    <label>{{ view.title }}:</label><span :name="view.name" :label="view.title" class="error"></span><br>
    <input type="text" :name="view.name" v-model="view.value" :disabled="view.readonly" :placeholder="view.title">
  </div>
  <div v-else-if="mode === 'search'">
    <div class="label checkbox"><i class="fa fa-check-square"></i><span>{{ view.title }}</span></div>
    <div>
      <select>
        <option value="2">Не важно</option>
        <option value="1">Да</option>
        <option value="1">Нет</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'checkbox-property',
  props: ['className', 'mode', 'view', 'model'],
  data () {
    return {
      value: 2
    }
  },
  mounted () {
    this.update(this.view.value)
  },
  methods: {
    update (value) {
      this.$emit('update', {value: value})
    },
    switchValue () {
      this.value = this.value - 1

      if (this.value < 0) {
        this.value = 2
      }
    }
  }
}
</script>

<style scoped>
.false {
  color: #999;
}
</style>
