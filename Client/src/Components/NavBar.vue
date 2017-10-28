<template lang="html">
  <div class="sticky navbar">
    <ul>
      <li><router-link :to="{ name: 'timeline', params: {} }">Timeline</router-link></li>
      <li><router-link :to="{ name: 'cal', params: {} }">Calendar</router-link></li>
      <li><router-link :to="{ name: 'day', params: {} }">Day</router-link></li>
      <li><router-link :to="{ name: 'stats', params: {} }">Stats</router-link></li>
      <li><router-link :to="{ name: 'quick-entry', params: {} }">Entry</router-link></li>
      <li><router-link :to="{ name: 'friends', params: {} }">Friends</router-link></li>
      <li>{{getGreeting()}}</li>
    </ul>

  </div>
</template>

<script>
import Vue from 'vue'
let sesh = Vue.prototype.$session

export default {
  computed: {
    session() {
      return []//sesh.get('profile')
    }
  },
  methods: {
    getGreeting () {
      return this.session.name
    }
  }


}
</script>

<style scoped lang="css">
.navbar {
  background-color: #303030;
  color: #ffffff;
  z-index: 999;
}


ul {
  padding: 0;
  width: 100%;
}

li {
  display: inline;
}

a {
  outline: none;
  text-decoration: none;
  display: inline-block;
  width: 10.5%;
  margin-right: 0.625%;
  text-align: center;
  line-height: 3;
  color: #c0c0c0;
}

li:last-child a {
  margin-right: 0;
}

a:link, a:visited, a:focus {
  background: black;
}

a:hover {
  color: #ffffff
}

a:active {
  background: #ffffff;
  color: black;
}

.sticky {
  position: fixed;
  top: 0;
  width: 100%
}

</style>
