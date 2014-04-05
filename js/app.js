"use strict";
var __moduleName = "app";
var maze;
function generate() {
  var width = +document.getElementById('width').value;
  var height = +document.getElementById('height').value;
  var hash = '#' + width + 'x' + height + 's' + random.seed;
  var href = window.location.href.split('#')[0] + hash;
  document.getElementById('permalink').setAttribute('href', href);
  maze = new Maze(width, height);
  maze.render(document.getElementById('canvas'));
}
document.getElementById('generate').addEventListener('click', function(event) {
  event.preventDefault();
  generate();
});
document.body.addEventListener('keyup', function(event) {
  var key = event.key || event.charCode || event.keyCode;
  var direction = ['west', 'north', 'east', 'south'][key - 37];
  if (!direction)
    return;
  event.preventDefault();
  maze.move(direction);
});
var $__0 = /#(\d+)x(\d+)(?:s(\d+.\d+))?|.*/.exec(window.location.hash),
    width = $__0[1],
    height = $__0[2],
    seed = $__0[3];
if (width && height) {
  document.getElementById('width').value = width;
  document.getElementById('height').value = height;
}
if (seed) {
  random.seed = parseFloat(seed);
}
generate();
