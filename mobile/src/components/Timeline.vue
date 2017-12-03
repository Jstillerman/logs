<template>
  <div class="timeline">
    <div class="entry" v-for="log in logs">
      <h2>{{log.user}} {{log.action}} {{log.what}}</h2>
      <ul v-if="log.showData">
        <li v-for="key in pickKeys(log)">{{key}}: {{log[key]}}</li>
      </ul>
      <q-btn @click="log.showData = !log.showData">{{log.showData ? 'Hide Fields': 'Show Fields'}}</q-btn>
      <div style="margin-top: 10px; padding-bottom: 20px;">
        <p style="float: left;">{{log.where || 'unknown'}} - {{formatDate(log.when)}}</p>
        <p style="float: right;" v-if='log.duration'>{{log.duration}} mins</p>
        <q-btn style="float: right;" v-if='log.ongoing'>End</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import conf from '../config.json'
import moment from 'moment'
import {QBtn} from 'quasar'

export default {
  components: {QBtn},
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
        .then(logs => logs.map((l) => {
          l.showData = false
          return l
        }))
        .then(logs => {
          this.logs = logs
        })
    },
    pickKeys (log) {
      let keys = Object.keys(log)
      return keys.filter(k => {
        return k !== '__v' && k !== 'showData' && log[k] !== '' && log[k] !== []
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
