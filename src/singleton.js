import { Boxizer } from './Boxizer'

var singleton
function getInstance() {
  if (!singleton) {
    singleton = new Boxizer()
  }
  return singleton
}

export function subscribe(element, handler, options) {
  return getInstance().subscribe(element, handler, options)
}

export function unsubscribe(element, handler) {
  return getInstance().unsubscribe(element, handler)
}
