<template lang="html">
  <div class="">
    <h1>Single Day View</h1>
    <div class="day stats">
      <p>Eaten Breakfast: {{breakfastStatus}} <br> Eaten Lunch: {{lunchStatus}} <br> Eaten Dinner: {{dinnerStatus}} <br> Snack Status {{snackStatus}}</p>
    </div>
    <timeline :points="logs"></timeline>

  </div>
</template>

<script>
import axios from 'axios'
import timeline from './timeLine.vue'
import moment from 'moment'

export default {
  components: {
    timeline
  },
  data () {
    return {
      breakfastStatus: false,
      lunchStatus: false,
      dinnerStatus: 'upcoming',
      snackStatus: 0,
      logs: [],
      status: {}
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      axios.get('http://localhost:8080/api/daydata/'+moment().format())
      //  .then(resp => JSON.parse(resp))
        .then(body => {
          this.logs = body.data.logs.map(log => {
                if(!log.pointColor)log.pointColor = 'red'
                if(!log.img)log.img = 'http://www.jikexueyuan.com/event/static/images/bootstrap/bootstrap-logo.png'
                if(!log.title)log.title = "I " + log.action + " " + log.what
                if(!log.text)log.text = JSON.stringify(log)
                log.linkUrl =  log.ongoing ? 'http://localhost:8080/api/logs/'+log._id+'/end' : (log.duration ? 'javascript:void(0)': null),
                log.linkText = log.ongoing ? 'End' : (log.duration ? log.duration + ' minutes' : null)
                return log
          })
          this.status = body.data.status
          return body
        })
        .then(console.log)
    }
  }
}
</script>

<style lang="css">
</style>
