<template lang="html">
  <div id="visualization"></div>
</template>

<script>
var DataSet = require('vis/lib/DataSet');
var Timeline = require('vis/lib/timeline/Timeline');


var container = document.getElementById("visualization");

var items = new DataSet([
  { id: 1, content: "item 1", start: "2017-04-20" },
  { id: 2, content: "item 2", start: "2017-04-14" },
  { id: 3, content: "item 3", start: "2017-04-18" },
  { id: 4, content: "item 4", start: "2017-04-16", end: "2017-04-19" },
  { id: 5, content: "item 5", start: "2017-04-25" },
  { id: 6, content: "item 6", start: "2017-04-27", type: "point" }
]);

var options = {};

export default {
  props: ['data'],

  mounted() {
     // uing $nextTick to make sure the DOM udfpate has finished
     this.$nextTick(() => {
       // get the element
       const el = document.getElementById("visualization")
       // create the Timeline
       this.timeline = new Timeline(el, items, options);
     })
   }
}
</script>

<style lang="css">
</style>
