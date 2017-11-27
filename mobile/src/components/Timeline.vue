<template>
  <div class="timeline">
    <div class="entry" v-for="log in logs">
      <h2>{{log.user}} {{log.action}} {{log.what}}</h2><br>
      <p>{{log.where || 'unknown'}} - {{formatDate(log.when)}}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import conf from '../config.json'
import moment from 'moment'

export default {
  data () {
    return {
      logs: []
    }
  },
  methods: {
    refresh () {
      axios.get(conf.API_LOC + '/api/logs')
        .then(page => page.data.sort((a, b) => {
          return moment.utc(a.when).diff(moment.utc(b.when))
        }))
        .then(logs => logs.reverse())
        .then(logs => {
          this.logs = logs
        })
    },
    formatDate (date) {
      if (moment(Date()).diff(moment(date)) < 105850000) return moment(date).fromNow()
      return moment(date).format('MMM Do YY, h:mm a')
    }
  },
  mounted () {
    this.refresh()
  }

}
</script>

<style>
.entry {
  margin: 20px;
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 5px 5px 5px grey;
}

.entry h2 {
  font-size: 20pt;
  font-weight: 600;
}

</style>
