<template>
  <div>
    <div class="path">
      <router-link to="/groups">Группы</router-link>
      <span class="divider">/</span><router-link :to="{name: 'groupItems', params: {id: id, item: className}}">{{ group.name }}</router-link>
      <span class="divider">/</span><span>{{item.name}}</span>
    </div>
    <transition name="show">
      <div class="leaf" v-show="show">
        <div class="search-field">
          <input type="text" id="elementsFilter" placeholder="Введите название">
        </div>
        <table class="permissions elements">
          <thead>
            <tr>
              <th class="title">Название</th>
              <th>Закрыто</th>
              <th>Просмотр</th>
              <th>Изменение</th>
              <th>Удаление</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="element in elements">
              <td class="title">{{ element.name }}<br><small>{{ element.classId }}</small></td>
              <td class="deny" :class="{active: permissions[element.classId] == 'deny'}" @click="setPermission(element, 'deny')"><span></span></td>
              <td class="view" :class="{active: permissions[element.classId] == 'view'}" @click="setPermission(element, 'view')"><span></span></td>
              <td class="update" :class="{active: permissions[element.classId] == 'update'}" @click="setPermission(element, 'update')"><span></span></td>
              <td class="delete" :class="{active: permissions[element.classId] == 'delete'}" @click="setPermission(element, 'delete')"><span></span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </transition>
    <transition name="fade">
      <div class="empty" v-show="empty">Элементов не найдено.</div>
    </transition>
    <transition name="fade">
      <spinner v-show="loading" message="Минутку..."></spinner>
    </transition>
    <transition name="fade">
      <alert v-show="alert" v-on:cancel="alert = false">
        {{ errorMessage }}
      </alert>
    </transition>
  </div>
</template>

<script>
import Spinner from '@/components/common/Spinner'
import Alert from '@/components/common/Alert'

export default {
  name: 'groupElements',
  components: { Spinner, Alert },
  data () {
    return {
      show: false,
      empty: false,
      loading: false,
      alert: false,
      id: null,
      className: null,
      group: {},
      item: {},
      elements: [],
      permissions: [],
      errorMessage: null
    }
  },
  created () {
    $(document).attr('title', 'Доступ к элементам')

    $.expr[':'].contains = function (a, i, m) {
      return $(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0
    }

    this.id = this.$route.params.id
    this.className = this.$route.params.item

    this.$http.get('/groups/' + this.id).then((response) => {
      if (response.body.state === 'error_admin_access_denied') {
        this.$router.push('/')
      } else if (response.body.state === 'error_group_not_found') {
        this.$router.push('/groups')
      } else if (response.body.state === 'error_group_access_denied') {
        this.$router.push('/groups')
      }

      if (response.body.group) {
        this.group = response.body.group

        this.$http.get('/groups/permissions/elements/' + this.id + '/' + this.className).then((response) => {
          let data = response.body

          if (data.item && data.elements && data.permissions) {
            this.item = data.item
            this.elements = data.elements
            this.permissions = data.permissions

            if (this.elements.length) {
              this.show = true
              this.empty = false
            } else {
              this.show = false
              this.empty = true
            }
          } else {
            this.$router.push('/groups')
          }
        })
      }
    }).catch(() => {
      this.$router.push('/groups')
    })
  },
  mounted () {
    $('#elementsFilter').keyup(function () {
      let str = $(this).val()

      if (str.length > 0) {
        $('table.permissions.elements tbody tr:not(:contains("' + str + '"))').hide()
        $('table.permissions.elements tbody tr:contains("' + str + '")').show()

        if ($('table.permissions.elements tbody tr:contains("' + str + '")').length > 0) {
          $('table.permissions.elements').fadeIn(200)
        } else {
          $('table.permissions.elements').fadeOut(200)
        }
      } else {
        $('table.permissions.elements').fadeIn(200)
        $('table.permissions.elements tbody tr').show()
      }
    }).change(function () {
      let str = $(this).val()

      if (str.length > 0) {
        $('table.permissions.elements tbody tr:not(:contains("' + str + '"))').hide()
        $('table.permissions.elements tbody tr:contains("' + str + '")').show()

        if ($('table.permissions.elements tbody tr:contains("' + str + '")').length > 0) {
          $('table.permissions.elements').fadeIn(200)
        } else {
          $('table.permissions.elements').fadeOut(200)
        }
      } else {
        $('table.permissions.elements').fadeIn(200)
        $('table.permissions.elements tbody tr').show()
      }
    })
  },
  methods: {
    setPermission (element, permission) {
      if (this.permissions[element.classId] === permission) {
        return false
      }

      this.permissions[element.classId] = permission

      this.alert = false
      this.loading = true

      this.$http.post('/groups/permissions/elements/' + this.id, {
        element: element.classId,
        permission: permission
      }).then((response) => {
        let data = response.body

        if (data.error) {
          this.errorMessage = data.error
          this.alert = true
        }

        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
div.search-field {
  margin: 1rem 0;
}

.empty {
  margin: 2rem 0;
}

table.permissions.elements {
  width: auto;
}

table.permissions.elements tr {
  vertical-align: bottom;
}

table.permissions.elements th.title,
table.permissions.elements td.title {
  width: 25rem;
  text-align: left;
  vertical-align: top;
}

table.permissions.elements th,
table.permissions.elements td {
  width: 5rem;
  text-align: center;
}

table.permissions.elements td span {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 1px solid #ccc;
  border-radius: 50%;
  background-color: #fff;
  transition: .5s ease-out;
  cursor: pointer;
}

table.permissions.elements td.deny.active span {
  background-color: darkorchid;
  border-color: darkorchid;
}

table.permissions.elements td.view.active span {
  background-color: #64a7a0;
  border-color: #64a7a0;
}

table.permissions.elements td.update.active span {
  background-color: goldenrod;
  border-color: goldenrod;
}

table.permissions.elements td.delete.active span {
  background-color: crimson;
  border-color: crimson;
}
</style>
