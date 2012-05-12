var game;
var socket;
var timer;

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
      console.log("Game ended. Sending score of " + game.score);
      socket.emit('score', {name: $("#name_input").val(), score: game.score});
    })
    socket.on('all_scores', function(event) {
      console.log("Received all scores: " + event.scores);
      show_scores(event.scores);
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
  timer = setInterval(function() {
    if (game.state == "playing") {
      game.time--;
    }
  }, 1000);
}

function endGame() {
  clearInterval(timer);
  game.end();
}

// Expects a dictionary relating usernames to scores
// e.g.: {a: 1, b: 2, c: 3}
function show_scores(scores) {
  $("#scores")[0].innerHTML = "";
  var score;
  for (player in scores) {
    var p = document.createElement("p");
    p.textContent = player + ": " + scores[player]
    $("#scores")[0].appendChild(p);
  }
}

function tick() {
  game.update();
  game.draw();
}
