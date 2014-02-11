define([
  'flight/component'
],
function (
  defineComponent
) {
  'use strict';

  function Alert() {
    this.defaultAttrs({
      color: 'black',
      duration: 500,
      delay: 100,
      alerts: [],
      alerting: false,
      fontSize: '4em'
    });

    this.afterAlert = function () {
      this.trigger('alert-complete');

      if (this.attr.alerts.length > 0) {
        setTimeout(this.alert.bind(this), this.attr.delay);
      } else {
        this.$node.hide();
        this.attr.alerting = false;
      }
    };

    this.alert = function () {
      var alert = this.attr.alerts.shift();

      this.attr.alerting = true;
      this.$node.text(alert.message).
        css('color', alert.color).
        css('opacity', 1.0).
        css('fontSize', this.attr.fontSize).
        show().
        animate({
          opacity: 0,
          fontSize: '12em'
        }, alert.duration, this.afterAlert.bind(this));
    };

    this.onAlert = function (e, data) {
      this.attr.alerts.push({
        message: data.message,
        color: data.color || this.attr.color,
        duration: data.duration || this.attr.duration
      });

      if (!this.attr.alerting) {
        this.alert();
      }
    };

    this.after('initialize', function () {
      this.on(document, 'alert', this.onAlert);
    });
  }

  return defineComponent(Alert);
});

