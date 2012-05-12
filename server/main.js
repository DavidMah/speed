var http= require('http');
var fs = require('fs');

httpServer = http.createServer(function(req, response){

  fs.readFile('./test.html', function(error, content) {
    if(error) {
      response.writeHead(500);
      response.end();
    } else {
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.end(content, 'utf-8');
    }
  });
})
httpServer.listen(8080);

var nowjs = require("now");
var everyone = nowjs.initialize(httpServer);

console.log("in main");

var counter = 1;
everyone.now.logStuff = function(msg){
  console.log(msg);
}

everyone.now.incrementCounter = function() {
  counter += 1;
  console.log("counter " + counter);
  everyone.now.updateCounter(counter);
}
