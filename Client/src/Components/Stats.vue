<template lang="html">
  <div class="stats">
    Total # logs: {{totalLogs}}
    <br>
    # times opening computer: {{computerOpens}}
    <br>
    <bar-chart :data="stats.freq"></bar-chart>
    <line-chart :data="stats.timeline"></line-chart>
  </div>
</template>

<script>
import axios from 'axios'
import eventHub from '../EventHub.js'

export default {
  data () {
    return {
      computerOpens: -1,
      totalLogs: -1,
      stats: {}
    }
  },
  methods: {
    refresh () {
      axios.get('http://localhost:8080/api/logs?action=opened%20my')
      .then(opens => opens.data.length)
      .then(len => this.computerOpens = len)

      axios.get('http://localhost:8080/api/logs')
      .then(logs => logs.data.length)
      .then(len => this.totalLogs = len)

      axios.get('http://localhost:8080/api/logs/stats')
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
