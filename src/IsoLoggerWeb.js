var defaultOps = {
  url: '/log',
  contentType: 'application/json; charset=utf-8',
  stringify: JSON.stringify,
  jQuery: (typeof window !== 'undefined') ? window.jQuery : null,
  method: 'POST',
  interval: 10 * 1000,
  enabled: true
};

function AjaxJQueryOutput(opts) {
  opts = opts || {};

  this.url = opts.url || defaultOps.url;
  this.contentType = opts.contentType || defaultOps.contentType;
  this.stringify = opts.stringify || defaultOps.stringify;
  this.jQuery = opts.jQuery || defaultOps.jQuery;
  this.method = opts.method || defaultOps.method;
  this.interval = opts.interval || defaultOps.interval;

  this.cache = [];
  this.currentPayload = [];
  this.timer = null;
  this.timerMultiplier = 1;

  this.enabled = (typeof opts.enabled !== 'undefined') ? opts.enabled : defaultOps.enabled;
}

AjaxJQueryOutput.prototype.enable = function enable() {
  this.enabled = true;
  this._startTimer();
};

AjaxJQueryOutput.prototype.disable = function enable() {
  this.enabled = false;
  this._stopTimer();
};

AjaxJQueryOutput.prototype._startTimer = function _startTimer() {
  if (this.enabled && !this.timer && this.cache.length > 0) {
    this.timer = setTimeout(this._onTimer.bind(this), this.interval * this.timerMultiplier);
  }
};

AjaxJQueryOutput.prototype._stopTimer = function _startTimer() {
  if (this.timer) {
    clearTimeout(this.timer);
    this.timer = null;
  }
};

AjaxJQueryOutput.prototype.consume = function receive(logEvent) {
  this.cache.push(logEvent);

  if (this.enabled) {
    this._startTimer();
  }
};

AjaxJQueryOutput.prototype._onTimer = function _onTimer() {
  this.timer = null;

  if (this.enabled && this.cache.length > 0 && this.jQuery) {
    this.currentPayload = this.currentPayload.concat(this.cache);
    this.cache = [];

    var data = this.stringify({
      logs: this.currentPayload
    });

    var self = this;

    this.jQuery.ajax({
      type: this.method,
      data: data,
      url: this.url,
      contentType: this.contentType,
      timeout: 10 * 1000,
      cache: false,
      processData: false
    }).success(function () {
      self.currentPayload = [];
      self.timerMultiplier = 1;
    }).error(function () {
      // back off exponentially
      self.timerMultiplier *= 2;
    }).always(function () {
      self._startTimer();
    });
  }
};

module.exports = {
  AjaxJQueryOutput: AjaxJQueryOutput
};
