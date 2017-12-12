<template>
  <div class="timeline">
    <div class="entry" v-for="log in first(50, logs)">
      <q-btn round @click="log.editing = !log.editing" style="float: right;" icon="fa-cog"></q-btn>
      <h2>{{log.user}} {{log.action}} {{log.what}}</h2>
      <div v-if="!log.editing">
        <img v-if="log.action=='added a'":src="log.url">
        <div v-if="log.photo">
          <img style="width: 200px; height: auto;":src="log.photo">
          <br>
        </div>
        <ul v-if="log.showData">
          <li v-for="key in pickKeys(log)">{{key}}: {{log[key]}}</li>
        </ul>
        <q-btn @click="log.showData = !log.showData">{{log.showData ? 'Hide Fields': 'Show Fields'}}</q-btn>
        <div style="margin-top: 10px; padding-bottom: 20px;">
          <p style="float: left;">{{log.where || 'unknown'}} - {{formatDate(log.when)}}</p>
          <p style="float: right;" v-if='log.duration'>{{log.duration}} mins</p>
          <q-btn style="float: right;" @click='end(log)' v-if='log.ongoing'>End</q-btn>
        </div>
      </div>
      <div v-else>
        <textarea v-model="log.editText" cols="7:30" rows="11:10"></textarea>
        <q-btn @click="put(JSON.parse(log.editText))">Update</q-btn>
        <q-btn @click="del(log)">Delete</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import conf from '../config.json'
import moment from 'moment'
import {QBtn} from 'quasar'
import mixins from '../mixins'

export default {
  mixins: [mixins],
  components: {QBtn},
  data () {
    return {
      logs: [],
      newText: ''
    }
  },
  methods: {
    refresh () {
      axios.get(conf.API_LOC + '/api/logs')
        .then(page => page.data.sort((a, b) => {
          return moment.utc(a.when).diff(moment.utc(b.when))
        }))
        .then(logs => logs.filter(log => log.user === this.getUser()))
        .then(logs => logs.reverse())
        .then(logs => logs.map((l) => {
          l.showData = false
          l.editing = false
          l.editText = JSON.stringify(l)
          return l
        }))
        .then(logs => {
          this.logs = logs
        })
    },
    update (logJSON, original) {
      original.editing = false
      var log = JSON.parse(logJSON)
      axios.put(conf.API_LOC + '/api/logs/' + log._id, log)
        .then(page => this.refresh())
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
