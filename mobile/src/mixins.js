import conf from './config'
import axios from 'axios'
import moment from 'moment'

export default {
  methods: {
    del (log) {
      axios.delete(conf.API_LOC + '/api/logs/' + log._id)
    },
    end (log) {
      axios.get(conf.API_LOC + '/api/logs/' + log._id + '/end')
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
    formatDate (date) {
      if (moment(Date()).diff(moment(date)) < 105850000) {
        return moment(date).fromNow()
      }
      return moment(date).format('MMM Do YY, h:mm a')
    }
  }
}
