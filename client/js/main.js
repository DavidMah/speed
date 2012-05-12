var GAME;

$(document).ready(function() {
  var socket = io.connect('http://localhost');
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('name', { my: 'data' });
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

// Expects a dictionary relating usernames to scores
// e.g.: {a: 1, b: 2, c: 3}
function show_scores(scores) {
  var score;
  for (player in scores) {
    var p = document.createElement("p");
    p.textContent = player + ": " + scores[player]
    $("#scores")[0].appendChild(p);
  }
}

function tick() {
  GAME.update();
  GAME.draw();
}
