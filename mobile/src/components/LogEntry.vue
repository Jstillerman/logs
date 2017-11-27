<template>
  <div class="">
    <div class="content">
      <q-btn round v-for="opt in options" style="margin: 10px" @click="select(opt)" :color="opt.color" :icon="opt.icon" />
      <div v-if="showEntry">
        <h3>{{selectedOpt.text}}</h3>
        <q-input v-model="what" float-label="What" inverted>
          <q-autocomplete :static-data="predict('what')" :min-characters="1"/>
        </q-input>
        <q-datetime v-model="when" type="datetime" color="secondary" float-label="When" inverted/>
        <q-input v-model="where" float-label="Where" color="tertiary" inverted>
          <q-autocomplete :static-data="predict('where')" :min-characters="1"/>
        </q-input>
        <q-chips-input v-model="who" float-label="Who" color="positive" inverted />
        <q-chips-input v-model="tags" float-label="Tags" color="info" inverted />
        <q-btn v-for="tag in cherryPick(stats.tags)" @click="tags.push(tag)" color="info">{{tag}}</q-btn>
        <p class="caption">Textbox and Textarea with No Borders</p>
        <div class="list">
          <div class="item multiple-lines item-delimiter">
            <div class="item-content">
              <!-- Notice the "no-border" CSS class -->
              <textarea class="full-width">
                Textarea here with no border and full width.
              </textarea>
            </div>
          </div>
        </div>
        <q-btn flat color="green" @click="log">Log</q-btn><q-btn flat @click="nevermind()" color="orange">Nevermind</q-btn>
      </div>
    </div>
    hello, {{user}}
  </div>
</template>

<script>
import {QBtn, QToolbar, QLayout, QIcon, QList, QItem, QItemSide, QItemMain, QListHeader, QDatetime, QChipsInput, QInput, LocalStorage, QSideLink, QAutocomplete} from 'quasar'
import axios from 'axios'
import conf from '../config.json'

export default {
  components: { QBtn, QToolbar, QLayout, QIcon, QItem, QItemSide, QItemMain, QList, QListHeader, QDatetime, QChipsInput, QInput, QSideLink, QAutocomplete },
  data () {
    if (!LocalStorage.get.item('user')) LocalStorage.set('user', prompt('Name?'))
    let usr = LocalStorage.get.item('user')
    return {
      user: usr,
      options: [
        {icon: 'fa-cutlery', text: 'I ate...', action: 'ate', color: 'green', extraOpts: {pointColor: 'blue'}},
        {icon: 'fa-eye', text: 'I saw...', color: 'blue', action: 'saw'},
        {icon: 'fa-shopping-cart', text: 'I bought...', color: 'red', action: 'bought'},
        {icon: 'fa-briefcase', text: 'I worked on...', color: 'purple', action: 'worked on'},
        {icon: 'fa-sticky-note', text: 'New Journal Entry', color: 'orange', action: 'wrote', what: 'a note', data: true},
        {icon: 'fa-comments', text: 'I talked to...', color: 'blue', action: 'talked to'},
        {icon: 'fa-tree', text: 'I smoked...', color: 'brown', action: 'smoked'},
        {icon: 'fa-male', text: 'I tested (Athletic)...', color: 'green', action: 'performed', what: '20 pushups'}
      ],
      stats: {},
      when: Date(),
      showEntry: false,
      selectedOpt: {},
      who: [],
      what: '',
      where: '',
      tags: []
    }
  },
  methods: {
    select (opt) {
      this.who = []
      this.what = ''
      this.when = Date()
      this.where = ''
      this.tags = []
      this.showEntry = true
      this.selectedOpt = opt
      this.refreshStats(opt.action)
    },
    predict (field) {
      let l = Object.keys(this.stats[field])
        .sort((a, b) => this[field][b] - this[field][a]) // sort by frequency
        .filter(t => t !== '') // filter out blanks
        .map(p => {
          return {
            value: p,
            label: p,
            sublabel: 'Count: ' + this.stats[field][p]
          }
        })
      return {
        field: 'value',
        list: l
      }
    },
    cherryPick (tags) {
      if (!tags || tags === {}) return []
      return Object.keys(tags)
        .sort((a, b) => tags[b] - tags[a]) // sort by frequency
        .filter(t => t !== '') // filter out blanks
        .slice(0, 5) // Get only the first three items
    },
    refreshStats (action) {
      axios.get(conf.API_LOC + '/api/logs/stats/' + action)
        .then(page => { this.stats = page.data })
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
.content {
  margin: 20px;
}
</style>
