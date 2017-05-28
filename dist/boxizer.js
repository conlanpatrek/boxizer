(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.boxizer = global.boxizer || {})));
}(this, (function (exports) { 'use strict';

// Adapted from the Paul Irish gist at https://gist.github.com/paulirish/1579671
// MIT license
var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
var raf = window.requestAnimationFrame;
var caf = window.cancelAnimationFrame;

for (var i = 0; i < vendors.length && (!raf || !caf); i++) {
  raf = window[vendors[i] + 'RequestAnimationFrame'];
  caf = window[vendors[i] + 'CancelAnimationFrame'] ||
    window[vendors[i] + 'CancelRequestAnimationFrame'];
}

var now = Date.now || function () { return new Date().getTime() };

if (!raf || !caf) {
  raf = function (callback) {
    var currTime = now();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    lastTime = currTime + timeToCall;
    return window.setTimeout(
      function() { callback(lastTime); },
      timeToCall
    )
  };

  caf = function(id) { clearTimeout(id); };
} else {
  raf = raf.bind(window);
  caf = caf.bind(window);
}

function onFrame (cb) {
  var id = raf(cb);
  return function () { caf(id); }
}

function Looper () {
  this._handlers = [];
  this._last = now();
  this._now = this._last;
  this._hasSetNextFrame = false;
  this._cancelNextFrame = null;

  this.loop = this.loop.bind(this);
  this.nextFrame();
}

Looper.prototype.loop = function loop () {
  this._now = now();
  var delta = this._now - this._last;
  for (var i = 0; i < this._handlers.length; i++) {
    this._handlers[i](delta);
  }
  this._last = this._now;
  this._hasSetNextFrame = false;
  this.nextFrame();
};

Looper.prototype.nextFrame = function nextFrame () {
  if (this._handlers.length && this._hasSetNextFrame === false) {
    this._hasSetNextFrame = true;
    this._cancelNextFrame = onFrame(this.loop);
  }
};

Looper.prototype.clearNextFrame = function clearNextFrame () {
  this._cancelNextFrame && this._cancelNextFrame();
};

Looper.prototype.addHandler = function addHandler (handler) {
  this._handlers.push(handler);
  this.nextFrame();
  return this.removeHandler.bind(this, handler)
};

Looper.prototype.removeHandler = function removeHandler (handler) {
  this._handlers = this._handlers.filter(function(h) { return h !== handler });
  if (this._handlers.length === 0) {
    this.clearNextFrame();
  }
};

var singleton;
function getInstance() {
  if (!singleton) {
    singleton = new Looper();
  }
  return singleton
}

function loop(cb) {
  return getInstance().addHandler(cb)
}

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

BoundingBoxWatcher.check = function check() {
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

var singleton$1;
function getInstance$1() {
  if (!singleton$1) {
    singleton$1 = new Boxizer$1();
  }
  return singleton$1
}

function subscribe(element, cb) {
  return getInstance$1().subscribe(element, cb)
}

exports.Boxizer = Boxizer;
exports.subscribe = subscribe;

Object.defineProperty(exports, '__esModule', { value: true });

})));
