<template>
  <div>
    <div class="plugin"></div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  created () {
    $(document).attr('title', 'Moonlight')

    $.get('http://moonlight-radiant/moonlight/api/plugin', {}, function (html) {
      $('.plugin').html(html)
    })
  }
}
</script>

<style scoped>

</style>
