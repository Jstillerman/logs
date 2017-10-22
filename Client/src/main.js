import Vue from 'vue'
import App from './App.vue'

import Chartkick from 'chartkick'
import VueChartkick from 'vue-chartkick'
import Chart from 'chart.js'
import VueRouter from 'vue-router'
import {router} from './router'

import 'vue-instant/dist/vue-instant.css'
import VueInstant from 'vue-instant'
Vue.use(VueInstant)

Vue.use(VueChartkick, { Chartkick })

Vue.use(VueRouter)

new Vue({
  router,
  el: '#app',
  render: h => h(App)
})
