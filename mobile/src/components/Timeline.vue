<template>
  <div class="timeline">
    <div v-if="logs.length === 0">
      <fingerprint-spinner class="center" :animation-duration="700" :size="64" :color="'#027be3'"/>
    </div>
    <div v-else>
      <q-card style="margin: 20px;">
        <q-card-main>
          <q-search v-model="search" placeholder="Type an action, what, who, or where" />
          <q-checkbox label="Ongoing Only" v-model="onlyOngoing"/>
          <q-checkbox label="Show Friend Activity" v-model="friendActivity"/>
        </q-card-main>
      </q-card>
      <q-card v-for="log in first(100, filter(logs))" style="margin: 20px;">
        <q-card-media v-if="log.photo">
          <img :src="log.photo">
        </q-card-media>
        <q-card-title>
          {{getUser() === log.user ? 'I' : log.user}} {{log.action}} {{log.what || ''}}
          <q-chip v-if="log.ongoing" pointing="left" color="primary">Ongoing</q-chip>
        </q-card-title>
        <q-card-main>
          <div v-if="editing !== log">
            <p class="text-faded" v-if="log.data && log.data != ''">{{log.data}}</p>
            <div v-for="prop in pickKeys(log)">
              <q-icon :name="getIcon(prop)"/>
              {{format(prop, log[prop])}}
              <br>
            </div>
            <div v-if="log.comments.length">
              <br>
              <p v-if="showComments !== log" class="text-faded" @click="showComments = log">{{log.comments.length}} Comment{{log.comments.length > 1 ? 's': ''}}</p>
              <q-list v-else highlight inset-separator style="max-width: 400px">
                <q-item  v-for="comment in log.comments" multiline>
                  <!--q-item-side avatar="/statics/boy-avatar.png" /-->
                  <q-item-main
                  :label="comment.user"
                  label-lines="1"
                  :sublabel="comment.text"
                  sublabel-lines="2"
                  />
                  <q-item-side right :stamp="formatDate(comment.when)" />
                </q-item>
              </q-list>
            </div>
          </div>
          <div v-else>
            <q-checkbox v-model="editing.ongoing" label="Ongoing"/>
          </div>
        </q-card-main>
        <q-card-separator/>
        <q-card-actions>
          <div v-if="commenting === log">
            <q-input @keydown="handleKeyDown" v-model="comment" float-label='Comment'></q-input>
          </div>
          <div v-else-if="editing === log">
            <q-btn flat @click="put(editing)" color="primary">Save</q-btn>
            <q-btn flat @click="editing = {}" color="negative">Cancel</q-btn>
          </div>
            <div v-else>
              <q-btn flat v-if='log.ongoing' @click="end(log)" color="primary">End</q-btn>
              <q-btn flat v-if='log.ongoing' @click="cancel(log)" color="secondary">Cancel</q-btn>
              <q-btn flat @click="commenting = log">Comment</q-btn>
              <q-btn flat>Share</q-btn>
              <q-btn flat @click="editing = log">Edit</q-btn>
              <q-btn flat color="negative" @click="del(log)" style="align-self: right;">Delete</q-btn>
            </div>
          </q-card-actions>
        </q-card>
    </div>
    </div>
  </template>

  <script>
  import axios from 'axios'
  import conf from '../config.json'
  import moment from 'moment'
  import {QBtn, QCard, QCardTitle, QSearch, QCardMain, QCardSeparator, QCardActions, QIcon, QCheckbox, QCardMedia, QItem, QList, QItemSide, QChip, QItemMain, QInput} from 'quasar'
  import mixins from '../mixins'
  import {AtomSpinner, FingerprintSpinner} from 'epic-spinners'

  export default {
    mixins: [mixins],
    components: {QBtn, QCard, QSearch, QCardTitle, QCardMain, QCardSeparator, QCardActions, QIcon, QCheckbox, QCardMedia, QChip, QList, QItem, QItemSide, QItemMain, AtomSpinner, FingerprintSpinner, QInput},
    data () {
      return {
        logs: [],
        commenting: {},
        editing: {},
        showComments: {},
        comment: '',
        newText: '',
        search: '',
        onlyOngoing: false,
        friendActivity: false
      }
    },
    methods: {
      refresh () {
        axios.get(conf.API_LOC + '/api/logs')
          .then(page => page.data.sort((a, b) => {
            return moment.utc(a.when).diff(moment.utc(b.when))
          }))
          // .then(logs => logs.filter(log => log.user === this.getUser()))
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
      handleKeyDown (e) {
        if (e.key === 'Enter') this.sendComment()
      },
      update (logJSON, original) {
        original.editing = false
        var log = JSON.parse(logJSON)
        axios.put(conf.API_LOC + '/api/logs/' + log._id, log)
          .then(page => this.refresh())
      },
      pickKeys (log) {
        let keys = Object.keys(log)
        let blacklist = ['__v', 'showData', 'editing', 'editText', '_id', 'what', 'action', 'ongoing', 'tags', 'comments', 'data', 'photo']
        return keys.filter(k => {
          return (!blacklist.includes(k) && log[k].length !== 0)
        })
      },
      sendComment () {
        if (!this.commenting.comments) this.commenting.comments = []
        this.commenting.comments.push({
          user: this.getUser(),
          text: this.comment,
          when: Date()
        })
        this.put(this.commenting)
        this.commenting = {}
      },
      format (prop, val) {
        if (prop === 'when' || prop === 'endTime') {
          return this.formatDate(val)
        }
        return val
      },
      filter (logs) {
        return logs.filter(log => {
          let you = this.getUser()
          let safe = !this.getSettings().HideNSFW || (log.action !== 'smoked' && log.action !== 'copped' && !(log.action === 'bought' && log.what === 'weed'))
          let showOngoing = !this.onlyOngoing || log.ongoing
          let showFriend = this.friendActivity || log.user === you
          let searched = this.search === '' || this.searchCheck(this.search, log)
          return safe && showOngoing && showFriend && searched
        })
      },
      searchCheck (search, log) {
        let raw = JSON.stringify(log).toLowerCase()
        let passed = true
        search.toLowerCase().split(' ').forEach(word => {
          passed = passed * raw.includes(word)
        })
        return passed
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
