<template>
  <div>
    <div class="path">
      Параметры пользователя <b>{{ user.login }}</b>
    </div>
    <transition name="show">
      <div class="leaf" v-if="show">
        <div v-for="(parameter, key) in user.parameters">
          <h2>{{ key }}</h2>
          <div v-for="(parameter2, key2) in parameter">
            <b>{{ key2 }}</b><br>
            <div class="padding" v-for="(parameter3, key3) in parameter2">
              {{ key3 }}: <span class="blue">{{ parameter3 }}</span><br>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <spinner v-show="loading" message="Минутку..."></spinner>
    </transition>
  </div>
</template>

<script>
import Spinner from '@/components/common/Spinner'

export default {
  name: 'parameters',
  components: { Spinner },
  data () {
    return {
      show: false,
      loading: false,
      user: {}
    }
  },
  created () {
    var self = this

    $(document).attr('title', 'Параметры')

    $(document)
      .on('keypress', function (event) {
        return self.$hotkeys.onCtrlS(event, function () {
          self.submit()
        })
      })
      .on('keydown', function (event) {
        return self.$hotkeys.onCtrlS(event, function () {
          self.submit()
        })
      })

    this.$http.get('/parameters').then((response) => {
      if (response.body.user) {
        this.user = response.body.user
      }

      this.show = true
    })
  },
  methods: {

  }
}
</script>

<style scoped>
.leaf > div {
  margin-bottom: 1rem;
}

h2 {
  color: darkgreen;
}

.padding {
  margin-left: 2rem;
}

.blue {
  color: blue;
  font-weight: bold;
}
</style>
