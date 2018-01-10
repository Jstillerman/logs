<template>
  <div class="timeline">
    <div v-if="logs.length === 0">
      <fingerprint-spinner class="center" :animation-duration="700" :size="64" :color="'#ff8f00'"/>
    </div>
    <div v-else>
      <q-pull-to-refresh :handler="refresh">
        <q-card style="margin: 20px;">
          <q-card-main>
            <q-search v-model="search" placeholder="Type an action, what, who, or where" color="amber-9"/>
            <q-search v-if="showSort" v-model="sort" placeholder="Sort" />
            <q-icon name="sort" @click="showSort = !showSort"/>
            <q-checkbox label="Ongoing Only" v-model="onlyOngoing"/>
            <q-checkbox label="Show Friend Activity" v-model="friendActivity"/>
            <q-checkbox label="Only Show Friend Activity" v-model="onlyFriendActivity" :disabled='!friendActivity'/>
          </q-card-main>
        </q-card>
        <q-card v-for="log in first(maxDisplayed, filter(logs))" style="margin: 20px;">
          <q-card-media v-if="log.photo">
            <img :src="log.photo">
          </q-card-media>
          <q-card-title>
            <q-icon :name="getActionIcon(log.action)" style="padding-right: 5px;"/>{{getUser() === log.user ? 'I' : log.user}} {{log.action}} {{log.what || ''}}
            <q-chip v-if="log.ongoing" pointing="left" color="amber-9">Ongoing</q-chip>
            <q-icon slot="right" name="more_vert">
              <q-popover ref="popover">
                <q-list link class="no-border">
                  <q-item @click="closePopover(); editing = log">
                    <q-item-main label="Edit" />
                  </q-item>
                  <q-item @click="closePopover(); del(log)">
                    <q-item-main label="Delete" />
                  </q-item>
                  <q-item @click="closePopover(); share(log, getPerson())">
                    <q-item-main label="Share" />
                  </q-item>
                </q-list>
              </q-popover>
            </q-icon>
          </q-card-title>
          <q-card-main>
            <div v-if="editing !== log">
              <p class="text" v-if="log.data && log.data != ''">{{log.data}}</p>
              <div v-for="prop in pickKeys(log)">
                <q-icon :name="getIcon(prop)"/>
                {{format(prop, log[prop])}}
                <br>
              </div>
              <div v-if="log.comments.length">
                <br>
                <!--p v-if="showComments !== log" class="text-faded" @click="showComments = log">{{log.comments.length}} Comment{{log.comments.length > 1 ? 's': ''}}</p-->
                <q-list highlight inset-separator style="max-width: 400px">
                  <q-item  v-for="comment in log.comments" multiline>
                    <!--q-item-side avatar="/statics/boy-avatar.png" /-->
                    <q-item-main
                    :label="comment.user"
                    label-lines="1"
                    :sublabel="comment.text"
                    />
                    <q-item-side right :stamp="formatDate(comment.when)" />
                  </q-item>
                </q-list>
              </div>
            </div>
            <div v-else>
              <q-input v-model="editing.data" type="textarea" float-label="Data" :max-height="100" :min-rows="2"/>
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
            </div>
          </q-card-actions>
        </q-card>
      </q-pull-to-refresh>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import conf from '../config.json'
import moment from 'moment'
import {QBtn, QCard, QCardTitle, QSearch, QPullToRefresh, QCardMain, QCardSeparator, QCardActions, QIcon, QCheckbox, QCardMedia, QItem, QList, QItemSide, QChip, QItemMain, QPopover, QInput} from 'quasar'
import mixins from '../mixins'
import {AtomSpinner, FingerprintSpinner} from 'epic-spinners'
import actions from '../actions'

export default {
  mixins: [mixins],
  components: {QBtn, QPullToRefresh, QCard, QSearch, QCardTitle, QCardMain, QCardSeparator, QCardActions, QIcon, QCheckbox, QCardMedia, QChip, QList, QItem, QItemSide, QItemMain, AtomSpinner, QPopover, FingerprintSpinner, QInput},
  data () {
    return {
      logs: [],
      commenting: {},
      editing: {},
      showComments: {},
      comment: '',
      newText: '',
      search: this.$route.params.stuff || '',
      maxDisplayed: 30,
      showSort: false,
      sort: 'price',
      onlyOngoing: false,
      friendActivity: false,
      onlyFriendActivity: false
    }
  },
  watch: {
    $route (newRoute) {
      this.search = newRoute.params.stuff
    },
    friendActivity (newFA) {
      if (!newFA) this.onlyFriendActivity = false
    }
  },
  methods: {
    getActionIcon: actions.getIcon,
    refresh (done) {
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
        .then(() => {
          if (done) done()
        })
    },
    getPerson () {
      return prompt('Who do you want to share this with?')
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
    closePopover () {
      this.$refs.popover.forEach(pop => pop.close())
    },
    pickKeys (log) {
      let keys = Object.keys(log)
      let blacklist = ['__v', 'showData', 'user', 'editing', 'editText', 'what', 'action', 'ongoing', 'tags', 'comments', 'data', 'photo']
      if (!this.getSettings().showId) blacklist.push('_id')
      return keys.filter(k => {
        return (!blacklist.includes(k) && (!Array.isArray(log[k]) || log[k].length > 0))
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
        let onlyFriends = !this.onlyFriendActivity || log.user !== you
        let searched = this.search === '' || this.searchCheck(this.search, log)
        return safe && showOngoing && showFriend && onlyFriends && searched
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
    console.log('hello')
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
