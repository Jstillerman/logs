<template lang="html">
  <div class="stats">
    <HotelDatePicker @checkInChanged="logConstraint($event, true)" @checkOutChanged="logConstraint($event, false)"></HotelDatePicker>
<br>
    <p>{{JSON.stringify(timeConstraints)}}</p>
    Total # logs: {{totalLogs}}
    <br>
    <h3>{{actionKey + " I " + actionType}}</h3>
    <v-select @click="getOptions(actionType)" v-model="actionType" :options="Object.keys(stats.freq || {})"></v-select>
    <v-select v-model="actionKey" :options="actionData.attrs"></v-select>
    <pie-chart :data="actionData[actionKey]"></pie-chart>
  </div>
</template>

<script>
import axios from 'axios'
import eventHub from '../EventHub.js'
import conf from '../config.json'
import vSelect from 'vue-select'

import HotelDatePicker from 'vue-hotel-datepicker'

export default {
  components: {
    vSelect,
    HotelDatePicker
  },
  data () {
    return {
      totalLogs: -1,
      enableTimelineLimits: false,
      timelineLimitation: '',
      stats: {},
      actionData: {},
      actionKey: 'what',
      actionType: 'ate',
      timeConstraints: {
      },
      // google charts
      columns: [{
        'type': 'string',
        'label': 'Year'
      }, {
        'type': 'number',
        'label': 'Sales'
      }, {
        'type': 'number',
        'label': 'Expenses'
      }],
      rows: [
        ['2004', 1000, 400],
        ['2005', 1170, 460],
        ['2006', 660, 1120],
        ['2007', 1030, 540]
      ]
    }
  },
  watch: {
    actionType (val) {
      this.getOptions()
    }
  },
  methods: {
    refresh () {
      axios.get(conf.API_LOC + '/api/logs')
        .then(logs => logs.data.length)
        .then(len => { this.totalLogs = len })

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
        .then(s => { this.stats = s })
    },
    logConstraint (evt, checkIn) {
      this.timeConstraints[checkIn ? 'start' : 'end'] = evt
    },
    getOptions (action) {
      axios.get(conf.API_LOC + '/api/logs/stats/' + this.actionType)
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
