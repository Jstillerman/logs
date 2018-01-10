import conf from './config'
import axios from 'axios'
import moment from 'moment'
import {LocalStorage} from 'quasar'

export default {
  methods: {
    del (log) {
      axios.delete(conf.API_LOC + '/api/logs/' + log._id)
        .then(this.refresh())
    },
    end (log) {
      axios.get(conf.API_LOC + '/api/logs/' + log._id + '/end')
        .then(this.refresh())
    },
    cancel (log) {
      log.ongoing = false
      this.put(log)
    },
    put (log) {
      console.log('PUTting', log._id)
      axios.put(conf.API_LOC + '/api/logs/' + log._id, log)
        .then(() => {
          console.log('put complete')
          this.refresh()
        })
    },
    getHours (mins) {
      let hours = Math.floor(mins / 60)
      let s = ''
      if (hours > 0) s = hours + ' hour'
      if (hours > 1) s += 's'
      s += ' '
      return s + mins % 60 + ' mins'
    },
    getIcon (name) {
      let icons = {
        where: 'location on',
        when: 'access time',
        duration: 'timer',
        who: 'person',
        user: 'person',
        price: 'attach money',
        endTime: 'stop'
      }
      if (icons[name]) return icons[name]
      return 'crop square'
    },
    share (log, to) {
      let from = this.getUser()
      axios.post(conf.API_LOC + '/api/notifications', {
        user: to,
        actor: from,
        log: log,
        action: 'shared',
        when: Date()
      })
    },
    getUser () {
      if (!LocalStorage.get.item('user')) LocalStorage.set('user', prompt('Name?'))
      return LocalStorage.get.item('user')
    },
    getSettings () {
      if (!LocalStorage.get.item('settings')) {
        LocalStorage.set('settings', { HideNSFW: false, showId: false })
      }
      return LocalStorage.get.item('settings')
    },
    formatDate (date) {
      if (moment(Date()).diff(moment(date)) < 105850000) {
        return moment(date).fromNow()
      }
      return moment(date).format('MMM Do YY, h:mm a')
    },
    first (n, list) {
      return list.slice(0, n)
    },
    isValidDate (str) {
      if (typeof str !== 'string') return false
      var d = moment(str, 'D/M/YYYY')
      if (d == null || !d.isValid()) return false
      return true
    }
  }
}
