import { loop } from 'cloop'
import { BoundingBoxWatcher } from './BoundingBoxWatcher'

export function Boxizer ({ numChunks = 1 } = {}) {
  this._subscriptions = []
  this._numChunks = numChunks
  this._frame = 0
  this.tick = this.tick.bind(this)
}

Boxizer.prototype.subscribe = function subscribe(element, handler, exact = false) {
  this._subscriptions.push(new BoundingBoxWatcher(element, handler, exact))
  if (!this._unloop) {
    this._unloop = loop(this.tick)
  }
  return this.removeHandler.bind(this, handler)
}

Boxizer.prototype.removeHandler = function removeHandler(handler) {
  this._subscriptions.filter(function(h) { return w._handler !== handler })
  if (this._subscriptions.length === 0 && this._unloop) {
    this._unloop()
    this._unloop = null
  }
}

Boxizer.prototype.tick = function tickBoxizer() {
  let f = this._frame
  for (var i = 0; i < this._subscriptions.length; i++) {
    ++f
    if (f % this._numChunks === 0) {
      this._subscriptions[i].check()
    }
    this._frame = (this._frame + 1) % this._numChunks
  }
}
