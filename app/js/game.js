define([
  'flight/component',
  'game-board',
  'alert'
],
function (
  defineComponent,
  GameBoard,
  Alert
) {
  'use strict';

  function Game() {
    this.defaultAttrs({
      gameBoardSelector: '.game-board',
      startButtonSelector: '.game-controls .start',
      levelSelector: '.game-controls .level',
      colors: ['red', 'blue', 'yellow', 'green']
    });

    this.after('initialize', function () {
      GameBoard.attachTo(this.$node.find(this.attr.gameBoardSelector), {
        colors: this.attr.colors.slice()
      });
      Alert.attachTo('.alert');

      var startClicks =
        this.$node.find(this.attr.startButtonSelector).
        asEventStream('click').
        map('start');
      startClicks.log('startClicks');

      var activations =
        $(document).asEventStream('activation', function (e, data) {
          return data.color;
        });
      activations.log('activations');
    });
  }

  return defineComponent(Game);
});

