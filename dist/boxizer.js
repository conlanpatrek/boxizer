(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('cloop')) :
	typeof define === 'function' && define.amd ? define(['exports', 'cloop'], factory) :
	(factory((global.boxizer = global.boxizer || {}),global.cloop));
}(this, (function (exports,cloop) { 'use strict';

function boxesMatchExact(a, b) {
  return a.left === b.left && a.top === b.top && a.bottom === b.bottom && a.right === b.right
}

function boxesMatchSize(a, b) {
  return a.width === b.width && a.height === b.height
}

function BoundingBoxSubscription(element, handler, exact = false) {
  this._box = element.getBoundingClientRect();
  this._element = element;
  this._handler = handler;
  this._exact = exact;
}

BoundingBoxSubscription.prototype.check = function check() {
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

var MAX_CHECKS_PER_FRAME = 1028;

function Boxizer ({ frameLimit = MAX_CHECKS_PER_FRAME } = {}) {
  this._subscriptions = [];
  this._frameLimit = frameLimit;
  this._numChunks = 1;
  this._frame = 0;
  this.tick = this.tick.bind(this);
}

Boxizer.prototype.subscribe = function subscribe(element, handler, exact = false) {
  this._subscriptions.push(new BoundingBoxSubscription(element, handler, exact));
  this._numChunks = Math.ceil(this._subscriptions.length / this._frameLimit);
  if (!this._unloop) {
    this._unloop = cloop.loop(this.tick);
  }
  return this.removeHandler.bind(this, handler)
};

Boxizer.prototype.removeHandler = function removeHandler(handler) {
  this._subscriptions = this._subscriptions.filter(function(sub) { return sub._handler !== handler });
  this._numChunks = Math.ceil(this._subscriptions.length / this._frameLimit);
  if (this._subscriptions.length === 0 && this._unloop) {
    this._unloop();
    this._unloop = null;
  }
};

Boxizer.prototype.tick = function tick() {
  for (var i = this._frame; i < this._subscriptions.length; i += this._numChunks) {
    this._subscriptions[i].check();
  }
  this._frame = (this._frame + 1) % this._numChunks;
};

var singleton;
function getInstance() {
  if (!singleton) {
    singleton = new Boxizer();
  }
  return singleton
}

function subscribe(element, cb) {
  return getInstance().subscribe(element, cb)
}

exports.Boxizer = Boxizer;
exports.subscribe = subscribe;

Object.defineProperty(exports, '__esModule', { value: true });

})));
