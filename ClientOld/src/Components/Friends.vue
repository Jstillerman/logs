<template lang="html">
  <div class="friends">
    <input v-model="user" type="text" name="" value="">
    <viewer :user='user'></viewer>
    <button type="button" name="button" @click="getPoints()"></button>
  </div>
</template>

<script>
import axios from 'axios'
import conf from '../config.json'
import Vue from 'vue'
import eventHub from '../EventHub'

import Viewer from './Viewer.vue'

export default {
  components: {Viewer},
  data () {
    return {
      user: this.getUser()
    }
  },
  watch: {
    user () {
      eventHub.$emit('refresh')
    }
  },
  methods: {
    getUser() {
      return Vue.prototype.$session.get('profile').name
    }
  }
}
</script>

<style lang="css">
</style>
