<template>
  <span>
    <input type="text" :name="name" v-model="selection" :placeholder="placeholder"
      @focus="change($event.target.value)"
      @blur="blur"
      @keydown.enter.prevent="enter"
      @keydown.down="down"
      @keydown.up="up"
      @keydown.esc="esc"
      @input="change($event.target.value)">
    <div class="dropdown-menu" v-show="open && matches.length">
      <div class="container">
        <ul>
          <li v-for="(suggestion, index) in matches" :class="{active: isActive(index)}" @mousedown="suggestionClick(index)">
            {{ suggestion.value }}
          </li>
        </ul>
      </div>
    </div>
  </span>
</template>

<script>
export default {
  name: 'autocomplete',
  props: ['name', 'value', 'item', 'placeholder'],
  watch: {
    value (to, from) {
      this.selection = to
      this.matches = []
    }
  },
  data () {
    return {
      selection: this.value,
      matches: [],
      open: false,
      current: 0
    }
  },
  methods: {
    change (value) {
      let params = [
        `item=${this.item}`,
        `query=${value}`
      ].join('&')

      let url = `/elements/autocomplete?${params}`

      this.$http.get(url).then((response) => {
        let data = response.body

        if (data.suggestions) {
          this.matches = data.suggestions
        }
      })

      if (this.open === false) {
        this.open = true
        this.current = 0
      }
    },
    esc () {
      this.open = false
    },
    blur () {
      this.open = false
    },
    enter () {
      let match = this.matches[this.current]

      if (match) {
        this.selection = match.value
        this.matches = []
        this.matches[0] = match
      }

      this.open = false

      this.$emit('update', match)
    },
    up () {
      if (this.current > 0) {
        this.current--
      }
    },
    down () {
      if (this.current < this.matches.length - 1) {
        this.current++
      }
    },
    suggestionClick (index) {
      let match = this.matches[index]

      if (match) {
        this.selection = match.value
        this.matches = []
        this.matches[0] = match
      }

      this.open = false

      this.$emit('update', match)
    },
    isActive (index) {
      return index === this.current
    }
  }
}
</script>

<style scoped>
.dropdown-menu {
  position: absolute;
  display: block;
  margin-top: 1px;
  padding: 0;
}

.dropdown-menu > .container {
  position: absolute;
  z-index: 102;
  width: 21rem;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.18), 0 2px 11px 0 rgba(0, 0, 0, 0.15);
  border: 1px solid #ccc;
  background-color: white;
  padding: 0;
}

.dropdown-menu ul {
  margin: 0;
  padding: 0;
}

.dropdown-menu ul > li {
  padding: 0.5rem 1rem;
  cursor: pointer;
  white-space: nowrap;
  color: black;
}

.dropdown-menu ul > li:hover {
  background-color: #eee;
}

.dropdown-menu ul > li.active {
  background-color: steelblue;
  color: white;
}
</style>
