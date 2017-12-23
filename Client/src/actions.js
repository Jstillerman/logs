import mixin from './mixins'

let actions = [
  {icon: 'fa-cutlery', text: 'I ate...', action: 'ate', color: 'green', extraOpts: {pointColor: 'blue'}},
  {icon: 'fa-eye', text: 'I saw...', color: 'blue', action: 'saw'},
  {icon: 'fa-shopping-cart', text: 'I bought...', color: 'red', action: 'bought', additionalFields: ['price']},
  {icon: 'fa-briefcase', text: 'I worked on...', color: 'purple', action: 'worked on', ongoing: true},
  {icon: 'fa-sticky-note', text: 'New Journal Entry', color: 'orange', action: 'wrote', what: 'a note', data: true},
  {icon: 'fa-comments', text: 'I talked to...', color: 'blue', action: 'talked to'},
  {icon: 'fa-tree', nsfw: 'true', text: 'I smoked...', color: 'brown', action: 'smoked'},
  {icon: 'fa-male', text: 'I tested (Athletic)...', color: 'green', action: 'performed', what: '20 pushups'},
  {icon: 'fa-heart-o', text: 'I experienced', color: 'purple', action: 'experienced', additionalFields: ['intensity']},
  {icon: 'fa-shower', text: 'I took a shower', color: 'blue', action: 'took a shower', where: 'bathroom', ongoing: true, noWhat: true},
  {icon: 'fa-tv', text: 'I started watching', action: 'watched', color: 'brown', ongoing: true},
  {icon: 'fa-bus', text: 'I rode', action: 'rode', what: 'the bus', color: 'orange', ongoing: true, additionalFields: ['destination']},
  {icon: 'fa-hand-paper-o', nsfw: true, text: 'I copped', action: 'copped', color: 'red', additionalFields: ['price']},
  {icon: 'fa-cloud', text: 'I had an idea', action: 'thought', color: 'green', noWhat: true},
  {icon: 'fa-book', text: 'I learned...', action: 'learned', color: 'pink'},
  {icon: 'fa-paw', text: 'I walked...', action: 'walked', color: 'brown', ongoing: true},
  {icon: 'fa-bed', text: 'I got in bed', action: 'got in bed', color: 'blue', ongoing: true},
  {icon: 'fa-gamepad', text: 'I started gaming', action: 'played', color: 'red', ongoing: true}
]

function getActions () {
  if (mixin.methods.getSettings().HideNSFW) {
    return actions.filter(act => !act.nsfw)
  }
  return actions
}

export default {
  getActions
}
