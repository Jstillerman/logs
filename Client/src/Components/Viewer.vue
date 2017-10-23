<template lang="html">
  <time-line :points="logs"></time-line>
</template>

<script>
import timeLine from './timeLine.vue'
import eventHub from '../EventHub.js'
import axios from 'axios'
import conf from '../config.json'

export default {
  components: {timeLine},
  data () {
    return {
      logs: []
    }
  },
  mounted () {
    eventHub.$on('reload', () => {
      this.reload()
    })

    this.reload()
  },
  methods: {
    reload () {
      axios.get(conf.API_LOC + '/api/logs/')
        .then(page => page.data)
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
        .then(points => this.logs = points)
    }
  }
}
</script>

<style lang="css">
</style>
