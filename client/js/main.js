var game;
var socket;

$(document).ready(function() {
  var canvas = $('#game_canvas')[0];
  $("#play_button").click(function() {
    socket = io.connect('http://localhost');
    socket.on('connected', function(event) {
      socket.emit('name', {name: $("#name_input").val()});
    });
    socket.on('game_start', function(event) {
      startGame(canvas, event.time);
    });
    socket.on('game_end', function(event) {
      
    })
    socket.on('all_scores', function(event) {
      
    });
  });
});

function startGame(canvas, time) {
  game = new Game(canvas, time);
  
  // start countdown
  setInterval(function() {
    console.log("hello");
  }, 1000);
  
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
  ], 100, 200);
}

function tick() {
  game.update();
  game.draw();
}