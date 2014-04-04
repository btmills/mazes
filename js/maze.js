"use strict";
var __moduleName = "maze";
var Maze = function(width, height) {
  var DIRECTIONS = ['north', 'south', 'east', 'west'];
  function randomInt(max) {
    return Math.floor(Math.random() * max);
  }
  function randomElement(arr) {
    return arr[randomInt(arr.length)];
  }
  function adjacentSquare(start, direction) {
    switch (direction) {
      case 'north':
        return start.y > 0 ? {
          x: start.x,
          y: start.y - 1
        } : null;
      case 'south':
        return start.y < height - 1 ? {
          x: start.x,
          y: start.y + 1
        } : null;
      case 'east':
        return start.x < width - 1 ? {
          x: start.x + 1,
          y: start.y
        } : null;
      case 'west':
        return start.x > 0 ? {
          x: start.x - 1,
          y: start.y
        } : null;
      default:
        throw new Exception('Invalid direction ' + dir);
    }
  }
  function adjacentSquares(start) {
    return DIRECTIONS.reduce((function(obj, dir) {
      obj[dir] = adjacentSquare(start, dir);
      return obj;
    }), {});
  }
  function relativeDirection(start, end) {
    if (start.x < end.x) {
      return 'east';
    } else if (end.x < start.x) {
      return 'west';
    } else if (start.y < end.y) {
      return 'south';
    } else if (end.y < start.y) {
      return 'north';
    }
  }
  function generate() {
    var mesh = [];
    var edges = [];
    var length = 0;
    var x,
        y;
    var start,
        end;
    function getSquare(square) {
      return mesh[square.x][square.y];
    }
    function isolated(square) {
      square = getSquare(square);
      return DIRECTIONS.every((function(dir) {
        return square[dir] !== true;
      }));
    }
    function connect(a, b) {
      mesh[a.x][a.y][relativeDirection(a, b)] = true;
      mesh[b.x][b.y][relativeDirection(b, a)] = true;
    }
    function openEdge(square) {
      var $__0 = square,
          x = $__0.x,
          y = $__0.y;
      if (x === 0) {
        mesh[x][y].west = true;
      } else if (y === 0) {
        mesh[x][y].north = true;
      } else if (x === (width - 1)) {
        mesh[x][y].east = true;
      } else if (y === (height - 1)) {
        mesh[x][y].south = true;
      } else {
        throw new Error('Destination not on edge.');
      }
    }
    function search(pos) {
      var adjacencies,
          options,
          heading,
          next;
      if (pos.x === end.x && pos.y === end.y) {
        openEdge(pos);
        console.log('LENGTH', length);
        return;
      }
      adjacencies = adjacentSquares(pos);
      while (1) {
        options = Object.keys(adjacencies).filter((function(dir) {
          return adjacencies[dir];
        })).filter((function(dir) {
          return isolated(adjacentSquare(pos, dir));
        }));
        if (!options.length)
          break;
        heading = randomElement(options);
        next = adjacencies[heading];
        connect(pos, next);
        length++;
        search(next);
        length--;
      }
    }
    for (x = 0; x < width; x++) {
      mesh[x] = [];
      for (y = 0; y < height; y++) {
        if (x === 0 || y === 0 || x === (width - 1) || y === (height - 1)) {
          edges.push({
            x: x,
            y: y
          });
        }
        mesh[x][y] = {
          north: 0 < y ? false : null,
          south: y < (height - 1) ? false : null,
          west: 0 < x ? false : null,
          east: x < (width - 1) ? false : null
        };
      }
    }
    start = randomElement(edges);
    do {
      end = randomElement(edges);
    } while (start.x === end.x || start.y === end.y);
    openEdge(start);
    search(start);
    return mesh;
  }
  function render(mesh) {
    var grid = new Grid(document.getElementById('canvas'));
    var width = mesh.length,
        height = mesh[0].length;
    var x,
        y;
    grid.clear();
    grid.width(width);
    grid.height(height);
    for (x = 0; x < width; x++) {
      for (y = 0; y < height; y++) {
        if (!mesh[x][y].west) {
          grid.line(x, y, x, y + 1);
        }
        if (!mesh[x][y].north) {
          grid.line(x, y, x + 1, y);
        }
        if (x === width - 1 && !mesh[x][y].east) {
          grid.line(x + 1, y, x + 1, y + 1);
        }
        if (y === height - 1 && !mesh[x][y].south) {
          grid.line(x, y + 1, x + 1, y + 1);
        }
      }
    }
  }
  return {
    generate: generate,
    render: render
  };
};
function generate() {
  var width = +document.getElementById('width').value;
  var height = +document.getElementById('height').value;
  var m = new Maze(width, height);
  m.render(m.generate());
}
document.getElementById('generate').addEventListener('click', generate);
generate();
