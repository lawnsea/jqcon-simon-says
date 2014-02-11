define([
  'flight/component'
],
function (
  defineComponent
) {
  'use strict';
  var KEY_UP = 38;
  var KEY_DOWN = 40;

  function Button() {
    this.onClick = function () {
      this.trigger('activation', {
        color: this.attr.color
      });
    };

    this.onActivation = function (e, data) {
      var $node = this.$node;

      if (data.color === this.attr.color) {
        $node.animate({
          backgroundColor: $.Color({ saturation: 1 })
        }, 500, function () {
          $node.animate({
            backgroundColor: $.Color({ saturation: 0.5 })
          }, 500);
        });
      }
    };

    this.after('initialize', function () {
      this.attr.color = this.$node.data('color');
      this.$node.
        css('background-color', $.Color(this.attr.color).saturation(0.5));

      this.$node.
        text(this.attr.color[0].toUpperCase() + this.attr.color.slice(1));

      this.on('click', this.onClick);
      this.on(document, 'activation', this.onActivation);
    });
  }

  return defineComponent(Button);
});
