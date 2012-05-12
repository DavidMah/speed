var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8080);

function handler (req, res) {
}

io.sockets.on('connection', function (socket) {

  socket.emit('news', { hello: 'world' });

  socket.on('new_user', function (name) {
    socket.emit('new_user', { username:
       name });
  });

});
