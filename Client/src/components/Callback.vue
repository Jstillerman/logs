<template>
  <fingerprint-spinner class="center" :animation-duration="700" :size="64" :color="'#ff8f00'"/>
</template>

<script>
import {FingerprintSpinner} from 'epic-spinners'

export default {
  name: 'callback',
  props: ['auth'],
  components: {
    FingerprintSpinner
  },
  data () {
    this.auth.handleAuthentication()
    return {}
  }
}
</script>
