<template>
  <textarea :name="name"></textarea>
</template>

<script>
export default {
  name: 'summernote',
  props: {
    model: {
      required: true
    },
    name: {
      type: String,
      required: true
    },
    height: {
      type: String,
      default: '150'
    }
  },
  mounted () {
    let config = {
      height: this.height
    }

    let vm = this

    config.callbacks = {
      onInit () {
        $(vm.$el).summernote('code', vm.model)
      },
      onChange () {
        vm.$emit('change', $(vm.$el).summernote('code'))
      },
      onBlur () {
        vm.$emit('change', $(vm.$el).summernote('code'))
      }
    }

    $(document).ready(() => {
      $(vm.$el).summernote(config)
    })
  }
}
</script>

<style scoped>

</style>
