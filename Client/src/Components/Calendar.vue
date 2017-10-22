<template lang="html">
  <div class="cal">
    <calendar :events="events"></calendar>
  </div>

</template>

<script>
import Calendar from 'vue-fullcalendar'
import eventHub from '../EventHub'
import axios from 'axios'
import conf from '../config.json'
import moment from 'moment'

export default {
  components: {
    Calendar
  },
  data () {
    return {
      events: []
    }
  },
  mounted () {
    eventHub.$on('refresh', () => {
      this.refresh()
    })

    eventHub.$on('eventClick', (event, jsEvent, pos) => {
      console.log('eventClick', event, jsEvent, pos);
    })

    this.refresh()
  },
  methods: {
    refresh () {
      axios.get(conf.API_LOC + '/api/logs/')
        .then(page => page.data)
        .then(data => data.map(ent => {
          return {title: "I "+ent.action+" "+ent.what, start: moment(ent.when).format()}
        }))
        .then(events => this.events = events)
        .then(console.log)
    }
  }
}
</script>

<style lang="css">
</style>
