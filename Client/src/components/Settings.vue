<template>
  <div class="settings">
    <q-card>
      <q-card-title>
        Settings
      </q-card-title>
      <q-card-main>
        <q-checkbox color="amber-9" v-if="settings.HideNSFW != null" v-model="settings.HideNSFW" label="Hide NSFW" />
        <q-checkbox color="amber-9" v-if="settings.showId != null" v-model="settings.showId" label="Show IDs" />
      </q-card-main>
      <q-card-separator />
      <q-card-actions>
        <q-btn flat @click="reset()" color="amber-9">Reset</q-btn>
        <q-btn flat @click="changeUser()" color="amber-9">Change User</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import {QBtn, QCheckbox, LocalStorage, QCard, QCardSeparator, QCardActions, QCardMain, QCardTitle} from 'quasar'
import mixins from '../mixins'
export default {
  components: {QBtn, QCheckbox, QCard, QCardSeparator, QCardMain, QCardActions, QCardTitle},
  data () {
    return {
      settings: {}
    }
  },
  mixins: [mixins],
  watch: {
    settings: {
      handler (newSettings) {
        LocalStorage.set('settings', newSettings)
        console.log('done')
      },
      deep: true
    }
  },
  mounted () {
    this.settings = this.getSettings()
  },
  methods: {
    reset () {
      LocalStorage.set('settings', false)
      this.getSettings()
    },
    changeUser () {
      LocalStorage.set('user', false)
      this.getUser()
    }
  }
}
</script>

<style>

</style>
