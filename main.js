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

  socket.on('name', function(name) {
    usernames.push(name);
    sockets.emit('names', usernames);
  });

});

io.sockets.on('name', function(socket) {
  usernames.
  sockets.emit('names', usernames);
}
