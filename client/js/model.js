/** 
 * Game
 */
 
function Game(canvas) {
  this.canvas = canvas;
  this.mode = "waiting";
  this.time = 0;
  this.planets = [];
  this.rocket;
  this.rocket = new Rocket();
  this.startX = 800 / 2;
  this.startY = 800 - 20;
}

Game.prototype.update = function() {
  this.rocket.update();
} 

Game.prototype.draw = function(canvas) {
  this.canvas.width = this.canvas.width;
  this.rocket.draw(this.canvas.getContext("2d"));
  for (var i = 0; i < this.planets.length; i++) {
    this.planets[i].draw(this.canvas.getContext("2d"));
  }
}

Game.prototype.newGame = function(planets) {
  this.rocket.x = this.startX;
  this.rocket.y = this.startY;
  this.rocket.vx = 0;
  this.rocket.vy = 0;
  for (var i = 0; i < planets.length; i++) {

  }
}

Game.prototype.newPlanet = function(x, y, radius) {
  var planet = new Planet(x, y, radius);
  planets.push(planet);
}

/**
 * Rocket
 */

function Rocket() {
  this.x = 0;
  this.y = 0;
  this.vy = 0;
  this.vx = 0;
  this.radius = 10;
  this.acceleration = 0.1;
}

Rocket.prototype.update = function() {
  if (KEYBOARD[LEFT]) {
    this.vx += -this.acceleration;
  }
  if (KEYBOARD[RIGHT]) {
    this.vx += this.acceleration;
  }
  if (KEYBOARD[UP]) {
    this.vy += -this.acceleration;
  }
  if (KEYBOARD[DOWN]) {
    this.vy += this.acceleration;
  }
  
  this.x += this.vx;
  this.y += this.vy;
}

Rocket.prototype.draw = function(ctx) {
  ctx.fillStyle = "#FFFFFF";  
  ctx.fillRect(this.x, this.y, 15, 15);
}

/**
 * Planet
 */

function Planet(x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
}

Planet.prototype.update = function() {
  
}

Planet.prototype.draw = function(ctx) {
  ctx.fillStyle = "#FFFFFF";  
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true); 
}