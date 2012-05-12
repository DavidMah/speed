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

var timer       = 0
var game_length = 20
var scores      = {}


function receiveScore(event) {
  scores[event.name] = scores.event.score
}
function gameStart(event) {
  io.sockets.emit('game_start', {'time' : game_length - timer});
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
  io.sockets.emit('all_scores', { 'scores' : scores });
  var scores = {}
}

setInterval(gameStep, 1000)
