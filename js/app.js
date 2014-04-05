"use strict";
var __moduleName = "app";
var maze;
function generate() {
  var width = +document.getElementById('width').value;
  var height = +document.getElementById('height').value;
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
generate();
