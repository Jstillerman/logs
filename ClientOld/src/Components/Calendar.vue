<template lang="html">
  <div class="cal">
    <input v-model="shouldFilter" type="checkbox" name="" value="">
    <input v-model="actionFilter" type="text" name="" value=""><br>
    <calendar @eventClick='handleEventClick' :events="visibleEvents"></calendar>
  </div>

</template>

<script>
import Calendar from 'vue-fullcalendar'
import eventHub from '../EventHub'
import axios from 'axios'
import conf from '../config.json'
import moment from 'moment'
import utils from '../utils.js'

export default {
  components: {
    Calendar
  },
  data () {
    return {
      events: [],
      shouldFilter: true,
      actionFilter: 'ate'
    }
  },
  computed: {
    visibleEvents () {
      if(this.shouldFilter) return this.events.filter((e) => (e.action == this.actionFilter))
      else return this.events
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
      axios.get(conf.API_LOC + '/api/logs/')
        .then(page => page.data)
        .then(data => data.map(ent => {
          return {title: "I "+ent.action+" "+ent.what, start: moment(ent.when).format(), id: ent._id, action: ent.action}
        }))
        .then(events => utils.sortByDate(events))
        .then(events => this.events = events)

    },
    handleEventClick (event, jsEvent) {
      //console.log('handled', event.title);
      this.router.push({name: 'event'})
    }
  }
}
</script>

<style lang="css">
</style>
