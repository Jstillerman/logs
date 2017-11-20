<template lang="html">
  <div class="viewer">
    <person-picker v-model="user"></person-picker>
    <time-line :points="logs"></time-line>
  </div>
</template>

<script>
import timeLine from './timeLine.vue'
import personPicker from './PersonPicker.vue'
import eventHub from '../EventHub.js'
import axios from 'axios'
import conf from '../config.json'
import moment from 'moment'
import Vue from 'vue'

export default {
  components: {timeLine, personPicker},
  data () {
    return {
      logs: [],
      user: 'Jason Stillerman'//Vue.prototype.$session.get('profile').name
    }
  },
  watch: {
    user () {
      this.reload()
    }
  },
  mounted () {
    eventHub.$on('refresh', () => {
      this.reload()
    })

    this.reload()
  },
  methods: {
    reload () {
      console.log('reloading viewer');
      axios.get(conf.API_LOC + '/api/logs/' + (this.user==='any' ? '' : '?user='+this.user))
        .then(page => page.data)
        .then(logs => logs.map(log => {
              if(!log.pointColor)log.pointColor = 'red'
              if(!log.img)log.img = 'http://www.jikexueyuan.com/event/static/images/bootstrap/bootstrap-logo.png'
              if(!log.title)log.title = log.user + " " + log.action + " " + log.what
              if(!log.text)log.text = JSON.stringify(log)
              log.linkUrl =  log.ongoing ? conf.API_LOC + '/api/logs/'+log._id+'/end' : (log.duration ? 'javascript:void(0)': null),
              log.linkText = log.ongoing ? 'End' : (log.duration ? log.duration + ' minutes' : null)
              return log
          }))
        .then(points => {
          return points.sort((a, b) => {
            if(moment(a.when).isBefore(b.when)) return -1
            if(moment(a.when).isAfter(b.when)) return 1
            if(moment(a.then).isSame(b.when)) return 0
          })})
        .then(points => points.reverse())
        .then(points => this.logs = points)
    }
  }
}
</script>

<style lang="css">
</style>
