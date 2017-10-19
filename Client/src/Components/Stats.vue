<template lang="html">
  <div class="stats">
    Total # logs: {{totalLogs}}
    <br>
    # times opening computer: {{computerOpens}}
    <br>
    <bar-chart :data="stats.freq"></bar-chart>
    <timeline :data="stats.timeline"></timeline>
  </div>
</template>

<script>
import axios from 'axios'
import eventHub from '../EventHub.js'
import timeline from './visTimeline.vue'
import conf from '../config.json'

export default {
  components: {
    timeline
  },
  data () {
    return {
      computerOpens: -1,
      totalLogs: -1,
      stats: {}
    }
  },
  methods: {
    refresh () {
      axios.get(conf.API_LOC + '/api/logs?action=opened%20my')
      .then(opens => opens.data.length)
      .then(len => this.computerOpens = len)

      axios.get(conf.API_LOC + '/api/logs')
      .then(logs => logs.data.length)
      .then(len => this.totalLogs = len)

      axios.get(conf.API_LOC + '/api/logs/stats')
      .then(page => page.data)
      .then(data => {
        let results = []
        Object.keys(data.timeline).forEach(key => {
          results.push({name: key, data: data.timeline[key]})
        })
        data.timeline = results
        return data
      })
      .then(s => this.stats = s)
    }
  },
  mounted () {
    eventHub.$on('refresh', () => {
      this.refresh()
    })

    this.refresh()
  }
}
</script>



<style lang="css">

</style>
