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

  var state = [
      'waiting',
      'emitting',
      'listening'
    ].reduce(function (states, state) {
      states[state.toUpperCase()] = state;

      return states;
    }, {});

  function Game() {
    this.defaultAttrs({
      gameBoardSelector: '.game-board',
      colors: ['red', 'blue', 'yellow', 'green'],
      sequence: [],
      expectedSequence: [],
      delay: 1000,
      level: 1,
      levelDelta: 2,
      startButtonSelector: '.game-controls .start',
      levelSelector: '.game-controls .level',
      state: state.WAITING
    });

    this.emitSequence = function () {
      var sequence = this.attr.sequence;
      var color = this.attr.colors[sequence.pop()];

      this.trigger('activation', {
        color: color
      });
      this.expectedSequence.push(color);

      if (sequence.length > 0) {
        setTimeout(this.emitSequence.bind(this), this.attr.delay);
      } else {
        this.expectedSequence.reverse();
        setTimeout(this.trigger.bind(this, 'alert', {
          message: 'Go!'
        }), this.attr.delay);
        this.attr.state = state.LISTENING;
      }
    };

    this.onStartClick = function () {
      var numColors = this.attr.colors.length;

      if (this.attr.state !== state.WAITING) {
        return;
      }

      var len = this.attr.level + this.attr.levelDelta;
      this.expectedSequence = [];
      for (var i = 0; i < len; i++) {
        this.attr.sequence.push(Math.floor(Math.random() * numColors));
      }

      this.attr.state = state.EMITTING;
      this.emitSequence();
    };

    this.onActivation = function (e, data) {
      if (this.attr.state !== state.LISTENING) {
        return;
      }

      var expected = this.expectedSequence.pop();

      if (data.color !== expected) {
        this.trigger('failure', {
          expected: expected,
          actual: data.color
        });
        this.attr.state = state.WAITING;
      }

      if (this.expectedSequence.length === 0) {
        this.trigger('success');
        this.attr.state = state.WAITING;
      }
    };

    this.onSuccess = function () {
      this.setLevel(this.attr.level + 1);

      this.trigger('alert', {
        message: 'Correct!',
        color: 'green',
        duration: 750
      });
    };

    this.onFailure = function (e, data) {
      this.trigger('alert', {
        message: 'Wrong!\n' +
          'Expected\n' +
          data.expected[0].toUpperCase() +
          data.expected.slice(1),
        color: 'red',
        duration: 1000
      });
    };

    this.setLevel = function (level) {
      this.attr.level = level;
      this.$node.find(this.attr.levelSelector).text('Level ' + level);
    };

    this.after('initialize', function () {
      GameBoard.attachTo(this.$node.find(this.attr.gameBoardSelector), {
        colors: this.attr.colors.slice()
      });
      Alert.attachTo('.alert');

      this.on(this.attr.startButtonSelector, 'click', this.onStartClick);
      this.on('activation', this.onActivation);
      this.on('success', this.onSuccess);
      this.on('failure', this.onFailure);

      this.setLevel(this.attr.level);
    });
  }

  return defineComponent(Game);
});

