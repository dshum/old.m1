import Vue from 'vue'
import moment from 'moment'

Vue.filter('date', function (value, format) {
  if (value) {
    return moment(String(value)).format(format)
  }
})

Vue.filter('nl2br', function (value) {
  return value ? value.replace(/\n/g, '<br />') : ''
})

Vue.filter('selectCaseForNumber', function (value, cases) {
  if ((value % 10) === 1 && (value % 100) !== 11) {
    return cases[0]
  } else if ((value % 10) > 1 && (value % 10) < 5 && (value % 100 < 10 || value % 100 > 20)) {
    return cases[1]
  }

  return cases[2]
})
