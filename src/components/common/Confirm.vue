<template>
  <div :id="id" class="confirm">
    <div class="container">
      <div class="content">
        <slot></slot>
      </div>
      <div class="modal-buttons">
        <input type="button" :value="confirmButtonContent" @click="confirm()" :class="['btn', confirmButtonClass]">
        <input type="button" :value="cancelButtonContent" @click="cancel()" class="btn cancel">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'confirm',
  props: ['id', 'confirmButton', 'cancelButton', 'confirmButtonClass'],
  data () {
    return {
      confirmButtonContent: this.confirmButton,
      cancelButtonContent: this.cancelButton || 'Отмена'
    }
  },
  methods: {
    confirm () {
      this.$emit('confirm')
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>
.confirm {
  position: fixed;
  z-index: 1100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  text-align: center;
}

.confirm .container {
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

.confirm .content {
  min-width: 25rem;
  text-align: left;
  border-bottom: 1px solid #ccc;
  padding: 0.5rem 0 1rem 0;
  font-size: 1.2rem;
}

.confirm .content p {
  margin: 0;
  padding: 0 0 1rem 0;
}

.confirm .content div:last-child {
  padding-bottom: 0;
}

.confirm .modal-buttons {
  float: right;
  padding: 1rem 0 0.5rem 0;
  white-space: nowrap;
}

.confirm .btn {
  margin-left: 1rem;
  height: 2rem;
  line-height: 2rem;
  font-size: 0.8rem;
}

.confirm .btn.cancel {
  border: 1px solid #ccc;
  background-color: white;
  color: black;
}

.confirm .btn.remove {
  background-color: crimson;
  color: white;
}
</style>
