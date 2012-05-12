var GAME;

$(document).ready(function() {
  // Create SocketIO instance, connect
  var socket = new io.Socket('localhost',{
    port: 8080
  });
  socket.connect();
  socket.on('connect',function() {
    console.log('Client has connected to the server!');
  });
});

function startGame() {
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
}

function tick() {
  GAME.update();
  GAME.draw();
}