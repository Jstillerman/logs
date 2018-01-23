<template>
  <div class="">
    <q-card>
      <q-card-title>
        Frequency Pies
        <span slot="subtitle">{{actionKey + " I " + actionType}}</span>
      </q-card-title>
      <q-card-main>
        <v-select @click="getOptions(actionType)" v-model="actionType" :options="Object.keys(stats.freq || {})"></v-select>
        <v-select v-model="actionKey" :options="actionData.attrs"></v-select>
        <q-input v-model="minimumCount" type="number"></q-input>
        <pie-chart :data="filter(actionData[actionKey])"></pie-chart>
      </q-card-main>
    </q-card>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import mixins from 'src/mixins'
import axios from 'axios'
import conf from '../../config.json'
import {QCard, QCardMain, QCardTitle, QInput} from 'quasar'

export default {
  mixins: [mixins],
  components: {
    vSelect,
    QCard,
    QCardMain,
    QCardTitle,
    QInput
  },
  data () {
    return {
      stats: {},
      minimumCount: 3,
      actionData: {},
      actionKey: 'ate',
      actionType: 'what'
    }
  },
  watch: {
    actionType (val) {
      this.getOptions()
    }
  },
  mounted () {
    this.refresh()
    this.getOptions()
  },
  methods: {
    refresh () {
      axios.get(conf.API_LOC + '/api/logs/stats?user=' + this.getUser())
        .then(page => page.data)
        .then(data => {
          let results = []
          Object.keys(data.timeline).forEach(key => {
            results.push({name: key, data: data.timeline[key]})
          })
          data.timeline = results
          return data
        })
        .then(s => { this.stats = s })
    },
    filter (s) {
      if (s) {
        let stats = JSON.parse(JSON.stringify(s))
        stats.other = 0
        Object.keys(stats).forEach(key => {
          if (stats[key] <= this.minimumCount && key !== 'other') {
            delete stats[key]
            stats.other++
          }
        })
        if (stats.other === 0) delete stats.other
        return stats
      }
      else {
        return s
      }
    },
    getOptions () {
      axios.get(conf.API_LOC + '/api/logs/stats/' + this.actionType + '?user=' + this.getUser())
        .then(page => page.data)
        .then(data => { this.actionData = data })
    }
  }

}
</script>

<style>

</style>
