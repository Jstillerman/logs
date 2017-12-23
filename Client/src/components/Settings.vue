<template>
  <div class="settings">
    <q-card>
      <q-card-title>
        Settings
      </q-card-title>
      <q-card-main>
        <q-checkbox v-if="settings.HideNSFW != null" v-model="settings.HideNSFW" label="Hide NSFW" />
      </q-card-main>
      <q-card-separator />
      <q-card-actions>
        <q-btn flat @click="reset()" color="negative">Reset</q-btn>
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
      LocalStorage.set('settings', { HideNSFW: false })
    }
  }
}
</script>

<style>

</style>
