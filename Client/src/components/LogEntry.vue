<template>
  <div class="">
    <div class="container">
      <q-btn round v-for="opt in options" style="margin-right: 10px; margin-bottom: 20px;" @click="select(opt)" :color="opt.color" :icon="opt.icon" />
      <div v-if="showEntry">
        <h3>{{selectedOpt.text}}</h3>
        <q-checkbox v-model="ongoing" label="Ongoing" color="faded" />
        <div v-if="!selectedOpt.noWhat">
          <q-input v-model="what" float-label="What" inverted color="faded">
            <q-autocomplete v-if="stats" :static-data="getAutocomplete('what')" :min-characters="1"/>
          </q-input>
          <q-btn @click="what = whah" v-for="whah in first(5, predict('what'))">{{whah}}</q-btn>
        </div>
        <q-datetime v-model="when" type="datetime" color="faded" float-label="When" inverted/>
	<q-btn v-for="minsAgo in [5, 10, 15, 20, 30, 60]" @click="setMinutesAgo(minsAgo)">{{minsAgo}}</q-btn>
        <q-input v-model="where" float-label="Where" color="faded" inverted>
          <q-autocomplete v-if="stats" :static-data="getAutocomplete('where')" :min-characters="1"/>
        </q-input>
        <q-btn @click="where = place" v-for="place in first(5, predict('where'))">{{place}}</q-btn>
        <q-chips-input v-model="who" float-label="Who" color="faded" inverted />
        <q-btn v-for="whom in first(5, predict('who'))" @click="who.push(whom)">{{whom}}</q-btn>
        <q-chips-input v-model="tags" float-label="Tags" color="faded" inverted />
        <q-btn v-if='stats' v-for="tag in first(5, predict('tags'))" @click="tags.push(tag)">{{tag}}</q-btn>
        <q-input inverted v-for="f in selectedOpt.additionalFields" v-model="additionalFields[f]" :float-label='f' color='amber-9'/>
        <div class="list">
          <div class="item multiple-lines item-delimiter">
            <div class="item-content">
              <!-- Notice the "no-border" CSS class -->
              <textarea v-model='data' class="full-width">
                Textarea here with no border and full width.
              </textarea>
            </div>
          </div>
        </div>
        <q-btn flat color="green" @click="log">Log</q-btn><q-btn flat @click="nevermind()" color="orange">Nevermind</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import {QBtn, QToolbar, QLayout, QIcon, QList, QItem, QItemSide, QItemMain, QListHeader, QDatetime, QChipsInput, QInput, QSideLink, QAutocomplete, QCheckbox} from 'quasar'
import axios from 'axios'
import conf from '../config.json'
import mixins from '../mixins'
import actions from '../actions'
import moment from 'moment'

export default {
  mixins: [mixins],
  components: { QBtn, QToolbar, QLayout, QIcon, QItem, QItemSide, QItemMain, QList, QListHeader, QDatetime, QChipsInput, QInput, QSideLink, QAutocomplete, QCheckbox },
  data () {
    return {
      user: this.getUser(),
      options: actions.getActions(),
      stats: {},
      when: Date(),
      showEntry: false,
      selectedOpt: {},
      who: [],
      what: '',
      where: '',
      data: '',
      ongoing: false,
      additionalFields: {},
      tags: []
    }
  },
  methods: {
    select (opt) {
      this.who = []
      this.ongoing = opt.ongoing || false
      this.what = opt.what || ''
      this.when = Date()
      this.where = ''
      this.tags = []
      this.additionalFields = {}
      this.showEntry = true
      this.data = ''
      this.selectedOpt = opt
      this.refreshStats(opt.action)
    },
    predict (field) {
      if (Object.keys(this.stats).length > 1) { // if the stats aren't empty (empty stats still have attrs)
        return (Object.keys(this.stats[field] || {}))
          .filter(t => t !== 'other') // filter out other
          .filter(t => t !== '') // filter out blanks
          .sort((a, b) => this.stats[field][b] - this.stats[field][a])
      }
      return []
    },
    getAutocomplete (field) {
      let prediction = this.predict(field)
      console.log(prediction)
      let formatted = prediction.map(p => {
        return {
          value: p,
          label: p,
          sublabel: 'Count: ' + this.stats[field][p]
        }
      })
      return {
        field: 'value',
        list: formatted
      }
    },
    cherryPick (tags) {
      if (!tags || tags === {}) return []
      return Object.keys(tags)
        .sort((a, b) => tags[b] - tags[a]) // sort by frequency
        .filter(t => t !== '') // filter out blanks
        .slice(0, 5) // Get only the first three items
    },
    setMinutesAgo (minsAgo) {
      this.when = moment().subtract(minsAgo, 'minutes').toDate()
    },
    refreshStats (action) {
      axios.get(conf.API_LOC + '/api/logs/stats/' + action + '?user=' + this.getUser())
        .then(page => {
          this.stats = page.data
        })
    },
    log () {
      var payload = {
        action: this.selectedOpt.action,
        what: this.what,
        when: this.when,
        user: this.user,
        client: 'Quasar'
      }
      if (this.where !== '') payload.where = this.where
      if (this.who !== []) payload.who = this.who
      if (this.tags !== []) payload.tags = this.tags
      if (this.ongoing) payload.ongoing = true
      if (this.data) payload.data = this.data
      Object.keys(this.additionalFields).forEach(key => {
        if (this.additionalFields[key] !== '') payload[key] = this.additionalFields[key]
      })
      axios.post(conf.API_LOC + '/api/logs/', payload)
        .then((page) => console.log('New log: ', page.data))
      this.nevermind()
    },
    nevermind () {
      this.showEntry = false
    }
  }
}
</script>

<style>
 .container {
   margin: 20px;
 }

</style>
