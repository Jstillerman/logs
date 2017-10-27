import VueRouter from 'vue-router'
import quickEntry from './Components/QuickEntry.vue'
import timeLine from './Components/Viewer.vue'
import oneDay from './Components/OneDayView.vue'
import stats from './Components/Stats.vue'
import cal from './Components/Calendar.vue'
import callback from './Components/Callback.vue'
import Vue from 'vue'

const routes = [
  {name: 'quick-entry', path: '/quick-entry', component: quickEntry},
  {name: 'stats', path: '/stats', component: stats},
  {name: 'cal', path: '/cal', component: cal},
  {name: 'day', path: '/day', component: oneDay},
  {name: 'timeline', path: '/timeline', component: timeLine},
  {name: 'callback', path: '/callback', component: callback},
  {path: '/', redirect: 'day'}
]

const router = new VueRouter({
  routes,
  mode: 'history'
})


router.beforeEach((to, from, next) => {
  console.log(to.name);
  if(to.name == "callback") {
    next()
  }
  else {
    if(Vue.prototype.$session.get('profile')) next()
    else console.log("you must be logged in");next(false)
  }
})

export {router}
