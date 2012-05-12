var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8080);

function handler (req, res) {
 fs.readFile(__dirname + req.url,
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
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

});

var timer       = 0
var game_length = 20

function gameStart() {
  io.sockets.emit('game_start', {'time' : timer});
}

function gameEnd() {
  timer = 0;
  io.sockets.emit('game_end', {});
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

setInterval(gameStep, 1000)
