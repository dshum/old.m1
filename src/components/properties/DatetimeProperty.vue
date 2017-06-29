<template>
  <div v-if="mode === 'browse'">
    <div class="date">{{ view.value | date('DD.MM.YYYY') }}</div>
    <div class="time">{{ view.value | date('HH:mm:ss') }}</div>
  </div>
  <div v-else-if="mode === 'edit'">
    <div v-if="view.readonly && view.value">
      <label>{{ view.title }}:</label> {{ view.value | date('DD.MM.YYYY') }}, {{ view.value | date('HH:mm:ss') }}
    </div>
    <div v-else-if="view.readonly && ! view.value">
      <label>{{ view.title }}:</label> Не определено
    </div>
    <div v-else>
      <label>{{ view.title }}:</label><span :name="view.name" :label="view.title" class="error"></span><br>
      <datepicker :name="view.name" v-on:input="setDate(arguments[0])" :value="value.date" v-bind:monday-first="true" format="dd.MM.yyyy" input-class="date" language="ru"></datepicker> &nbsp;
      <input type="text" name="hours" v-on:input="setHours($event.target.value)" :value="value.hours" class="time"> :
      <input type="text" name="minutes" v-on:input="setMinutes($event.target.value)" :value="value.minutes" class="time"> :
      <input type="text" name="seconds" v-on:input="setSeconds($event.target.value)" :value="value.seconds" class="time">
    </div>
  </div>
  <div v-else-if="mode === 'link'">
    <div class="label date"><i class="fa fa-calendar"></i><span>{{ view.title }}</span></div>
  </div>
  <div v-else-if="mode === 'search'">
    <div class="label date"><i class="fa fa-calendar"></i><span>{{ view.title }}</span></div>
    <div>
      <datepicker v-bind:monday-first="true" format="dd.MM.yyyy" input-class="date" language="ru" :value="view.value" placeholder="От"></datepicker> &mdash;
      <datepicker v-bind:monday-first="true" format="dd.MM.yyyy" input-class="date" language="ru" :value="view.value" placeholder="До"></datepicker>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'datetime-property',
  components: { Datepicker },
  props: ['className', 'mode', 'view', 'model'],
  data () {
    return {
      value: {}
    }
  },
  computed: {
    date () {
      return this.view.value ? moment(this.view.value).format('YYYY-MM-DD') : null
    },
    hours () {
      return this.view.value ? moment(this.view.value).format('HH') : null
    },
    minutes () {
      return this.view.value ? moment(this.view.value).format('mm') : null
    },
    seconds () {
      return this.view.value ? moment(this.view.value).format('ss') : null
    }
  },
  mounted () {
    this.value = {
      date: this.date,
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds
    }

    this.$emit('update', this.value)
  },
  methods: {
    setDate (value) {
      this.value.date = value ? moment(value).format('YYYY-MM-DD') : null
      this.$emit('update', this.value)
    },
    setHours (value) {
      this.value.hours = value
      this.$emit('update', this.value)
    },
    setMinutes (value) {
      this.value.minutes = value
      this.$emit('update', this.value)
    },
    setSeconds (value) {
      this.value.seconds = value
      this.$emit('update', this.value)
    }
  }
}
</script>

<style>
input[type="text"].date {
  width: 5rem;
  border-color: #666;
}

.time {
  font-size: 0.8rem;
  color: #666;
}
</style>
