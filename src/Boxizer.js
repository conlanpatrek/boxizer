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

Boxizer.prototype.subscribe = function subscribe(element, handler, options) {
  let subscription = this._subscriptions.find(function (sub) { return sub.element === element })
  if (!subscription) {
    subscription = new BoundingBoxSubscription(element)
    this._subscriptions.push(subscription)
  }

  subscription.addHandler(handler, options)

  this._numChunks = Math.ceil(this._subscriptions.length / this._frameLimit)
  if (!this._unloop) {
    this._unloop = loop(this.tick)
  }
  return this.unsubscribe.bind(this, subscription, handler)
}

Boxizer.prototype.unsubscribe = function unsubscribe(element, handler) {
  var subscription = element instanceof BoundingBoxSubscription ? element : this._subscriptions.find(function(sub) { return sub.element === element })
  if (subscription) {
    subscription.removeHandler(handler)
    if (subscription.empty()) {
      this._subscriptions = this._subscriptions.filter(function (sub) { return sub !== subscription })
    }
  }

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
