var GAME;

$(document).ready(function() {
  var canvas = $('#game_canvas')[0];
  GAME = new Game(canvas);
  Ticker.setFPS(60);
  Ticker.addListener(window);
  GAME.newGame([
    {
      x: 20,
      y: 20,
      radius: 100
    },
    {
      x: 400,
      y: 200,
      radius: 150
    }
  ], 100, 200);
});

function tick() {
  GAME.update();
  GAME.draw();
}