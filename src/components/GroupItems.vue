<template>
  <div>
    <div class="path">
      <router-link to="/groups">Группы</router-link><span class="divider">/</span><span>{{group.name}}</span>
    </div>
    <transition name="show">
      <div class="leaf" v-show="show">
        <div class="search-field">
          <input type="text" id="itemsFilter" placeholder="Введите название">
        </div>
        <table class="permissions elements">
          <thead>
            <tr>
              <th class="title">Класс элемента</th>
              <th>Закрыто</th>
              <th>Просмотр</th>
              <th>Изменение</th>
              <th>Удаление</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items">
              <td class="title" v-if="item.permissions"><router-link :to="{name: 'groupElements', params: {id: group.id, item: item.id}}">{{ item.name }}</router-link><br><small>{{ item.id }}</small></td>
              <td class="title" v-if=" ! item.permissions">{{ item.name }}<br><small>{{ item.id }}</small></td>
              <td class="deny" :class="{active: permissions[item.id] == 'deny'}" @click="setPermission(item, 'deny')"><span></span></td>
              <td class="view" :class="{active: permissions[item.id] == 'view'}" @click="setPermission(item, 'view')"><span></span></td>
              <td class="update" :class="{active: permissions[item.id] == 'update'}" @click="setPermission(item, 'update')"><span></span></td>
              <td class="delete" :class="{active: permissions[item.id] == 'delete'}" @click="setPermission(item, 'delete')"><span></span></td>
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
  name: 'groupItems',
  components: { Spinner, Alert },
  data () {
    return {
      show: false,
      empty: false,
      loading: false,
      alert: false,
      id: null,
      group: {},
      items: [],
      permissions: [],
      errorMessage: null
    }
  },
  created () {
    $(document).attr('title', 'Доступ по умолчанию')

    $.expr[':'].contains = function (a, i, m) {
      return $(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0
    }

    this.id = this.$route.params.id

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

        this.$http.get('/groups/permissions/items/' + this.id).then((response) => {
          let data = response.body

          if (data.items && data.permissions) {
            this.items = data.items
            this.permissions = data.permissions

            if (this.items.length) {
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
    $('#itemsFilter').keyup(function () {
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
    setPermission (item, permission) {
      if (this.permissions[item.id] === permission) {
        return false
      }

      this.permissions[item.id] = permission

      this.alert = false
      this.loading = true

      this.$http.post('/groups/permissions/items/' + this.id, {
        item: item.id,
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
