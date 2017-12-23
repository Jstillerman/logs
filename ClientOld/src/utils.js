import moment from 'moment'

export default {
  sortByDate (events) {
    console.log('SORT BY DATE');
    return events.sort((a, b) => {
      if(moment(a.when).isBefore(b.when)) return -1
      if(moment(a.when).isAfter(b.when)) return 1
      if(moment(a.then).isSame(b.when)) return 0
    })
  }
}
