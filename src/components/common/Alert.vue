<template>
  <div :id="id" class="alert" @click="cancel()">
    <div class="container" @click="stop($event)">
      <div @click="cancel()" class="hide">&#215;</div>
        <div class="content">
          <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'alert',
  props: ['id'],
  data () {
    return { }
  },
  methods: {
    stop (event) {
      event.stopPropagation()
      event.preventDefault()
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>
.alert {
    position: fixed;
    z-index: 1100;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.2);
    text-align: center;
}

.alert .container {
    position: relative;
    display: table;
    z-index: 1110;
    top: 5rem;
    margin: auto;
    padding: 1rem 1.5rem;
    background-color: white;
    box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15);
    border: none;
}

.alert .content {
    min-width: 20rem;
    text-align: left;
    padding: 1rem 2rem 1rem 0;
    font-size: 1.2rem;
}

.alert .hide {
    position: absolute;
    top: 0;
    right: 1rem;
    cursor: pointer;
    font-size: 2rem;
    color: #ccc;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>
