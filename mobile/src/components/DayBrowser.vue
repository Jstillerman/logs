<template>
  <div class="daybrowser">
    <button @click="drawTimelines">${0}</button>
    <div v-for='day in days' class="singleday">
      {{day.title}}
      <div :class="day.title" style="width:200px;"></div>
    </div>
  </div>
</template>

<script>
import {TimeKnots} from '../timeknots.js'
import axios from 'axios'
import conf from '../config'

export default {
  data () {
    return {
      days: [{title: 'today', data: {}}]
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    drawTimelines () {
      this.days.forEach(day => {
        TimeKnots.draw('.' + day.title, day.data, {color: 'teal', width: 700, showLabels: true, labelFormat: '%Y'})
      })
    },
    refresh () {
      axios.get(conf.API_LOC + '/api/daydata/' + Date())
        .then(page => {
          console.log(page.data.logs)
          this.days[0].data = page.data.logs.map(log => {
            return {
              date: log.when,
              name: log.user + ' ' + log.action + ' ' + log.what
            }
          })
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
