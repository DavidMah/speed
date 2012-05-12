/** 
 * Game
 */
 
function Game(canvas) {
  this.canvas = canvas;
  this.mode = "waiting";
  this.time = 0;
  this.planets = [];
  this.rocket;
}

Game.prototype.update = function() {
  this.rocket.update();
} 

Game.prototype.draw = function(canvas) {
  this.canvas.width = this.canvas.width;
  this.rocket.draw(this.canvas.getContext("2d"));
}

Game.prototype.newRocket = function() {
  this.rocket = new Rocket();
}

/** 
 * Game Board
 */


/**
 * Rocket
 */

function Rocket() {
  this.x = 0;
  this.y = 0;
  this.vy = 1;
  this.vx = 0;
  this.radius = 10;
}

Rocket.prototype.update = function() {
  this.x += this.vx;
  this.y += this.vy;
}

Rocket.prototype.draw = function(ctx) {
  ctx.fillStyle = "#000000";  
  ctx.fillRect(this.x, this.y, 20, 20);
}