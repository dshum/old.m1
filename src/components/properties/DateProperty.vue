<template>
  <div v-if="mode === 'browse'">
    <div class="date">{{ view.value | date('DD.MM.YYYY') }}</div>
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
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'date-property',
  components: { Datepicker },
  props: ['className', 'mode', 'view', 'model']
}
</script>

<style>
input[type="text"].date {
  width: 5rem;
  border-color: #999;
}
</style>
