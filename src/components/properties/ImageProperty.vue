<template>
  <div v-if="mode === 'browse'">
    <div v-if="view.exists"><img :src="view.src" :width="view.width < 150 ? view.width : 150" /></div>
  </div>
  <div v-else-if="mode === 'edit'">
    <label>{{ view.title }}:</label><span :name="view.name" :label="view.title" class="error"></span><br>
    <div v-if="view.exists"><img :src="view.src" /></div>
    <div v-if="view.maxFilesize"><small class="red">Максимальный размер файла {{ view.maxFilesize }} Кб</small></div>
    <div v-if="view.maxWidth && view.maxWidth"><small class="red">Минимальный размер изображения {{ view.maxWidth }}&#215;{{ view.maxWidth }} пикселей</small></div>
    <div><small class="red">Допустимые форматы файла: GIF, JPG, PNG</small></div>
    <div class="loadfile">
      <div class="file" :name="view.name" v-on:click="selectFile()">Выберите файл</div>
      <span class="reset" :name="view.name" file v-on:click="resetFile()">&#215;</span>
      <div class="file-hidden"><input type="file" :name="view.name" v-on:change="changeFile($event)"></div>
    </div>
    <p v-if="view.exists"><input type="checkbox" :name="view.name + '_drop'" :id="view.name + '_drop'" v-on:change="update($event.target.checked)" v-model="drop" value="1"><label :for="view.name + '_drop'">Удалить</label></p>
  </div>
</template>

<script>
export default {
  name: 'image-property',
  props: ['className', 'mode', 'view'],
  data () {
    return {
      drop: false
    }
  },
  watch: {
    view (to, from) {
      this.resetFile()

      this.drop = false
    }
  },
  methods: {
    update (value) {
      this.resetFile()

      this.$emit('update', {drop: value})
    },
    selectFile () {
      let name = this.view.name
      let fileInput = $(':file[name="' + name + '"]')

      fileInput.click()
    },
    changeFile (event) {
      let name = this.view.name
      let path = event.target.files[0] ? event.target.files[0].name : 'Выберите файл'
      let value = event.target.files[0]

      $('.file[name="' + name + '"]').html(path)

      this.drop = false

      this.$emit('update', {value: value})
    },
    resetFile () {
      let name = this.view.name

      $('.file[name="' + name + '"]').html('Выберите файл')
      $(':file[name="' + name + '"]').val('')

      this.$emit('update', null)
    }
  }
}
</script>

<style scoped>
img {
  margin: 0;
  border: 1px solid #999;
  border-radius: 2px;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.18), 0 2px 11px 0 rgba(0, 0, 0, 0.15);
  padding: 0.5rem;
  background-color: white;
}
</style>
