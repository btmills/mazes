"use strict";
var Grid = function ($el) {

    var SIZE = 20; // Width of square in pixels
    var WEIGHT = 2; // Width of line in pixels

    var ctx = $el.getContext('2d');

    function pixelHeight(val) {
        if (arguments.length > 0) {
            ctx.canvas.height = val;
        }
        return ctx.canvas.height;
    }

    function pixelWidth(val) {
        if (arguments.length > 0) {
            ctx.canvas.width = val;
        }
        return ctx.canvas.width;
    }

    function gridHeight(squares) {
        if (arguments.length > 0) {
            pixelHeight(squares * SIZE + (squares + 1) * WEIGHT);
        }
        return (pixelHeight() - WEIGHT) / (SIZE + WEIGHT);
    }

    function gridWidth(squares) {
        if (arguments.length > 0) {
            pixelWidth(squares * SIZE + (squares + 1) * WEIGHT);
        }
        return (pixelWidth() - WEIGHT) / (SIZE + WEIGHT);
    }

    function toPixels(sq) {
        return (WEIGHT / 2) + sq * (WEIGHT + SIZE);
    }

    function mod(a, b) {
        return ((a % b) + b) % b;
    }

    function toSquares(px) {
        if (mod(px - WEIGHT, SIZE + WEIGHT) >= (SIZE - WEIGHT)) {
            // On a line
            return null;
        }
        return Math.floor((px - WEIGHT) / (SIZE + WEIGHT));
    }

    function clear() {
        ctx.clearRect(0, 0, pixelWidth(), pixelHeight());
    }

    function fill(x, y, color) {
        var _fillStyle = ctx.fillStyle;
        ctx.fillStyle = color;

        ctx.fillRect(
            toPixels(x) + (WEIGHT / 2),
            toPixels(y) + (WEIGHT / 2),
            SIZE, SIZE
        );

        ctx.fillStyle = _fillStyle;
    }

    function bridge(x1, y1, x2, y2, color) {
        if (Math.abs(x2 - x1) + Math.abs(y2 - y1) !== 1) {
            throw new Error('Squares are not adjacent.');
        }

        var x = Math.max(x1, x2), y = Math.max(y1, y2);

        var _lineCap     = ctx.lineCap;
        var _lineWidth   = ctx.lineWidth;
        var _strokeStyle = ctx.strokeStyle;
        ctx.lineCap      = 'square';
        ctx.lineWidth    = WEIGHT;
        ctx.strokeStyle  = color;

        ctx.beginPath();
        if (x1 === x2) {
            // Bridge north/south squares
            // Narrower x dimensions
            ctx.moveTo(toPixels(x1) + WEIGHT, toPixels(y));
            ctx.lineTo(toPixels(x1 + 1) - WEIGHT, toPixels(y));
        } else {
            // Bridge east/west squares
            // Narrower y dimensions
            ctx.moveTo(toPixels(x), toPixels(y1) + WEIGHT);
            ctx.lineTo(toPixels(x), toPixels(y1 + 1) - WEIGHT);
        }
        ctx.stroke();

        ctx.lineCap     = _lineCap;
        ctx.lineWidth   = _lineWidth;
        ctx.strokeStyle = _strokeStyle;
    }

    function line(x1, y1, x2, y2) {
        var _lineCap     = ctx.lineCap;
        var _lineWidth   = ctx.lineWidth;
        var _strokeStyle = ctx.strokeStyle;
        ctx.lineCap      = 'round';
        ctx.lineWidth    = WEIGHT;
        ctx.strokeStyle  = '#16191d';

        ctx.beginPath();
        ctx.moveTo(toPixels(x1), toPixels(y1));
        ctx.lineTo(toPixels(x2), toPixels(y2));
        ctx.stroke();

        ctx.lineCap     = _lineCap;
        ctx.lineWidth   = _lineWidth;
        ctx.strokeStyle = _strokeStyle;
    }

    return {
        height: gridHeight,
        width: gridWidth,
        pixelHeight: pixelHeight,
        pixelWidth: pixelWidth,
        clear: clear,
        fill: fill,
        bridge: bridge,
        line: line,
        toPixels: toPixels,
        toSquares: toSquares
    };

};

"use strict";
function random() {
    var x = Math.sin(random.seed++) * 10000;
    return x - Math.floor(x);
}
random.seed = Math.random();

var Maze = function (width, height) {

    var DIRECTIONS = ['north', 'south', 'east', 'west'];
    var GREEN = '#4ecdc4', RED = '#ff6b6b';

    var path = [];
    var maze, grid;

    function randomInt(max) {
        return Math.floor(random() * max);
    }

    function randomElement(arr) {
        return arr[randomInt(arr.length)];
    }

    function lastElement(arr) {
        return arr[arr.length - 1];
    }

    /**
     * Gets the coordinates of an adjacent square.
     * @param {object} start Starting square's coordinates.
     * @param {string} direction Cardinal direction of adjacent square.
     * @returns {object} Adjacent square's coordinates.
     */
    function adjacentSquare(start, direction) {
        switch (direction) {
            case 'north':
                return start.y > 0
                    ? { x: start.x, y: start.y - 1 }
                    : null;
            case 'south':
                return start.y < height - 1
                    ? { x: start.x, y: start.y + 1 }
                    : null;
            case 'east':
                return start.x < width - 1
                    ? { x: start.x + 1, y: start.y }
                    : null;
            case 'west':
                return start.x > 0
                    ? { x: start.x - 1, y: start.y }
                    : null;
            default: throw new Exception('Invalid direction ' + dir);
        }
    }

    /**
     * Gets the coordinates of all squares adjacent to a given square.
     * @param {object} start Coordinates of the starting square.
     * @returns {object} Coordinates of adjacent squares in each direction.
     */
    function adjacentSquares(start) {
        return DIRECTIONS.reduce(function(obj, dir) {
            obj[dir] = adjacentSquare(start, dir);
            return obj;
        }, {});
    }

    /**
     * Gets the relative direction between two adjacent squares.
     * @param {object} start The starting square.
     * @param {object} end The ending square.
     * @returns {strign} Cardinal direction from start to end.
     */
    function relativeDirection(start, end) {
        if (Math.abs(end.x - start.x) + Math.abs(end.y - start.y) > 1) {
            // Squares are not adjacent
            return null;
        }

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
        var x, y;
        var start, end;

        function getSquare(square) {
            return mesh[square.x][square.y];
        }

        function isolated(square) {
            square = getSquare(square);
            return DIRECTIONS.every(function(dir) {
              return square[dir] !== true;
            });
        }

        function connect(a, b) {
            //console.log(['CONNECTING (',a.x,',',a.y,') and (',b.x,',',b.y,').'].join(''));
            mesh[a.x][a.y][relativeDirection(a, b)] = true;
            mesh[b.x][b.y][relativeDirection(b, a)] = true;
        }

        function openEdge(square) {
          var x = square.x;
          var y = square.y;
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
            var adjacencies, options, heading, next;

            if (pos.x === end.x && pos.y === end.y) {
                openEdge(pos);
                console.log('LENGTH', length);
                return;
            }

            adjacencies = adjacentSquares(pos);

            while (1) {
                options = Object.keys(adjacencies)
                    .filter(function(dir) {
                  return adjacencies[dir];
                })
                    .filter(function(dir) {
                  return isolated(adjacentSquare(pos, dir));
                });
                if (!options.length) break;

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
                if (x === 0 ||
                    y === 0 ||
                    x === (width - 1) ||
                    y === (height - 1)
                ) {
                    edges.push({x: x, y: y});
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
        path.push(start);
        do {
            end = randomElement(edges);
        } while (start.x === end.x || start.y === end.y);

        openEdge(start);
        search(start);

        return {
            mesh: mesh,
            start: start,
            end: end
        };
    }

    function bridgeEdge(square, color) {
        if (square.x === 0) { // West
            grid.bridge(square.x - 1, square.y, square.x, square.y, color);
        } else if (square.y === 0) { // North
            grid.bridge(square.x, square.y - 1, square.x, square.y, color);
        } else if (square.x === (width - 1)) { // East
            grid.bridge(square.x, square.y, square.x + 1, square.y, color);
        } else if (square.y === (height - 1)) { // South
            grid.bridge(square.x, square.y, square.x, square.y + 1, color);
        } else {
            throw new Error('Square is not on edge.');
        }
    }

    function render($el) {
        var x, y;

        grid = new Grid($el);
        grid.clear();
        grid.width(width);
        grid.height(height);

        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                if (!maze.mesh[x][y].west) {
                    grid.line(x, y, x, y + 1);
                }
                if (!maze.mesh[x][y].north) {
                    grid.line(x, y, x + 1, y);
                }

                // Only need to draw south and east on edges
                if (x === width - 1 && !maze.mesh[x][y].east) {
                    grid.line(x + 1, y, x + 1, y + 1);
                }
                if (y === height - 1 && !maze.mesh[x][y].south) {
                    grid.line(x, y + 1, x + 1, y + 1);
                }
            }
        }

        grid.fill(maze.start.x, maze.start.y, GREEN);
        grid.fill(maze.end.x, maze.end.y, RED);
        bridgeEdge(maze.start, GREEN);
        bridgeEdge(maze.end, RED);
    }

    function move(dir) {
        var pos = lastElement(path);
        var previous = path[path.length - 2];
        var next;

        // Don't break down walls
        if (!maze.mesh[pos.x][pos.y][dir]) return false;

        next = adjacentSquare(pos, dir);
        if (!next) return false;

        if (previous && next.x === previous.x && next.y === previous.y) {
            grid.bridge(pos.x, pos.y, next.x, next.y, RED);
            grid.fill(pos.x, pos.y, RED);
            path.pop();
        } else {
            grid.bridge(pos.x, pos.y, next.x, next.y, GREEN);
            grid.fill(next.x, next.y, GREEN);
            path.push(next);
        }

        if (next.x === maze.end.x && next.y === maze.end.y) {
            bridgeEdge(next, GREEN);
            return true;
        }
        return false;
    }

    function enterSquare(square) {
        var pos = lastElement(path);
        var dir = relativeDirection(pos, square);
        if (dir) move(dir);
    }

    var hover = (function () {
        var _x, _y;

        return function (x, y) {
            x = grid.toSquares(x);
            y = grid.toSquares(y);
            if (x !== null && y !== null && (x !== _x || y !== _y)) {
                _x = x;
                _y = y;
                enterSquare({x: x, y: y});
            }
        };

    })();

    maze = generate();

    return {
        render: render,
        move: move,
        hover: hover
    };

}

"use strict";
(function () {
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

  document.getElementById('generate')
      .addEventListener('click', function (event) {
          event.preventDefault();
          generate();
      });
  document.body.addEventListener('keyup', function (event) {
      var key = event.key || event.charCode || event.keyCode;
      var direction = ['west', 'north', 'east', 'south'][key - 37];
      if (!direction) return;

      event.preventDefault();
      maze.move(direction);
  });

  var _ref = /#(\d+)x(\d+)(?:s(\d+.\d+))?|.*/
      .exec(window.location.hash);

  var width = _ref[1];
  var height = _ref[2];
  var seed = _ref[3];
  if (width && height) {
      document.getElementById('width').value = width;
      document.getElementById('height').value = height;
  }
  if (seed) {
      random.seed = parseFloat(seed);
  }

  var canvas = document.getElementById('canvas');
  canvas.addEventListener('mousemove', function (event) {
      maze.hover(event.layerX, event.layerY);
  });

  generate();
})();

//# sourceMappingURL=index.js.map