var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8080);

function handler (req, res) {
  url = (req.url == '/' ? '/index.html' : req.url)
  fs.readFile(__dirname + url,
    function (err, data) {
      if (err) {
        res.writeHead(500);
      }

      res.writeHead(200);
      res.end(data);
    });
}

var usernames = []

io.sockets.on('connection', function (socket) {
  socket.emit('connected', {})

  socket.on('name', function(event) {
    console.log(event)
    console.log("got dat name" + event.name);
    usernames.push(event.name);
    io.sockets.emit('names', {'names' : usernames});
  });

  socket.on('start', gameStart);
  socket.on('score', receiveScore)

});

var timer        = 0
var game_length  = 20
var scores       = {}

var BOARD_WIDTH  = 800;
var BOARD_HEIGHT = 600;
var PLANET_QUANTITY = 4;

function generateGame() {
  planets = generatePlanets();
  star = generateStar(planets);
  time = game_length - timer;
  return {'planets' : planets, 'star' : star,'time' : time}
}

function generatePlanets() {
  var planets = [];
  for(var i = 0; i < PLANET_QUANTITY; i++) {
    var x = parseInt(Math.random() * BOARD_WIDTH)
    var y = parseInt(Math.random() * BOARD_HEIGHT)
    var radius = parseInt(Math.random() * BOARD_WIDTH / 10);
    var planet = [x, y, radius]
    planets.push(planet);
  }
  return planets;
}

function generateStar(planets) {
  var x = -1;
  var y = -1;
  while(withinPlanets(x, y, planets)) {
    x = parseInt(Math.random() * (BOARD_WIDTH  * 0.9))
    y = parseInt(Math.random() * (BOARD_HEIGHT * 0.9))
  }
  return [x, y];
}

function withinPlanets(x, y, planets) {
  if(0 > x || x > BOARD_WIDTH || 0 > y || y > BOARD_HEIGHT)
    return true;
  for(var i = 0; i < planets.length; i++) {
    widthBound  = (planets[i].x - planets[i].radius < x) && (x < planets[i].x + planets[i].radius)
    heightBound = (planets[i].y - planets[i].radius < y) && (y < planets[i].y + planets[i].radius)
    if(widthBound && heightBound)
      return true;
  }
  return false;
}

function receiveScore(event) {
  scores[event.name] = event.score
}

function gameStart(event) {
  io.sockets.emit('game_start', generateGame());
}

function gameEnd() {
  timer = 0;
  io.sockets.emit('game_end', {});
  setTimeout(sendScores, 1000);
}

function gameStep() {
  timer += 1;
  if(timer == 5)
    gameStart();
  if(timer == game_length)
    gameEnd();
  if(timer % 5 == 0)
    console.log("time " + timer)
}

function sendScores() {
  console.log(scores);
  io.sockets.emit('all_scores', { 'scores' : scores });
  scores = {}
}

setInterval(gameStep, 1000)
