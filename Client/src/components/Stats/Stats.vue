<template lang="html">
  <div class="stats">
    <q-card>
      Total # logs: {{totalLogs}}
      {{constraints}}
      <q-btn @click="addConstraint">Add Constraint</q-btn>
      <q-input v-model="cField" />
      <q-input v-model="cValue" />
    </q-card>
    <br>

    <q-card v-if="!getSettings().HideNSFW">
      <scatter-chart :data="scatterData" xtitle="Times Smoked" ytitle="Minutes Productivity"></scatter-chart>
    </q-card
    <q-card>
      <q-card-title>
        Daily Count Tracker
      </q-card-title>
      <q-card-main>
        <v-select v-model="dailyTracker" :options="Object.keys(stats.freq || {})"></v-select>
        <br>
        <q-checkbox v-model="durationMode" label="Duration Mode" style="padding-bottom: 10px;"/>
        <line-chart :data="getLineChartData()"></line-chart>
        Average: {{getLineChartAverage()}}
      </q-card-main>
    </q-card>
  </div>
</template>

<script>
import axios from 'axios'
import eventHub from 'src/EventHub.js'
import conf from 'src/config.json'
import vSelect from 'vue-select'
import mixins from 'src/mixins'
import {QBtn, QCard, QCardMain, QCardTitle, QCheckbox, QInput} from 'quasar'

import HotelDatePicker from 'vue-hotel-datepicker'

function sum (list) {
  var count = 0
  list.forEach(n => { count += n })
  return count
}
function average (list) {
  return sum(list)/list.length
}

export default {
  mixins: [mixins],
  components: {
    vSelect,
    HotelDatePicker,
    QCard,
    QCheckbox,
    QBtn,
    QInput,
    QCardMain,
    QCardTitle
  },
  data () {
    return {
      totalLogs: -1,
      stats: {},
      actionData: {},
      minimiumCount: 3,
      dailyTracker: 'ate',
      scatterData: [[174.0, 80.0], [176.5, 82.3]],
      actionKey: 'what',
      actionType: 'ate',
      dayData: [],
      durationMode: false,
      constraints: {},
      cField: '',
      cValue: ''
    }
  },
  watch: {
    actionType (val) {
      this.getOptions()
    }
  },
  methods: {
    refresh () {
      axios.get(conf.API_LOC + '/api/logs?user=' + this.getUser() + '&' + this.stringifyConstraints())
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
          this.dayData = page.data
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
    addConstraint () {
      this.constraints[this.cField] = this.cValue
      this.cField = this.cValue = ''
      this.refresh()
    },
    stringifyConstraints () {
      let result = ''
      Object.keys(this.constraints).forEach(key => { result += key + '=' + this.constraints[key] })
      return result
    },
    filter (s) {
      if (s) {
        let stats = JSON.parse(JSON.stringify(s))
        stats.other = 0
        Object.keys(stats).forEach(key => {
          if (stats[key] <= this.minimiumCount && key !== 'other') {
            delete stats[key]
            stats.other++
          }
        })
        if (stats.other === 0) delete stats.other
        return stats
      }
      else {
        return s
      }
    },
    useConstraints (stats) {
      return stats
    },
    getLineChartData () {
      let data = {}
      this.dayData.forEach(day => {
        if (!this.durationMode) data[day.date] = day.logs.filter(log => log.action === this.dailyTracker).length
        else data[day.date] = sum(day.logs.filter(log => log.action === this.dailyTracker).map(log => log.duration || 0))
      })
      return data
    },
    getLineChartAverage () {
      let d = this.getLineChartData()
      return average(Object.keys(d).map(key => d[key]))
    },
    logConstraint (evt, checkIn) {
      this.timeConstraints[checkIn ? 'start' : 'end'] = evt
    },
    getOptions () {
      axios.get(conf.API_LOC + '/api/logs/stats/' + this.actionType + '?user=' + this.getUser())
        .then(page => page.data)
        .then(data => { this.actionData = data })
      // .then(data => Object.keys(data))
    }
  },
  mounted () {
    eventHub.$on('refresh', () => {
      this.refresh()
    })

    this.refresh()
    this.getOptions()
  }
}
</script>



<style lang="css">

</style>
