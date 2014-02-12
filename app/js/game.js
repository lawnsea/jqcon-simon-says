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
    });
  }

  return defineComponent(Game);
});

