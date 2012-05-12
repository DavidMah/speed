var GAME;

$(document).ready(function() {
  var canvas = $('#game_canvas')[0];
  GAME = new Game(canvas);
  GAME.newRocket();
  Ticker.addListener(window);
});

function tick() {
  GAME.update();
  GAME.draw();
}