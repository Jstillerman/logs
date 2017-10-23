import VueRouter from 'vue-router'
import quickEntry from './Components/QuickEntry.vue'
import timeLine from './Components/Viewer.vue'
import oneDay from './Components/OneDayView.vue'
import stats from './Components/Stats.vue'
import cal from './Components/Calendar.vue'

const routes = [
  {name: 'quick-entry', path: '/quick-entry', component: quickEntry},
  {name: 'stats', path: '/stats', component: stats},
  {name: 'cal', path: '/cal', component: cal},
  {name: 'day', path: '/day', component: oneDay},
  {name: 'timeline', path: '/timeline', component: timeLine},
  {path: '/', redirect: 'day'}
]

const router = new VueRouter({
  routes
})

export {router}
