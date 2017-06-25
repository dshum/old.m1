<template>
  <div></div>
</template>

<script>
export default {
  name: 'search',
  data () {
    return { }
  },
  created () {
    $(document).attr('title', 'Поиск')

    this.$http.get('/search/items/first').then((response) => {
      let data = response.body

      if (data.item) {
        this.$router.push({
          name: 'searchItem',
          params: {item: data.item.id}
        })
      }
    })
  }
}
</script>
