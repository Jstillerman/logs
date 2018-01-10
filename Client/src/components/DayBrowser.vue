<template>
  <div class="daybrowser">
    <q-card>
      <q-input style="padding: 10px;" type="number" v-model="dayAggrigationNum" float-label="# of Days"></q-input>
    </q-card>
    <q-card v-for="day in days">
      <q-card-title>{{day.date}}</q-card-title>
      <q-card-main>
        Total Logs: {{day.logs.length}}<br>
        Productivity: {{getHours(day.productivity.total)}}<br>
        Lumberjack Productivity: {{getHours(day.productivity.lumberjack)}}<br>
        Other Productivity: {{getHours(day.productivity.other)}}<br>
        Productivity Types: {{day.productivity.types}}<br>
        Things Eaten: {{day.stats.mealCount}}<br>
        <div v-if="!getSettings().HideNSFW">
          Times Smoked: {{day.stats.smokeCount}}
        </div>
      </q-card-main>
      <q-card-separator/>
      <q-card-actions>
        <q-btn flat>Jump</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
// import {TimeKnots} from '../timeknots.js'
import axios from 'axios'
import conf from '../config'
import mixins from '../mixins'
import {QCard, QInput, QCardTitle, QCardActions, QCardMain, QBtn, QCardSeparator} from 'quasar'
// import moment from 'moment'

function sum (list) {
  var count = 0
  list.forEach(num => { count += num })
  console.log('sum', list, count)
  return count
}

export default {
  mixins: [mixins],
  components: {QCard, QInput, QCardTitle, QCardActions, QCardMain, QBtn, QCardSeparator},
  data () {
    return {
      days: [],
      dayAggrigationNum: 1
    }
  },
  watch: {
    dayAggrigationNum () {
      this.refresh()
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    drawTimelines () {
      this.days.forEach(day => {
        // TimeKnots.draw('.a' + moment(day.date).format('x') , day.data, {color: 'teal', width: 700, showLabels: true, labelFormat: '%Y'})
      })
    },
    refresh () {
      axios.get(conf.API_LOC + '/api/daydata?user=' + this.getUser())
        .then(page => {
          this.days = page.data.map(day => {
            day.data = day.logs.map(log => {
              return {
                date: log.when,
                name: log.user + ' ' + log.action + ' ' + log.what
              }
            })

            day.productivity = {}
            day.productivity.total = sum(day.logs.map(log => {
              if (log.duration) return log.duration
              return 0
            }))
            day.productivity.lumberjack = sum(day.logs.filter(log => (log.what || '').toLowerCase() === 'lumberjack' && log.action === 'worked on')
              .map(log => {
                if (log.duration) return log.duration
                return 0
              }))
            day.stats = {}
            day.stats.mealCount = day.logs.filter(log => log.action === 'ate').length
            day.stats.smokeCount = day.logs.filter(log => log.action === 'smoked').length

            day.productivity.other = day.productivity.total - day.productivity.lumberjack
            day.productivity.types = day.logs.filter(log => log.action === 'worked on').map(log => log.what)

            return day
          }).reverse()
        })
        .then(this.drawTimelines)
    }
  }
}
</script>

<style>
.singleday {
  background-color: #f0f0f0;
  border-radius: 20px;
  margin: 20px;
  padding: 20px;
}

</style>
