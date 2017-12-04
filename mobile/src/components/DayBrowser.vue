<template>
  <div class="daybrowser">
    <div v-for='day in days' class="singleday">
      <h3>{{day.date}}</h3>
      Total Logs: {{day.logs.length}}<br>
      Productivity: {{getHours(day.productivity.total)}}<br>
      Logs Productivity: {{getHours(day.productivity.logs)}}<br>
      Other Productivity: {{getHours(day.productivity.other)}}<br>
      Productivity Types: {{day.productivity.types}}<br>
      Things Eaten: {{day.stats.mealCount}}<br>
      Times Smoked: {{day.stats.smokeCount}}
    </div>
  </div>
</template>

<script>
// import {TimeKnots} from '../timeknots.js'
import axios from 'axios'
import conf from '../config'
// import moment from 'moment'

function sum (list) {
  var count = 0
  list.forEach(num => { count += num })
  console.log('sum', list, count)
  return count
}

export default {
  data () {
    return {
      days: []
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
    getHours (mins) {
      return Math.floor(mins / 60) + ' hours ' + mins % 60 + ' mins'
    },
    refresh () {
      axios.get(conf.API_LOC + '/api/daydata/')
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

            day.productivity.logs = sum(day.logs.filter(log => log.what.toLowerCase() == 'logs' && log.action == 'worked on')
            .map(log => {
              if (log.duration) return log.duration
              return 0
            }))

            day.stats = {}
            day.stats.mealCount = day.logs.filter(log => log.action === "ate").length
            day.stats.smokeCount = day.logs.filter(log => log.action === "smoked").length

            day.productivity.other = day.productivity.total - day.productivity.logs
            day.productivity.types = day.logs.filter(log => log.action === "worked on").map(log => log.what)

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
