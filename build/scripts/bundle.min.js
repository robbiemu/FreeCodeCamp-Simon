'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
  function Game(uic, audio) {
    _classCallCheck(this, Game);

    this.uic = uic;
    this.audio = audio;
    this.uiMap = {
      red: 0,
      green: 1,
      amarillo: 2,
      blue: 3
    };
    this.dexUi = ['red', 'green', 'amarillo', 'blue'];
    this.states = ['SHOWINGCHALLENGE', 'LISTENING'];
    this.winState = { moves: 20 };
    this.moves = [];
    this.playerMoves = [];
    this.gameStack = [];
    this.inGame = false;
    this.gameState = new Proxy({}, { set: this.uic.toggleGameState });
    this.gameState.strict = false;
    _.bindAll(this, ['start', 'restart', 'playMoves', 'move', 'chooseAtRandom', 'try', 'roundDone']);
  }

  _createClass(Game, [{
    key: 'start',
    value: function start() {
      this.inGame = true;
      this.gameStack.push(setTimeout(this.move, parseInt((Math.random() + 1) * 1000)));
    }
  }, {
    key: 'restart',
    value: function restart() {
      this.moves = [];
      this.playerMoves = [];
      this.gameStack.forEach(function (a) {
        clearTimeout(a);
      });
      this.gameStack = [];
      this.inGame = false;
    }
  }, {
    key: 'playMoves',
    value: function playMoves() {
      var _this = this;

      var self = this;
      var elf = this.uic;
      var audio = this.audio;

      this.gameState.now = 'SHOWINGCHALLENGE';

      var pause = 0;
      this.moves.forEach(function (m, i) {
        var play_move = i === self.moves.length - 1 ? function () {
          elf.animate(m);audio.play(m);self.gameState.now = 'LISTENING';
        } : function () {
          elf.animate(m);audio.play(m);
        };
        _this.gameStack.push(setTimeout(play_move, pause += parseInt((Math.random() + 1) * 750)));
      });
    }
  }, {
    key: 'move',
    value: function move() {
      var move = this.chooseAtRandom();
      this.moves.push(move);
      this.playMoves();
    }
  }, {
    key: 'chooseAtRandom',
    value: function chooseAtRandom() {
      return this.dexUi[parseInt(Math.random() * 4)];
    }
  }, {
    key: 'try',
    value: function _try(uiId) {
      var i = this.playerMoves.length;
      this.playerMoves.push(uiId);

      console.log('[Game] trying %s', uiId);
      console.dir([this.playerMoves.slice(), this.moves.slice(), this.playerMoves[i] === this.moves[i]]);

      return this.playerMoves[i] === this.moves[i];
    }
  }, {
    key: 'roundDone',
    value: function roundDone() {
      var self = this;
      if (this.moves.length !== this.playerMoves.length) return false;
      return !this.moves.some(function (m, i) {
        return self.playerMoves[i] !== m;
      });
    }
  }]);

  return Game;
}();

$(function () {
  var uic = new UIController();
  var simonAudio = new SimonAudio();
  var game = new Game(uic, simonAudio);

  $('#replay, .non-strict').toggleClass('disabled');

  $('#strict').click(function () {
    game.gameState.strict = !game.gameState.strict;
    $(this).toggleClass('toggled');
  });

  $('#restart').click(function () {
    $('.controls .button').removeClass('disabled toggled');
    $('.game-buttons > div').addClass('disabled');
    game.restart();
  });

  $('#replay').click(function () {
    uic.clear();
    game.playMoves();
  });

  $('#start').click(function () {
    if (Game.inGame) return;

    $(this).addClass('toggled');

    $('#strict').addClass('disabled');
    $('.game-buttons > div').removeClass('disabled');

    $('#replay, .non-strict').toggleClass('disabled');

    game.start();
  });

  $('.game-buttons > div').hover(function () {
    if (!$(this).hasClass('disabled')) return;
    $(".controls > div").toggleClass('highlight');
  });

  $('.game-buttons > div').addClass('disabled').click(function () {
    if ($(this).hasClass('disabled')) return;
    var id = $(this).attr('id');

    if (game.try(id)) {
      uic.animate(id);
      game.audio.play(id);
    } else {
      game.audio.play('fail');
      game.playerMoves = [];
      $('#replay').addClass('highlight').delay(1000).queue(function () {
        $(this).removeClass('highlight').dequeue();
      });
      return true;
    }
    if (game.roundDone()) {
      if (game.winState.moves === game.playerMoves.length) {
        game.audio.play('win');
        $('#restart').click();
      } else {
        game.playerMoves = [];
        game.move();
      }
    }
  });
});

var SimonAudio = function () {
  function SimonAudio() {
    _classCallCheck(this, SimonAudio);

    this.soundsrcs = ['https://s3.amazonaws.com/freecodecamp/simonSound1.mp3', 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3', 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3', 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3', 'https://www.soundjay.com/misc/fail-buzzer-01.mp3', 'http://soundbible.com/grab.php?id=1700&type=mp3'];
    this.players = this.soundsrcs.map(function (s) {
      var a = document.createElement('audio');
      a.setAttribute('src', s);
      return a;
    });

    this.players[4].volume = 0.1;

    this.uiMap = {
      red: 0,
      green: 1,
      amarillo: 2,
      blue: 3,
      fail: 4,
      win: 5
    };

    _.bind(this.play, this);
  }

  _createClass(SimonAudio, [{
    key: 'play',
    value: function play(uiId) {
      this.players[this.uiMap[uiId]].play();
    }
  }]);

  return SimonAudio;
}();

var UIController = function () {
  function UIController() {
    _classCallCheck(this, UIController);

    this.animation_stack = [];
    _.bindAll(this, ['clear', 'animate', 'toggleGameState']);
  }

  _createClass(UIController, [{
    key: 'clear',
    value: function clear() {
      this.animation_stack.forEach(function (a) {
        return clearTimeout(a);
      });
      this.animation_stack = [];
    }
  }, {
    key: 'animate',
    value: function animate(uiId) {
      $('#' + uiId).addClass('highlight');
      this.animation_stack.push(setTimeout(function () {
        $('#' + uiId).removeClass('highlight');
      }, 333));
    }
  }, {
    key: 'toggleGameState',
    value: function toggleGameState(target, prop, value, receiver) {
      console.log("called: " + prop + " = " + value);
      if (prop[0] === '_') throw new Error('Invalid attempt to set private "' + prop + '" property');

      target[prop] = value;

      if (prop === 'now' && !target.strict) $('#replay, .non-strict').toggleClass('disabled');

      return true;
    }
  }]);

  return UIController;
}();