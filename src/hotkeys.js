export default {
  install (Vue, options) {
    Vue.prototype.$hotkeys = Vue.hotkeys = this
  },
  onCtrlS (event, handle) {
    var code = event.keyCode || event.which

    if (code === 83 && event.ctrlKey === true) {
      handle()
      return false
    }

    return true
  }
}
