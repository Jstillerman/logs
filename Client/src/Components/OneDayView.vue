<template lang="html">
  <div class="">
    <h1>Single Day View</h1>
    <button v-if="daysOffset != 0" @click="daysOffset = 0"type="button" name="button">Today</button>
    <h3>{{date}}</h3>
    <button @click="daysOffset += 1" type="button" name="button">Prev Day</button>
    <button @click="daysOffset -= 1" v-if="daysOffset > 0" type="button" name="button">Next Day</button>
    <div class="day stats">
      <p>Breakfast: {{getMeal('breakfast')}} <br>Lunch: {{getMeal('lunch')}} <br> Dinner: {{getMeal('dinner')}} <br> Snack Status: {{status.snacks.length}}</p>
      <p>Total Entries: {{logs.length}}</p>
    </div>
    <!--timeline :points="logs"></timeline-->
    <div class="row">
      <hr>
      <div v-for="point in logs" class="col">
        <p>{{point.title}} -- {{formatTime(point.when)}}</p>
        <p v-if="point._id == selectedPoint">{{point}}</p>
        <button v-if="point._id != selectedPoint" class="button" @click="selectedPoint = point._id">Expand</button>
        <button v-if="point._id == selectedPoint" class="button" @click="selectedPoint = ''">Minimize</button>
        <hr>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import timeline from './timeLine.vue'
import moment from 'moment'
import conf from '../config.json'
import eventHub from '../EventHub.js'

export default {
  components: {
    timeline
  },
  watch: {
    daysOffset () {
      this.refresh()
    }
  },
  data () {
    return {
      breakfastStatus: false,
      lunchStatus: false,
      dinnerStatus: 'upcoming',
      snackStatus: 0,
      logs: [],
      status: {},
      date: 'idk yet',
      daysOffset: 0,
      selectedPoint: ''
    }
  },
  mounted () {
    eventHub.$on('refresh', () => {
      this.refresh()
    })

    this.refresh()
  },
  methods: {
    refresh () {
      axios.get(conf.API_LOC + '/api/daydata/'+moment().subtract(this.daysOffset, 'days').format())
      //  .then(resp => JSON.parse(resp))
        .then(body => {
          this.logs = body.data.logs.map(log => {
                if(!log.pointColor)log.pointColor = 'red'
                if(!log.img)log.img = 'http://www.jikexueyuan.com/event/static/images/bootstrap/bootstrap-logo.png'
                if(!log.title)log.title = "I " + log.action + " " + log.what
                if(!log.text)log.text = JSON.stringify(log)
                log.linkUrl =  log.ongoing ? conf.API_LOC+'/api/logs/'+log._id+'/end' : (log.duration ? 'javascript:void(0)': null),
                log.linkText = log.ongoing ? 'End' : (log.duration ? log.duration + ' minutes' : null)
                return log
          }).sort((a, b) => {
            if(moment(a.when).isBefore(b.when)) return -1
            if(moment(a.when).isAfter(b.when)) return 1
            if(moment(a.then).isSame(b.when)) return 0
          })

          this.status = body.data.status
          this.date = body.data.date
          return body
        })
        .then(console.log)
    },
    formatTime: (time) => moment(time).format("hh:mm a"),
    getMeal (type) {
      return (this.status[type] || []).length >= 1 ? this.status[type][0].what : 'nope'
    }
  }
}
</script>

<style lang="css">
</style>
