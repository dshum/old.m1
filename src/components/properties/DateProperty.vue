<template>
  <div v-if="mode === 'browse'">
    <div class="date">{{ view.value | date('DD.MM.YYYY') }}</div>
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
      <datepicker :name="view.name" v-on:input="setDate(arguments[0])" :value="value" v-bind:monday-first="true" format="dd.MM.yyyy" input-class="date" language="ru"></datepicker>
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
  name: 'date-property',
  components: { Datepicker },
  props: ['className', 'mode', 'view', 'model'],
  data () {
    return {
      value: null
    }
  },
  computed: {
    date () {
      return this.view.value ? moment(this.view.value).format('YYYY-MM-DD') : null
    }
  },
  mounted () {
    this.value = this.date

    this.$emit('update', {value: this.value})
  },
  methods: {
    setDate (value) {
      this.value = value ? moment(value).format('YYYY-MM-DD') : null
      this.$emit('update', {value: this.value})
    }
  }
}
</script>

<style>
input[type="text"].date {
  width: 5rem;
  border-color: #999;
}
</style>
