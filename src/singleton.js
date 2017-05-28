import { Boxizer } from './Boxizer'

var singleton
function getInstance() {
  if (!singleton) {
    singleton = new Boxizer()
  }
  return singleton
}

export function subscribe(element, cb) {
  return getInstance().subscribe(element, cb)
}
