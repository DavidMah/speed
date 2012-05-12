var DEBUG = false;

var KEYBOARD = {},
  UP = 87,
  DOWN = 83,
  LEFT = 65,
  RIGHT = 68,
  ENTER = 13,
  SPACE = 32,
  SHIFT = 16,
  Q = 81,
  E = 69,
  W = 87,
  A = 65,
  S = 83,
  D = 68;

$(document).keydown(function(e) {
  keypress(e, true);
});

$(document).keyup(function(e) {
  keypress(e, false);
});

function keypress(e, val) {
  if (DEBUG) {
    console.log(e.which, e.keyCode, val);
  }
  KEYBOARD[e.which] = val
  KEYBOARD[e.keyCode] = val
}
