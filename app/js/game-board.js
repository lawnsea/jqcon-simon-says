define([
  'flight/component',
  'button'
],
function (
  defineComponent,
  Button
) {
  'use strict';
  var keys = {
    UP: 38,
    DOWN: 40
  };

  function GameBoard() {
    this.defaultAttrs({
      colors: ['red', 'blue', 'yellow', 'green']
    });

    this.after('initialize', function () {
      var $node = this.$node;

      this.attr.colors.forEach(function (color) {
        $node.append('<button data-color="' + color + '"></button>');
      });

      var $buttons = $node.find('button');
      Button.attachTo($buttons);

      $node.on('keyup', function (e) {
        var index = $(e.target).index();

        if (e.which === keys.UP && index > 0) {
          $buttons.eq(index - 1).focus();
        } else if (e.which === keys.DOWN && index < $buttons.length - 1) {
          $buttons.eq(index + 1).focus();
        }
      });
    });
  }

  return defineComponent(GameBoard);
});
