import { loop } from 'cloop'
import { BoundingBoxSubscription } from './BoundingBoxSubscription'

var MAX_CHECKS_PER_FRAME = 1028

export function Boxizer ({ frameLimit = MAX_CHECKS_PER_FRAME } = {}) {
  this._subscriptions = []
  this._frameLimit = frameLimit
  this._numChunks = 1
  this._frame = 0
  this.tick = this.tick.bind(this)
}

Boxizer.prototype.subscribe = function subscribe(element, handler, exact = false) {
  this._subscriptions.push(new BoundingBoxSubscription(element, handler, exact))
  this._numChunks = Math.ceil(this._subscriptions.length / this._frameLimit)
  if (!this._unloop) {
    this._unloop = loop(this.tick)
  }
  return this.removeHandler.bind(this, handler)
}

Boxizer.prototype.removeHandler = function removeHandler(handler) {
  this._subscriptions = this._subscriptions.filter(function(sub) { return sub._handler !== handler })
  this._numChunks = Math.ceil(this._subscriptions.length / this._frameLimit)
  if (this._subscriptions.length === 0 && this._unloop) {
    this._unloop()
    this._unloop = null
  }
}

Boxizer.prototype.tick = function tick() {
  for (var i = this._frame; i < this._subscriptions.length; i += this._numChunks) {
    this._subscriptions[i].check()
  }
  this._frame = (this._frame + 1) % this._numChunks
}
