<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <q-layout ref="layout" view="lHh Lpr fff" :left-class="{'bg-brown': true}">
      <q-toolbar color="brown" slot="header">
        <q-btn flat @click="$refs.layout.toggleLeft()">
          <q-icon color="amber-9" name="menu" />
        </q-btn>
        <q-toolbar-title>
          Lumberjack
        </q-toolbar-title>
        <div v-if="authenticated">Hi, {{getUser()}}</div>
        <q-btn v-else="!authenticated" @click="authenticate('google')">Login</q-btn>
        <q-btn color="amber-9" flat @click="$refs.layout.toggleRight()">
          <q-icon name="announcement" />
        </q-btn>
      </q-toolbar>
      <div slot="left">
        <q-list no-border link inset-delimiter>
          <!--q-list-header>Navigate</q-list-header-->
          <q-side-link item to='/entry'>
            <q-item-side icon="fa-pencil" />
            <q-item-main label="Forest"/>
          </q-side-link>
          <q-side-link item to='/timeline'>
            <q-item-side icon="fa-list" />
            <q-item-main label="Logs"/>
          </q-side-link>
          <q-side-link item to='/days'>
            <q-item-side icon="fa-sun-o" />
            <q-item-main label="Days"/>
          </q-side-link>
          <!--q-side-link item to='/calendar'>
            <q-item-side icon="fa-calendar" />
            <q-item-main label="Calendar"/>
          </q-side-link-->
          <q-side-link item to='/stats'>
            <q-item-side icon="fa-bar-chart" />
            <q-item-main label="Stats"/>
          </q-side-link>
          <q-side-link item to='/pies'>
            <q-item-side icon="fa-bar-chart" />
            <q-item-main label="Pies"/>
          </q-side-link>
          <q-side-link item to='/settings'>
            <q-item-side icon="fa-cog" />
            <q-item-main label="Settings"/>
          </q-side-link>
        </q-list>
      </div>
      <div slot="right">
        <q-list link inset-delimiter>
          <q-list-header>Notifications</q-list-header>
          <q-item v-for="notif in notifications" @click="goto(notif)">
            <p>{{notif.actor}} {{notif.action}} {{notif.content}} on your post.</p><p class="text-faded">{{formatDate(notif.when)}}</p>
          </q-item>
        </q-list>
      </div>
      <router-view :auth="auth" :authenticated="authenticated" />
    </q-layout>
  </div>
</template>
<script>
/*
* Root component
*/
import AuthService from './auth/AuthService'
import axios from 'axios'
import mixins from './mixins'
import conf from './config'
import {QBtn, QToolbar, QToolbarTitle, QLayout, QIcon, QList, QItem, QItemSide, QItemMain, QListHeader, QDatetime, QChipsInput, QInput, LocalStorage, QSideLink, QAutocomplete} from 'quasar'
const auth = new AuthService()

const { login, logout, authenticated } = auth

export default {
  mixins: [mixins],
  components: {QBtn, QToolbar, QLayout, QIcon, QList, QItem, QItemSide, QItemMain, QToolbarTitle, QListHeader, QDatetime, QChipsInput, QInput, LocalStorage, QSideLink, QAutocomplete},
  data () {
    this.refresh()
    return {
      notifications: [],
      auth,
      authenticated
    }
  },
  methods: {
    refresh () {
      console.log('app refreshing')
      axios.get(conf.API_LOC + '/api/notifications')
        .then(page => { this.notifications = page.data.filter(not => not.user === this.getUser()).reverse() })
    },
    goto (notif) {
      if (notif.log) {
        this.$refs.layout.toggleRight()
        this.$router.push('/timeline/' + notif.log)
      }
    },
    login,
    logout,
    authenticate (provider) {
      this.$auth.authenticate(provider).then(function () {
        console.log('Authenticated with', provider)
      })
    }
  }
}
</script>
<style></style>
