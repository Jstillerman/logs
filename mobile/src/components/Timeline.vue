<template>
  <div class="timeline">
    <div v-if="logs.length === 0">
      <fingerprint-spinner class="center" :animation-duration="700" :size="64" :color="'#027be3'"/>
    </div>
    <q-card v-else v-for="log in filter(first(100, logs))" style="margin: 20px;">
      <q-card-media v-if="log.photo">
        <img :src="log.photo">
      </q-card-media>
      <q-card-title>
        {{log.user}} {{log.action}} {{log.what || ''}}
        <q-chip v-if="log.ongoing" pointing="left" color="primary">Ongoing</q-chip>
      </q-card-title>
      <q-card-main>
        <p class="text-faded" v-if="log.data && log.data != ''">{{log.data}}</p>
        <div>
          <div v-for="prop in pickKeys(log)">
            <q-icon :name="getIcon(prop)"/>
            {{format(prop, log[prop])}}
            <br>
          </div>
        </div>
      </q-card-main>
      <q-card-separator/>
      <q-card-actions>
        <q-btn flat v-if='log.ongoing' @click="end(log)" color="primary">End</q-btn>
        <q-btn flat>Comment</q-btn>
        <q-btn flat>Share</q-btn>
        <q-btn flat>Edit</q-btn>
        <q-btn flat color="negative" @click="del(log)" style="align-self: right;">Delete</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import axios from 'axios'
import conf from '../config.json'
import moment from 'moment'
import {QBtn, QCard, QCardTitle, QCardMain, QCardSeparator, QCardActions, QIcon, QCardMedia, QChip} from 'quasar'
import mixins from '../mixins'
import {AtomSpinner, FingerprintSpinner} from 'epic-spinners'

export default {
  mixins: [mixins],
  components: {QBtn, QCard, QCardTitle, QCardMain, QCardSeparator, QCardActions, QIcon, QCardMedia, QChip, AtomSpinner, FingerprintSpinner},
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
      let blacklist = ['__v', 'showData', 'editing', 'editText', '_id', 'what', 'action', 'ongoing', 'tags']
      return keys.filter(k => {
        return (!blacklist.includes(k) && log[k].length !== 0)
      })
    },
    format (prop, val) {
      if (prop === 'when' || prop === 'endTime') {
        return this.formatDate(val)
      }
      return val
    },
    filter (logs) {
      console.log('filtering!')
      if (!this.getSettings().HideNSFW) return logs
      return logs.filter(log => {
        return log.action !== 'smoked' && log.action !== 'copped' && !(log.action === 'bought' && log.what === 'weed')
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

.center {
  margin: 40px;
}

</style>
