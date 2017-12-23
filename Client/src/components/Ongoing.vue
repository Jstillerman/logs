<template>
  <div>
    <h1>Ongoing Events</h1>
    <div class="singleEvent" v-for='event in events'>
      <h3>{{event.user}} {{event.action}} {{event.what}}</h3>
      <p>{{formatDate(event.when)}}</p>
      <q-btn @click="end(event)">End</q-btn>
      <q-btn @click="cancel(event)">Cancel</q-btn>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
import conf from '../config'
import mixins from '../mixins'
import {QBtn} from 'quasar'

export default {
  mixins: [mixins],
  components: {QBtn},
  data () {
    return {
      events: []
    }
  },
  methods: {
    refresh () {
      axios.get(conf.API_LOC + '/api/logs?ongoing=true&user=' + this.getUser())
        .then(page => {
          this.events = page.data
        })
    }
  },
  mounted () {
    this.refresh()
  }
}
</script>

<style>
.singleEvent {
  background-color: #f0f0f0;
  border-radius: 20px;
  margin: 20px;
  padding: 20px;
}
</style>
