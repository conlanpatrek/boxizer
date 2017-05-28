import { loop } from 'cloop';

function boxesMatchExact(a, b) {
  return a.left === b.left && a.top === b.top && a.bottom === b.bottom && a.right === b.right
}

function boxesMatchSize(a, b) {
  return a.width === b.width && a.height === b.height
}

function BoundingBoxWatcher(element, handler, exact = false) {
  this._box = element.getBoundingClientRect();
  this._element = element;
  this._handler = handler;
  this._exact = exact;
}

BoundingBoxWatcher.prototype.check = function check() {
  var _box = this._element.getBoundingClientRect();
  var boxesMatch = this._exact ? boxesMatchExact : boxesMatchSize;
  if (boxesMatch(_box, this._box) === false) {
    this._handler({
      element: this._element,
      to: _box,
      from: this._box
    });
  }
  this._box = _box;
};

function Boxizer ({ numChunks = 1 } = {}) {
  this._subscriptions = [];
  this._numChunks = numChunks;
  this._frame = 0;
  this.tick = this.tick.bind(this);
}

Boxizer.prototype.subscribe = function subscribe(element, handler, exact = false) {
  this._subscriptions.push(new BoundingBoxWatcher(element, handler, exact));
  if (!this._unloop) {
    this._unloop = loop(this.tick);
  }
  return this.removeHandler.bind(this, handler)
};

Boxizer.prototype.removeHandler = function removeHandler(handler) {
  this._subscriptions.filter(function(h) { return w._handler !== handler });
  if (this._subscriptions.length === 0 && this._unloop) {
    this._unloop();
    this._unloop = null;
  }
};

Boxizer.prototype.tick = function tickBoxizer() {
  let f = this._frame;
  for (var i = 0; i < this._subscriptions.length; i++) {
    ++f;
    if (f % this._numChunks === 0) {
      this._subscriptions[i].check();
    }
    this._frame = (this._frame + 1) % this._numChunks;
  }
};

function Boxizer$1 ({ numChunks = 1 } = {}) {
  this._subscriptions = [];
  this._numChunks = numChunks;
  this._frame = 0;
  this.tick = this.tick.bind(this);
}

Boxizer$1.prototype.subscribe = function subscribe(element, handler, exact = false) {
  this._subscriptions.push(new BoundingBoxWatcher(element, handler, exact));
  if (!this._unloop) {
    this._unloop = loop(this.tick);
  }
  return this.removeHandler.bind(this, handler)
};

Boxizer$1.prototype.removeHandler = function removeHandler(handler) {
  this._subscriptions.filter(function(h) { return w._handler !== handler });
  if (this._subscriptions.length === 0 && this._unloop) {
    this._unloop();
    this._unloop = null;
  }
};

Boxizer$1.prototype.tick = function tickBoxizer() {
  let f = this._frame;
  for (var i = 0; i < this._subscriptions.length; i++) {
    ++f;
    if (f % this._numChunks === 0) {
      this._subscriptions[i].check();
    }
    this._frame = (this._frame + 1) % this._numChunks;
  }
};

var singleton;
function getInstance() {
  if (!singleton) {
    singleton = new Boxizer$1();
  }
  return singleton
}

function subscribe(element, cb) {
  return getInstance().subscribe(element, cb)
}

export { Boxizer, subscribe };
