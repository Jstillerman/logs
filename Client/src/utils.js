import moment from 'moment'

export default {
  sortByDate (events) {
    return events.sort((a, b) => {
      return moment.utc(a.when).diff(moment.utc(b.when))
    })
  }

}
