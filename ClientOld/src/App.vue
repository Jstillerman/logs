<template lang="html">
  <div id="app">
    <button
        class="btn btn-primary btn-margin"
        v-if="!authenticated"
        @click="login()">
          Log In
      </button>

      <button
        class="btn btn-primary btn-margin"
        v-if="authenticated"
        @click="logout()">
          Log Out
      </button>
    <div>
      <nav-bar></nav-bar>
      <transition name="fade">
        <router-view :auth='auth' :authenticated='authenticated'></router-view>
      </transition>
    </div>
  </div>

</template>

<script>
import navBar from './Components/NavBar.vue'

import axios from 'axios'
import moment from 'moment'
import eventHub from './EventHub.js'
import conf from './config.json'
import AuthService from './auth/AuthService'

const auth = new AuthService()

const { login, logout, authenticated, authNotifier } = auth



export default {
  name: 'app',
  user: 10,
  data () {
    authNotifier.on('authChange', (authState, idTokenPayload) => {
      console.log('AUTH CHANGE', authState, idTokenPayload);
      this.authenticated = authState.authenticated
      this.user = idTokenPayload
    })
    return {
      points: [],
      auth,
      authenticated
    }
  },
  mounted () {
    this.refreshPoints()
    eventHub.$on('refresh', () => {
      this.refreshPoints()
    })

  },
  methods: {
    refreshPoints () {
      console.log('refresh called');
      axios.get(conf.API_LOC+'/api/logs/')
        .then(resp => resp.data)
        .then(logs => logs.map(log => {
              if(!log.pointColor)log.pointColor = 'red'
              if(!log.img)log.img = 'http://www.jikexueyuan.com/event/static/images/bootstrap/bootstrap-logo.png'
              if(!log.title)log.title = "I " + log.action + " " + log.what
              if(!log.text)log.text = JSON.stringify(log)
              log.linkUrl =  log.ongoing ? conf.API_LOC + '/api/logs/'+log._id+'/end' : (log.duration ? 'javascript:void(0)': null),
              log.linkText = log.ongoing ? 'End' : (log.duration ? log.duration + ' minutes' : null)
              return log
          }))
        .then(points => points.reverse())
        .then(points => this.points = points)
    },
    login,
    logout
  },
  components: {navBar},
}
</script>

<style lang="css">
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 80px;
}

h2 {
  font-weight: normal;
}

.fade-enter-active, .fade-leave-active {
  transition-property: opacity;
  transition-duration: .25s;
}

.fade-enter-active {
  transition-delay: .25s;
}

.fade-enter, .fade-leave-active {
  opacity: 0
}


</style>
