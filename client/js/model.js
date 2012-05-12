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
  this.vy = 0;
  this.vx = 0;
}

Rocket.prototype.update = function() {
  this.x += this.vx;
  this.y += this.vy;
}

Rocket.prototype.draw = function(ctx) {
  ctx.fillStyle = "rgb(200,0,0)";  
  ctx.fillRect (10, 10, 55, 50);
}