<template lang="html">
  <v-select :value='value' :options="people"></v-select>
</template>

<script>
import vSelect from 'vue-select'
import conf from '../config.json'
import axios from 'axios'

export default {
  components: {vSelect},
  props: ['value'],
  data () {
    return {
      people: []
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      axios.get(conf.API_LOC + '/api/people')
      .then(page => page.data)
      .then(people => people.map(obj => obj.name))
      .then(people => {
        this.people = people
      })
    }
  }
}
</script>

<style lang="css">
</style>
