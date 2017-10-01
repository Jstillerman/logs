<template lang="html">
  <div id="app">
    <quick-entry></quick-entry>
    <stats></stats>
    <timeline :points="points"></timeline>
  </div>

</template>

<script>
import quickEntry from './Components/QuickEntry.vue'
import timeline from './Components/timeLine.vue'
import stats from './Components/Stats.vue'
import axios from 'axios'
import moment from 'moment'
import eventHub from './EventHub.js'

export default {
  name: 'app',
  data () {
    return {
      points: []
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
      axios.get('http://localhost:8080/api/logs/')
        .then(resp => resp.data)
        .then(logs => logs.map(log => {
              if(!log.pointColor)log.pointColor = 'red'
              if(!log.img)log.img = 'http://www.jikexueyuan.com/event/static/images/bootstrap/bootstrap-logo.png'
              if(!log.title)log.title = "I " + log.action + " " + log.what
              if(!log.text)log.text = JSON.stringify(log)
              log.linkUrl =  log.ongoing ? 'http://localhost:8080/api/logs/'+log._id+'/end' : (log.duration ? 'javascript:void(0)': null),
              log.linkText = log.ongoing ? 'End' : (log.duration ? log.duration + ' minutes' : null)
              return log
          }))
        .then(points => points.reverse())
        .then(points => this.points = points)
    }
  },
  components: {quickEntry, timeline, stats},
}
</script>

<style lang="css">

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h2 {
  font-weight: normal;
}

</style>
