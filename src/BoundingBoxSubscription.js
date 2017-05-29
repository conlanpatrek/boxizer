function boxesMatchPosition(e) {
  return e.from.x === e.to.x && e.from.y === e.to.y
}

function boxesMatchSize(e) {
  return e.from.width === e.to.width && e.from.height === e.to.height
}

export function BoundingBoxSubscription(element) {
  this._box = element.getBoundingClientRect()
  this.element = element
  this.handlers = {
    size: [],
    position: []
  }
}

BoundingBoxSubscription.prototype.addHandler = function addHandler(handler, options) {
  if (options && options.hasOwnProperty('size') ? options.size : true) {
    this.handlers.size.push(handler)
  }

  if (options && options.hasOwnProperty('position') ? options.position : false) {
    this.handlers.position.push(handler)
  }
}

BoundingBoxSubscription.prototype.removeHandler = function removeHandler(handler) {
  this.handlers.size = this.handlers.size.filter(function(h) { return h !== handler })
  this.handlers.position = this.handlers.position.filter(function(h) { return h !== handler })
}

BoundingBoxSubscription.prototype.empty = function empty() {
  return this.handlers.size.length === 0 && this.handlers.position.length === 0
}

BoundingBoxSubscription.prototype.check = function check() {
  var _box = this.element.getBoundingClientRect()
  var eventData = {
    element: this._element,
    to: _box,
    from: this._box
  }

  if (this.handlers.size.length && boxesMatchSize(eventData) === false) {
    for (var i = 0; i < this.handlers.size.length; i++) {
      this.handlers.size[i](eventData)
    }
  }

  if (this.handlers.position.length && boxesMatchPosition(eventData) === false) {
    for (var i = 0; i < this.handlers.position.length; i++) {
      this.handlers.position[i](eventData)
    }
  }

  this._box = _box
}
