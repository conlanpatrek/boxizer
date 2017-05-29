(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('cloop')) :
	typeof define === 'function' && define.amd ? define(['exports', 'cloop'], factory) :
	(factory((global.boxizer = global.boxizer || {}),global.cloop));
}(this, (function (exports,cloop) { 'use strict';

function boxesMatchPosition(e) {
  return e.from.x === e.to.x && e.from.y === e.to.y
}

function boxesMatchSize(e) {
  return e.from.width === e.to.width && e.from.height === e.to.height
}

function BoundingBoxSubscription(element) {
  this._box = element.getBoundingClientRect();
  this.element = element;
  this.handlers = {
    size: [],
    position: []
  };
}

BoundingBoxSubscription.prototype.addHandler = function addHandler(handler, options) {
  if (options && options.hasOwnProperty('size') ? options.size : true) {
    this.handlers.size.push(handler);
  }

  if (options && options.hasOwnProperty('position') ? options.position : false) {
    this.handlers.position.push(handler);
  }
};

BoundingBoxSubscription.prototype.removeHandler = function removeHandler(handler) {
  this.handlers.size = this.handlers.size.filter(function(h) { return h !== handler });
  this.handlers.position = this.handlers.position.filter(function(h) { return h !== handler });
};

BoundingBoxSubscription.prototype.empty = function empty() {
  return this.handlers.size.length === 0 && this.handlers.position.length === 0
};

BoundingBoxSubscription.prototype.check = function check() {
  var _box = this.element.getBoundingClientRect();
  var eventData = {
    element: this._element,
    to: _box,
    from: this._box
  };

  if (this.handlers.size.length && boxesMatchSize(eventData) === false) {
    for (var i = 0; i < this.handlers.size.length; i++) {
      this.handlers.size[i](eventData);
    }
  }

  if (this.handlers.position.length && boxesMatchPosition(eventData) === false) {
    for (var i = 0; i < this.handlers.position.length; i++) {
      this.handlers.position[i](eventData);
    }
  }

  this._box = _box;
};

var MAX_CHECKS_PER_FRAME = 1024;

function Boxizer ({ frameLimit = MAX_CHECKS_PER_FRAME } = {}) {
  this._subscriptions = [];
  this._frameLimit = frameLimit;
  this._numChunks = 1;
  this._frame = 0;
  this.tick = this.tick.bind(this);
}

Boxizer.prototype.subscribe = function subscribe(element, handler, options) {
  var subscription = this._subscriptions.find(function (sub) { return sub.element === element });
  if (!subscription) {
    subscription = new BoundingBoxSubscription(element);
    this._subscriptions.push(subscription);
  }

  subscription.addHandler(handler, options);

  this._numChunks = Math.ceil(this._subscriptions.length / this._frameLimit);
  if (!this._unloop) {
    this._unloop = cloop.loop(this.tick);
  }
  return this.unsubscribe.bind(this, subscription, handler)
};

Boxizer.prototype.unsubscribe = function unsubscribe(element, handler) {
  var subscription = element instanceof BoundingBoxSubscription ? element : this._subscriptions.find(function(sub) { return sub.element === element });
  if (subscription) {
    subscription.removeHandler(handler);
    if (subscription.empty()) {
      this._subscriptions = this._subscriptions.filter(function (sub) { return sub !== subscription });
    }
  }

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

function subscribe(element, handler, options) {
  return getInstance().subscribe(element, handler, options)
}

function unsubscribe(element, handler) {
  return getInstance().unsubscribe(element, handler)
}

exports.Boxizer = Boxizer;
exports.subscribe = subscribe;
exports.unsubscribe = unsubscribe;

Object.defineProperty(exports, '__esModule', { value: true });

})));
