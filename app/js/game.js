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
      colors: ['red', 'blue', 'yellow', 'green'],
      level: 1,
      levelDelta: 2,
      sequenceDelay: 1000
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
          return e.target !== this.node ? data.color : null;
        }.bind(this)).
        filter(function (val) {
          return val !== null;
        });
      activations.log('activations');

      function randomSample(count, source) {
        var result = [];

        for (var i = 0; i < count; i++) {
          result.push(source[Math.floor(Math.random() * source.length)]);
        }

        return result;
      }

      var gameState = startClicks.merge(activations).
        withStateMachine([], function (state, event) {
          var value = event.value();
          var events = [];
          var expected;

          switch (value) {
            case 'start':
              if (state.length < 1) {
                // start a new sequence
                state = randomSample(
                  this.attr.level + this.attr.levelDelta,
                  this.attr.colors);

                events.push(new Bacon.Next({
                  what: 'start',
                  data: state.slice()
                }));
              }
              break;
            default:
              if (state.length < 1) {
                break;
              }

              expected = state.shift();

              if (expected === value) {
                if (state.length < 1) {
                  events.push(new Bacon.Next({
                    what: 'win'
                  }));
                }
              } else {
                events.push(new Bacon.Next({
                  what: 'lose',
                  data: {
                    expected: expected,
                    actual: value
                  }
                }));
                state = [];
              }
          }

          return [state, events];
        }.bind(this));

      gameState.
        filter(function (e) {
          return e.what === 'start';
        }).
        map('.data').
        flatMap(Bacon, 'sequentially', this.attr.sequenceDelay).
        map(function (color) {
          return {
            color: color
          };
        }).onValue(this, 'trigger', 'activation');

      gameState.log();
    });
  }

  return defineComponent(Game);
});

