define([
  'flight/component',
  'game-board'
],
function (
  defineComponent,
  GameBoard
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
      level: 3,
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
        this.attr.state = state.LISTENING;
      }
    };

    this.onStartClick = function () {
      var numColors = this.attr.colors.length;

      if (this.attr.state !== state.WAITING) {
        return;
      }

      this.expectedSequence = [];
      for (var i = 0; i < this.attr.level; i++) {
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
      this.attr.level++;
    };

    this.after('initialize', function () {
      GameBoard.attachTo(this.$node.find(this.attr.gameBoardSelector), {
        colors: this.attr.colors.slice()
      });

      this.on('.game-controls .start', 'click', this.onStartClick);
      this.on('activation', this.onActivation);
      this.on('success', this.onSuccess);
    });
  }

  return defineComponent(Game);
});

