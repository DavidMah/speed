var game;
var socket;

$(document).ready(function() {
  var canvas = $('#game_canvas')[0];
  game = new Game(canvas);
  $("#play_button").click(function() {
    socket = io.connect('http://localhost');
    socket.on('connected', function(event) {
      console.log("Sending name: " + $("#name_input").val());
      socket.emit('name', {name: $("#name_input").val()});
    });
    socket.on('game_start', function(event) {
      console.log("Starting game with data: " + event);
      startGame(canvas, event.time);
    });
    socket.on('game_end', function(event) {
      endGame();
      console.log("Game ended. Sending score of " + score);
      socket.emit('score', {name: $("#name_input").val(), score: game.score});
    })
    socket.on('all_scores', function(event) {
      console.log("Received all scores: " + event.scores);
    });
  });
});

function startGame(canvas, time) {
  Ticker.setFPS(60);
  Ticker.addListener(window);
  game.newGame([
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
  ], 100, 200, time);
  // start countdown
  setInterval(function() {
    if (game.state == "playing") {
      game.time--;
      console.log(game.time);
    }
  }, 1000);
}

function endGame() {
  game.end();
}

function tick() {
  game.update();
  game.draw();
}