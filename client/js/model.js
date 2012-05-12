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
  if (this.state == "playing") {
    this.canvas.width = this.canvas.width;
    this.rocket.draw(this.canvas.getContext("2d"));
    this.star.draw(this.canvas.getContext("2d"));    
    for (var i = 0; i < this.planets.length; i++) {
      this.planets[i].draw(this.canvas.getContext("2d"));
    }
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
  this.acceleration = 0.1;
  var ship = new Image();
  ship.src = "img/rocket_orange.gif";
  this.image = ship;

  var engine = new Image();
  engine.src="img/rocket_fire.gif";
  this.engine = engine;

  this.radius = this.image.width / 2;
  this.moving = false;
  this.acceleration = 0.03;
}

Rocket.prototype.update = function() {
  this.moving = false;
  if (KEYBOARD[LEFT]) {
    this.moving = true;
    this.vx += -this.acceleration;
  }
  if (KEYBOARD[RIGHT]) {
    this.moving = true;
    this.vx += this.acceleration;
  }
  if (KEYBOARD[UP]) {
    this.moving = true;
    this.vy += -this.acceleration;
  }
  if (KEYBOARD[DOWN]) {
    this.moving = true;
    this.vy += this.acceleration;
  }
  this.x += this.vx;
  this.y += this.vy;
}

Rocket.prototype.draw = function(ctx) {
  ctx.fillStyle = "#FF0000";  
  ctx.fillRect(this.x - 7, this.y - 7, 15, 15);
  var x = this.x - this.image.width / 2;
  var y = this.y - this.image.height / 2;
  ctx.drawImage(this.image, x, y);
  if (this.moving) {
    ctx.drawImage(this.engine, x, y);
  }
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
