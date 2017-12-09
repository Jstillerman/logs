<template lang="html">
  <div class="stats">
    Total # logs: {{totalLogs}}
    <br>
    <h3>{{actionKey + " I " + actionType}}</h3>
    <v-select @click="getOptions(actionType)" v-model="actionType" :options="Object.keys(stats.freq || {})"></v-select>
    <v-select v-model="actionKey" :options="actionData.attrs"></v-select>
    <pie-chart :data="actionData[actionKey]"></pie-chart>
    <scatter-chart :data="scatterData" xtitle="Size" ytitle="Population"></scatter-chart>
  </div>
</template>

<script>
import axios from 'axios'
import eventHub from '../EventHub.js'
import conf from '../config.json'
import vSelect from 'vue-select'
import mixins from '../mixins'

import HotelDatePicker from 'vue-hotel-datepicker'

function sum (list) {
  var count = 0
  list.forEach(n => { count += n })
  return count
}

export default {
  mixins: [mixins],
  components: {
    vSelect,
    HotelDatePicker
  },
  data () {
    return {
      totalLogs: -1,
      stats: {},
      actionData: {},
      scatterData: [[174.0, 80.0], [176.5, 82.3]],
      actionKey: 'what',
      actionType: 'ate'
    }
  },
  watch: {
    actionType (val) {
      this.getOptions()
    }
  },
  methods: {
    refresh () {
      axios.get(conf.API_LOC + '/api/logs?user=' + this.getUser())
        .then(logs => logs.data.length)
        .then(len => { this.totalLogs = len })

      axios.get(conf.API_LOC + '/api/logs/stats?user=' + this.getUser())
        .then(page => page.data)
        .then(data => {
          let results = []
          Object.keys(data.timeline).forEach(key => {
            results.push({name: key, data: data.timeline[key]})
          })
          data.timeline = results
          return data
        })
        .then(s => { this.stats = s })

      axios.get(conf.API_LOC + '/api/daydata?user=' + this.getUser())
        .then(page => {
          console.log(page)
          var result = []
          page.data.forEach(day => {
            result.push([day.logs.filter(log => log.action === 'smoked').length, sum(day.logs.map(log => {
              if (log.duration) return log.duration
              return 0
            }))])
          })
          this.scatterData = result
        })
    },
    logConstraint (evt, checkIn) {
      this.timeConstraints[checkIn ? 'start' : 'end'] = evt
    },
    getOptions (action) {
      axios.get(conf.API_LOC + '/api/logs/stats/' + this.actionType + '?user=' + this.getUser())
        .then(page => page.data)
        .then('poopy', console.log)
        .then(data => { this.actionData = data })
      // .then(data => Object.keys(data))
    }
  },
  mounted () {
    eventHub.$on('refresh', () => {
      this.refresh()
    })

    this.refresh()
    this.getOptions(this.actionType)
  }
}
</script>



<style lang="css">

</style>
