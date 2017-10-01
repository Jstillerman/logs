<template>
  <div id="quick-entry">
    <typeahead  :data="['hi', 'bye']" placeholder="whaterver."></typeahead>
    <button v-for="action in actions" @click="trigger(action)" class="button button-3d button-action button-circle button-giant"><i class="fa" :class="action.icon" aria-hidden="true"></i></button><br>
    <button v-for="action in actionsRed" @click="trigger(action)" class="button button-3d button-caution button-circle button-giant"><i class="fa" :class="action.icon" aria-hidden="true"></i></button>
    <div v-if="showDetails" class="details">
      <h2>{{selectedAction.text}}</h2>
      <v-select v-model="what" placeholder="What?"></v-select><br>
      <v-select :options="options" v-model="where"  placeholder="Where?"></v-select><br>
      When? <input v-model="when" type="datetime" name="" value=""><br>
      <input-tag placeholder="Add people..." :tags="who"></input-tag>
      <div v-if="selectedAction.data">Data: <textarea v-model="data"></textarea></div>
      <input-tag placeholder="Add tags..." :tags="tags"></input-tag>
      <button @click="submit()" class="button button-3d button-action button-circle button-small" type="button" name="button"><i class="fa fa-check"></i></button>
      <button @click="showDetails=false" class="button button-3d button-caution button-circle button-small" type="button" name="button"><i class="fa fa-times"></i></button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import InputTag from 'vue-input-tag'
import eventHub from '../EventHub.js'
import {typeahead} from 'vue-strap'

export default {
  name: 'quick-entry',
  data () {
    return {
      what: '',
      where: '',
      who: [],
      when: new Date(),
      data: '',
      options: [],
      tags: [],
      showDetails: false,
      selectedAction: {},
      actions: [
        {icon: "fa-leaf", text: "I scratched my ivy", action: "scratched", what:"my ivy",extraOpts:{pointColor: 'green'}},
        {icon: "fa-cutlery", text: "I ate...", action: "ate", extraOpts:{pointColor: 'blue'}},
        {icon: "fa-eye", text: "I saw...", action: "saw"},
        {icon: "fa-shopping-cart", text: "I bought...", action: "bought"},
        {icon: "fa-briefcase", text: "I worked on...", action: "worked on"},
        {icon: "fa-sticky-note", text: "New Journal Entry", action: "wrote", what: "a note", data: true},
        {icon: "fa-tree", text: "I smoked...", action: "smoked"}
      ],
      actionsRed: [
        {icon: "fa-users", text: "I started chilling with...", action: "socialized with", ongoing: true},
        {icon: "fa-briefcase", text: "I started on...", action: "worked on", ongoing: true},
        {icon: "fa-tree", text: "I started smoking...", action: "smoked", ongoing: true},
      ]
    }
  },
  methods: {
    trigger (action) {
      this.showDetails = true
      this.selectedAction = action
      this.what = ''
      this.when = new Date()
      this.where = ''
      this.who = []
      this.tags = []
      if(action.what) this.what = action.what
      this.getOptions(this.selectedAction)
    },
    submit () {
      let body = {}

      body.action = this.selectedAction.action
      if(this.what != '') body.what = this.what
      if(this.where != '') body.where = this.where
      if(this.who.length != 0) body.who = this.who
      if(this.when != '') body.when = this.when
      if(this.data != '') body.data = this.data
      if(this.tags.length != 0) body.tags = this.tags
      if(this.selectedAction.ongoing) body.ongoing = true
      if(this.selectedAction.extraOpts) {
        Object.keys(this.selectedAction.extraOpts).forEach(key => {
          body[key] = this.selectedAction.extraOpts[key]
        })
      }

      axios.post('http://localhost:8080/api/logs', body)
      .then(() => eventHub.$emit('refresh'))
      this.showDetails = false
    },
    getOptions (action) {
      axios.get('http://localhost:8080/api/logs/stats/' + action.action)
      .then(page => page.data)
      .then(console.log)
      .then(data => Object.keys(data))
    }
  },
  components: {
    InputTag,
    typeahead
  }
}
</script>

<style src="vue-instant/dist/vue-instant.css"></style>

<style lang="scss">

button {
  margin: 10px !important;
}


a.fill-div {
    display: block;
    height: 100%;
    width: 100%;
    text-decoration: none;
}


h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

</style>
