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

var users = []

io.sockets.on('connection', function (socket) {
  socket.emit('connected', {})

  socket.on('name', function(event) {
    addNewUser(socket, event)
  });

  socket.on('start', gameStart);
  socket.on('score', receiveScore)

});

var timer        = 0;
var game_length  = 15;
var scores       = {};

var BOARD_WIDTH  = 800;
var BOARD_HEIGHT = 600;
var PLANET_QUANTITY = 4;

function addNewUser(socket, event) {
  console.log("got dat name" + event.name);
  initializer = { 'score' : getScoreBoard()['score'],
                  'timer' : getRemainingTime() };
  socket.emit('all_scores', getScoreBoard());
  socket.emit('current_time', {'time' : getRemainingTime()});
}

function generateGame() {
  planets = generatePlanets();
  star = generateStar(planets);
  time = getRemainingTime();
  return {'planets' : planets, 'star' : star,'time' : time}
}

function getRemainingTime() {
  return game_length - timer;
}

function generatePlanets() {
  var planets = [];
  for(var i = 0; i < Math.random() * 4 + PLANET_QUANTITY; i++) {
    var x = parseInt(Math.random() * BOARD_WIDTH)
    var y = parseInt(Math.random() * (BOARD_HEIGHT - 150))
    var radius = parseInt(Math.random() * BOARD_WIDTH / 7 + 4);
    var planet = {'x' : x, 'y' : y, 'radius' : radius};
    planets.push(planet);
  }
  return planets;
}

function generateStar(planets) {
  var x = -1;
  var y = -1;
  while(withinPlanets(x, y, planets)) {
    x = parseInt(Math.random() * (BOARD_WIDTH  * 0.9))
    y = parseInt(Math.random() * ((BOARD_HEIGHT / 2) * 0.9))
  }
  return {'x' : x, 'y' : y};
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
  previous_score = (scores[event.name] == undefined ? [0, 0] : scores[event.name])
  new_score = event.score;
  cumulative_score = previous_score[1] + new_score;
  scores[event.name] = [new_score, cumulative_score, true];
}

function gameStart(event) {
  io.sockets.emit('game_start', generateGame());
}

function gameEnd() {
  timer = 0;
  io.sockets.emit('game_end', {});
  setTimeout(sendScores, 1000);
  setTimeout(resetScores, 2000);
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
  io.sockets.emit('all_scores', getScoreBoard());
}

function resetScores() {
  for(var key in scores) {
    if(!scores[key][2]) {
      delete scores[key]
    } else {
      scores[key][2] = false;
    }
  }
}

function getScoreBoard() {
  return { 'scores' : scores };
}

setInterval(gameStep, 1000)
