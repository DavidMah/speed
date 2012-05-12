var game;
var socket;
var timer;

$(document).ready(function() {
  var canvas = $('#game_canvas')[0];
  game = new Game(canvas);
  timer = setInterval(function() {
      game.time--;
  }, 1000);
    var click = function() {
    var radio = $(".radio");
    var ship;
    for (var i = 0; i < radio.length; i++) {
      if (radio[i].checked) {
        ship = radio[i].value;
        game.rocket.ship.src = ship;
        console.log(game.rocket.ship.src);
      }
    }
    $("#welcome").css("visibility", "hidden");
    $("#loading").css("visibility", "visible");
    socket = io.connect('http://173.255.245.211:8080');
    socket.on('connected', function(event) {
      console.log("Sending name: " + $("#name_input").val());
      socket.emit('name', {name: $("#name_input").val(), ship: ship});
    });
    socket.on('game_start', function(event) {
      console.log("Starting game with planets: " + event.planets);
      startGame(canvas, event.time, event.planets, event.star);
    });
    socket.on('game_end', function(event) {
      endGame();
      console.log("Game ended. Sending score of " + game.score);
      socket.emit('score', {name: $("#name_input").val(), score: game.score, ship: ship});
    })
    socket.on('all_scores', function(event) {
      console.log("Received all scores: " + event.scores);
      show_scores(event.scores);
    });
    socket.on('current_time', function(event) {
      console.log("Received current time: " + event.time);
      game.time = event.time;
      setInterval(updateTimer, 100);
    });
  };
  $("#play_button").click(click);
});

function startGame(canvas, time, planets, star) {
  $("#loading").css("visibility", "hidden");
  Ticker.setFPS(60);
  Ticker.addListener(window);
  game.newGame(planets, star.x, star.y, time);
  // start countdown

  $('#time_prompt').text('Time Remaining:');
}

function endGame() {
  $('#time_prompt').text("Next Game In:");
  game.end();
}

// Expects a dictionary relating usernames to scores
// e.g.: {a: 1, b: 2, c: 3}
function show_scores(scores) {
  $("#scores")[0].innerHTML = "";
  var score;

  var table = document.createElement("table");

  var tr = document.createElement("tr");
  tr.innerHTML = "<td>name</td><td>recent score</td><td>cumulative</td>";
  table.appendChild(tr);
  
  for (player in scores) {
    var tr = document.createElement("tr");
    var ship = scores[player][2];
    tr.innerHTML = "<td><img src='" + ship + "'></td><td>" + player + "</td><td>" + scores[player][0] + "</td><td>" + scores[player][1] + "</td>";
    table.appendChild(tr);
  }
  $("#scores")[0].appendChild(table);
}
function tick() {
  game.update();
  game.draw();
}

function updateTimer() {
  if(game.state != 'waiting') {
    $('#timer').text(game.time);
  } else {
    $('#timer').text(5 + game.time);
  }
}
