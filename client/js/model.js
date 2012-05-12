/** 
 * Game
 */
 
function Game(canvas) {
  this.canvas = canvas;
  this.state = "waiting";
  this.time = 0;
  this.maxTime = 0;
  this.planets = [];
  this.score = 0;
  this.rocket = new Rocket();
  this.startX = 800 / 2;
  this.startY = 600 - 20;
}

Game.prototype.update = function() {
  if (this.state == "playing") {
    this.rocket.update();
    this.checkCollisions();
  }
} 

Game.prototype.draw = function(canvas) {
  var context = this.canvas.getContext("2d");
  var center = {x: 800/2 - 100/2, y: 600/2 - 30/2};
  context.font = "15pt Helvetica";
  if (this.state == "playing") {
    this.canvas.width = this.canvas.width;
    this.rocket.draw(context);
    this.star.draw(context);    
    for (var i = 0; i < this.planets.length; i++) {
      this.planets[i].draw(this.canvas.getContext("2d"));
    }
  } else if (this.state == "won") {
    context.fillStyle = "#ffff00";
    context.fillRect(center.x, center.y, 180, 30);
    context.fillStyle = "#000000";
    context.fillText("Nice! Score += " + this.score , center.x + 5, center.y + 25);
  } else if (this.state == "dead") {
    context.fillStyle = "#ff0000";
    context.fillRect(center.x, center.y, 100, 30);
    context.fillStyle = "#000000";
    context.fillText("You Died.", center.x + 5, center.y + 25);
  }
}

Game.prototype.newGame = function(planets, starX, starY, time) {
  this.time = time;
  this.score = 0;
  this.maxTime = time;
  this.rocket.x = this.startX;
  this.rocket.y = this.startY;
  this.rocket.vx = 0;
  this.rocket.vy = 0;
  this.star = new Star(starX, starY, 10);
  for (var i = 0; i < planets.length; i++) {
    this.newPlanet(planets[i].x, planets[i].y, planets[i].radius);
  }
  this.state = "playing";
}

Game.prototype.end = function() {
  this.planets = [];
  this.state = "waiting";
  this.canvas.width = this.canvas.width;
}

Game.prototype.checkCollisions = function() {
  // check planets
  for (var i = 0; i < this.planets.length; i++) {
    var p = this.planets[i];
    var r = this.rocket;
    var dx = p.x - r.x;
    var dy = p.y - r.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var angle = Math.atan2(dy, dx);
    var force = 1 / dist;
    r.vx += Math.cos(angle) * force;
    r.vy += Math.sin(angle) * force;
    if (dist < p.radius + r.radius) {
      this.die();
    }
  }
  
  // check star
  var dx = this.star.x - r.x;
  var dy = this.star.y - r.y;
  var dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < this.star.radius + r.radius) {
    this.win();
  }
}

Game.prototype.newPlanet = function(x, y, radius) {
  var planet = new Planet(x, y, radius);
  this.planets.push(planet);
}

Game.prototype.die = function() {
  this.state = "dead";
  this.score = 0;
}

Game.prototype.win = function() {
  this.state = "won";
  this.score = this.time;
}

/**
 * Rocket
 */

function Rocket() {
  this.x = 0;
  this.y = 0;
  this.vy = 0;
  this.vx = 0;
  
  this.angle = 0;
  
  this.acceleration = 0.1;
  this.ship = new Image();
  this.ship.src = "vlar";
  this.image = this.ship;

  var engine = new Image();
  engine.src="img/rocket_fire.gif";
  this.engine = engine;

  this.radius = 20;
  this.moving = false;
  this.acceleration = 0.1;
}

Rocket.prototype.update = function() {
  this.moving = false;
  if (KEYBOARD[LEFT]) {
    this.angle += -this.acceleration;
  }
  if (KEYBOARD[RIGHT]) {
    this.angle += this.acceleration;
  }
  if (KEYBOARD[UP]) {
    this.moving = true;
    this.vx += Math.cos(this.angle - Math.PI / 2) * this.acceleration;
    this.vy += Math.sin(this.angle - Math.PI / 2) * this.acceleration;
  }
  this.x += this.vx;
  this.y += this.vy;
}

Rocket.prototype.draw = function(ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);
  // rotate 45 degrees clockwise
  ctx.rotate(this.angle);
  var x = -this.image.width / 2;
  var y = -this.image.height / 2;
  ctx.drawImage(this.image, x, y);
  if (this.moving) {
    ctx.drawImage(this.engine, x, y);
  }
  ctx.restore();
}

/**
 * Planet
 */
function Planet(x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
}


Planet.prototype.draw = function(ctx) {
  ctx.arc(this.x, this.y, this.radius, 0 , 2 * Math.PI, false);
  ctx.fillStyle = "#CCCCCC";  
  ctx.fill();
}

/**
 *
 */
function Star(x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  var i = new Image();
  i.src = "img/star.gif";
  this.image = i;
}

Star.prototype.draw = function(ctx) {
  ctx.drawImage(this.image, this.x - this.image.width / 2, this.y - this.image.height / 2);
}
