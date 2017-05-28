function boxesMatchExact(a, b) {
  return a.left === b.left && a.top === b.top && a.bottom === b.bottom && a.right === b.right
}

function boxesMatchSize(a, b) {
  return a.width === b.width && a.height === b.height
}

export function BoundingBoxSubscription(element, handler, exact = false) {
  this._box = element.getBoundingClientRect()
  this._element = element
  this._handler = handler
  this._exact = exact
}

BoundingBoxSubscription.prototype.check = function check() {
  var _box = this._element.getBoundingClientRect()
  var boxesMatch = this._exact ? boxesMatchExact : boxesMatchSize
  if (boxesMatch(_box, this._box) === false) {
    this._handler({
      element: this._element,
      to: _box,
      from: this._box
    })
  }
  this._box = _box
}
