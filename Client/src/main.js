import Vue from 'vue'
import App from './App.vue'

import Chartkick from 'chartkick'
import VueChartkick from 'vue-chartkick'
import Chart from 'chart.js'

import 'vue-instant/dist/vue-instant.css'
import VueInstant from 'vue-instant'
Vue.use(VueInstant)

Vue.use(VueChartkick, { Chartkick })


new Vue({
  el: '#app',
  render: h => h(App)
})
