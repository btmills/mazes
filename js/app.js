(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Maze = _interopRequire(require("./maze"));

var random = _interopRequire(require("./random"));

var App = (function () {
	function App() {
		var _this = this;
		_classCallCheck(this, App);

		this.$width = document.querySelector("#width");
		this.$height = document.querySelector("#height");
		this.$permalink = document.querySelector("#permalink");
		this.$canvas = document.querySelector("#canvas");

		document.querySelector("#generate").addEventListener("click", function (event) {
			event.preventDefault();
			_this.generate();
		});

		document.body.addEventListener("keyup", function (event) {
			var key = event.key || event.charCode || event.keyCode;
			var direction = ["west", "north", "east", "south"][key - 37];
			if (!direction) return;

			event.preventDefault();
			_this.maze.move(direction);
		});

		this.$canvas.addEventListener("mousemove", function (event) {
			_this.maze.hover(event.layerX, event.layerY);
		});

		// Attempt to read maze parameters from URL hash
		var _dXDSDD$exec = /#(\d+)x(\d+)(?:s(\d+.\d+))?|.*/.exec(window.location.hash);

		var _dXDSDD$exec2 = _slicedToArray(_dXDSDD$exec, 4);

		var width = _dXDSDD$exec2[1];
		var height = _dXDSDD$exec2[2];
		var seed = _dXDSDD$exec2[3];


		if (width && height) {
			this.width = width;
			this.height = height;
		}

		if (seed) {
			random.seed = parseFloat(seed);
		}

		this.generate();
	}

	_prototypeProperties(App, null, {
		width: {
			get: function () {
				return +this.$width.value;
			},
			set: function (value) {
				this.$width.value = value;
			},
			configurable: true
		},
		height: {
			get: function () {
				return +this.$height.value;
			},
			set: function (value) {
				this.$height.value = value;
			},
			configurable: true
		},
		generate: {
			value: function generate() {
				this.setPermalink();

				this.maze = new Maze(this.width, this.height);
				this.maze.render(this.$canvas);
			},
			writable: true,
			configurable: true
		},
		setPermalink: {
			value: function setPermalink() {
				var hash = "#" + this.width + "x" + this.height + "s" + random.seed;
				var href = window.location.href.split("#")[0] + hash;
				window.location.hash = hash;
				this.$permalink.setAttribute("href", href);
			},
			writable: true,
			configurable: true
		}
	});

	return App;
})();

new App();

},{"./maze":3,"./random":5}],2:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var mod = _interopRequire(require("./mod"));

var SIZE = 20; // Width of a square in pixels
var WEIGHT = 2; // Width of the line between squares in pixels

var Grid = (function () {
	/**
  * Creates a new Grid instance given a drawing canvas.
  * @param {HTMLCanvasElement} $canvas The <canvas> element on which to draw.
  */
	function Grid($canvas) {
		_classCallCheck(this, Grid);

		this.ctx = $canvas.getContext("2d");
	}

	_prototypeProperties(Grid, {
		toPixels: {

			/**
    * Converts from square units to pixel units.
    * @param {int} squares Zero-based square coordinate.
    * @returns {int} The coordinate of the pixel closest to the origin in the square.
    * @public
    */
			value: function toPixels(squares) {
				return WEIGHT / 2 + squares * (WEIGHT + SIZE);
			},
			writable: true,
			configurable: true
		},
		toSquares: {

			/**
    * Converts from pixel units to square units.
    * @param {int} pixels Zero-based coordinate of a pixel.
    * @returns {int} The zero-based coordinate of the square containing the pixel, or -1 if the
    *                pixel is on a boundary between squares.
    * @public
    */
			value: function toSquares(pixels) {
				if (mod(pixels - WEIGHT, SIZE + WEIGHT) >= SIZE - WEIGHT) {
					// On a line
					return -1;
				}

				return Math.floor((pixels - WEIGHT) / (SIZE + WEIGHT));
			},
			writable: true,
			configurable: true
		}
	}, {
		pixelHeight: {
			get: function () {
				return this.ctx.canvas.height;
			},
			set: function (pixels) {
				this.ctx.canvas.height = pixels;
			},
			configurable: true
		},
		pixelWidth: {
			get: function () {
				return this.ctx.canvas.width;
			},
			set: function (pixels) {
				this.ctx.canvas.width = pixels;
			},
			configurable: true
		},
		gridHeight: {
			get: function () {
				return (this.pixelHeight - WEIGHT) / (SIZE + WEIGHT);
			},
			set: function (squares) {
				this.pixelHeight = squares * SIZE + (squares + 1) * WEIGHT;
			},
			configurable: true
		},
		gridWidth: {
			get: function () {
				return (this.pixelWidth - WEIGHT) / (SIZE + WEIGHT);
			},
			set: function (squares) {
				this.pixelWidth = squares * SIZE + (squares + 1) * WEIGHT;
			},
			configurable: true
		},
		clear: {

			/**
    * Clears the entire drawing surface.
    * @returns {void}
    * @public
    */
			value: function clear() {
				this.ctx.clearRect(0, 0, this.pixelWidth, this.pixelHeight);
			},
			writable: true,
			configurable: true
		},
		fill: {

			/**
    * Fills the interior of a grid square with a color.
    * @param {int} x Zero-based x-coordinate of the square in units of squares.
    * @param {int} y Zero-based y-coordinate of the square in units of squares.
    * @param {string} color A CSS color value.
    * @returns {void}
    * @public
    */
			value: function fill(x, y, color) {
				var ctx = this.ctx;
				var _fillStyle = ctx.fillStyle;
				ctx.fillStyle = color;

				ctx.fillRect(Grid.toPixels(x) + WEIGHT / 2, Grid.toPixels(y) + WEIGHT / 2, SIZE, SIZE);

				ctx.fillStyle = _fillStyle;
			},
			writable: true,
			configurable: true
		},
		bridge: {

			/**
    * Draws the border shared by two squares.
    * @param {int} x1 Zero-based x-coordinate of the first square in units of squares.
    * @param {int} y1 Zero-based y-coordinate of the first square in units of squares.
    * @param {int} x2 Zero-based x-coordinate of the second square in units of squares.
    * @param {int} y2 Zero-based y-coordinate of the second square in units of squares.
    * @param {string} color A CSS color value.
    * @returns {void}
    * @public
    */
			value: function bridge(x1, y1, x2, y2, color) {
				if (Math.abs(x2 - x1) + Math.abs(y2 - y1) !== 1) {
					throw new Error("Squares are not adjacent.");
				}

				var x = Math.max(x1, x2);
				var y = Math.max(y1, y2);

				var ctx = this.ctx;
				var _lineCap = ctx.lineCap;
				var _lineWidth = ctx.lineWidth;
				var _strokeStyle = ctx.strokeStyle;
				ctx.lineCap = "square";
				ctx.lineWidth = WEIGHT;
				ctx.strokeStyle = color;

				ctx.beginPath();
				if (x1 === x2) {
					// Bridge north/south squares
					// Narrower x dimensions
					ctx.moveTo(Grid.toPixels(x1) + WEIGHT, Grid.toPixels(y));
					ctx.lineTo(Grid.toPixels(x1 + 1) - WEIGHT, Grid.toPixels(y));
				} else {
					// Bridge east/west squares
					// Narrower y dimensions
					ctx.moveTo(Grid.toPixels(x), Grid.toPixels(y1) + WEIGHT);
					ctx.lineTo(Grid.toPixels(x), Grid.toPixels(y1 + 1) - WEIGHT);
				}
				ctx.stroke();

				ctx.lineCap = _lineCap;
				ctx.lineWidth = _lineWidth;
				ctx.strokeStyle = _strokeStyle;
			},
			writable: true,
			configurable: true
		},
		line: {

			/**
    * Draws a line between the upper left corners of two grid squares.
    * @param {int} x1 Zero-based x-coordinate of the first square relative to the origin.
    * @param {int} y1 Zero-based y-coordinate of the first square relative to the origin.
    * @param {int} x2 Zero-based x-coordinate of the second square relative to the origin.
    * @param {int} y2 Zero-based y-coordinate of the second square relative to the origin.
    * @param {string} [color='#16191d'] A CSS color value. Defaults to a dark gray.
    * @returns {void}
    * @public
    */
			value: function line(x1, y1, x2, y2) {
				var color = arguments[4] === undefined ? "#16191d" : arguments[4];
				var ctx = this.ctx;
				var _lineCap = ctx.lineCap;
				var _lineWidth = ctx.lineWidth;
				var _strokeStyle = ctx.strokeStyle;
				ctx.lineCap = "square";
				ctx.lineWidth = WEIGHT;
				ctx.strokeStyle = color;

				ctx.beginPath();
				ctx.moveTo(Grid.toPixels(x1), Grid.toPixels(y1));
				ctx.lineTo(Grid.toPixels(x2), Grid.toPixels(y2));
				ctx.stroke();

				ctx.lineCap = _lineCap;
				ctx.lineWidth = _lineWidth;
				ctx.strokeStyle = _strokeStyle;
			},
			writable: true,
			configurable: true
		}
	});

	return Grid;
})();

module.exports = Grid;

},{"./mod":4}],3:[function(require,module,exports){
"use strict";

var Grid = require("./grid");
var random = require("./random");

var Maze = function (width, height) {
	var DIRECTIONS = ["north", "south", "east", "west"];
	var GREEN = "#4ecdc4",
	    RED = "#ff6b6b";

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
			case "north":
				return start.y > 0 ? { x: start.x, y: start.y - 1 } : null;
			case "south":
				return start.y < height - 1 ? { x: start.x, y: start.y + 1 } : null;
			case "east":
				return start.x < width - 1 ? { x: start.x + 1, y: start.y } : null;
			case "west":
				return start.x > 0 ? { x: start.x - 1, y: start.y } : null;
			default:
				throw new Exception("Invalid direction " + dir);
		}
	}

	/**
  * Gets the coordinates of all squares adjacent to a given square.
  * @param {object} start Coordinates of the starting square.
  * @returns {object} Coordinates of adjacent squares in each direction.
  */
	function adjacentSquares(start) {
		return DIRECTIONS.reduce(function (obj, dir) {
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
			return "east";
		} else if (end.x < start.x) {
			return "west";
		} else if (start.y < end.y) {
			return "south";
		} else if (end.y < start.y) {
			return "north";
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
			return DIRECTIONS.every(function (dir) {
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
			} else if (x === width - 1) {
				mesh[x][y].east = true;
			} else if (y === height - 1) {
				mesh[x][y].south = true;
			} else {
				throw new Error("Destination not on edge.");
			}
		}

		function search(pos) {
			var adjacencies, options, heading, next;

			if (pos.x === end.x && pos.y === end.y) {
				openEdge(pos);
				console.log("LENGTH", length);
				return;
			}

			adjacencies = adjacentSquares(pos);

			while (1) {
				options = Object.keys(adjacencies).filter(function (dir) {
					return adjacencies[dir];
				}).filter(function (dir) {
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
				if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
					edges.push({ x: x, y: y });
				}

				mesh[x][y] = {
					north: 0 < y ? false : null,
					south: y < height - 1 ? false : null,
					west: 0 < x ? false : null,
					east: x < width - 1 ? false : null
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
		if (square.x === 0) {
			// West
			grid.bridge(square.x - 1, square.y, square.x, square.y, color);
		} else if (square.y === 0) {
			// North
			grid.bridge(square.x, square.y - 1, square.x, square.y, color);
		} else if (square.x === width - 1) {
			// East
			grid.bridge(square.x, square.y, square.x + 1, square.y, color);
		} else if (square.y === height - 1) {
			// South
			grid.bridge(square.x, square.y, square.x, square.y + 1, color);
		} else {
			throw new Error("Square is not on edge.");
		}
	}

	function render($el) {
		var x, y;

		grid = new Grid($el);
		grid.clear();
		grid.gridWidth = width;
		grid.gridHeight = height;

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
		if (!maze.mesh[pos.x][pos.y][dir]) {
			return false;
		}next = adjacentSquare(pos, dir);
		if (!next) {
			return false;
		}if (previous && next.x === previous.x && next.y === previous.y) {
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
			x = Grid.toSquares(x);
			y = Grid.toSquares(y);
			if (x !== null && y !== null && (x !== _x || y !== _y)) {
				_x = x;
				_y = y;
				enterSquare({ x: x, y: y });
			}
		};
	})();

	maze = generate();

	return {
		render: render,
		move: move,
		hover: hover
	};
};

module.exports = Maze;

},{"./grid":2,"./random":5}],4:[function(require,module,exports){
"use strict";

module.exports = function (a, b) {
	return (a % b + b) % b;
};

},{}],5:[function(require,module,exports){
"use strict";

module.exports = random;
function random() {
	var x = Math.sin(random.seed++) * 10000;
	return x - Math.floor(x);
}

random.seed = Math.random();

},{}]},{},[1])


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2dyaWQuanMiLCJzcmMvbWF6ZS5qcyIsInNyYy9tb2QuanMiLCJzcmMvcmFuZG9tLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0FPLElBQUksMkJBQU0sUUFBUTs7SUFDbEIsTUFBTSwyQkFBTSxVQUFVOztJQUV2QixHQUFHO0FBT0csVUFQTixHQUFHOzt3QkFBSCxHQUFHOztBQVFQLE1BQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQyxNQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakQsTUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3ZELE1BQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFakQsVUFBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDeEUsUUFBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3ZCLFNBQUssUUFBUSxFQUFFLENBQUM7R0FDaEIsQ0FBQyxDQUFDOztBQUVILFVBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ2xELE9BQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDO0FBQ3ZELE9BQUksU0FBUyxHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFH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QUNGOztBQUVELFVBQVMsVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDbEMsTUFBSSxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTs7QUFDbkIsT0FBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztHQUMvRCxNQUFNLElBQUksTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7O0FBQzFCLE9BQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FDL0QsTUFBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDLEtBQU0sS0FBSyxHQUFHLENBQUMsQUFBQyxFQUFFOztBQUNwQyxPQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQy9ELE1BQU0sSUFBSSxNQUFNLENBQUMsQ0FBQyxLQUFNLE1BQU0sR0FBRyxDQUFDLEFBQUMsRUFBRTs7QUFDckMsT0FBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztHQUMvRCxNQUFNO0FBQ04sU0FBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0dBQzFDO0VBQ0Q7O0FBRUQsVUFBUyxNQUFNLENBQUMsR0FBRyxFQUFFO0FBQ3BCLE1BQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFVCxNQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckIsTUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2IsTUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFDdkIsTUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7O0FBRXpCLE9BQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzNCLFFBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzVCLFFBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTtBQUMxQixTQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztLQUMxQjtBQUNELFFBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRTtBQUMzQixTQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUMxQjs7O0FBR0QsUUFBSSxDQUFDLEtBQUssS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO0FBQzdDLFNBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDbEM7QUFDRCxRQUFJLENBQUMsS0FBSyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUU7QUFDL0MsU0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztLQUNsQztJQUNEO0dBQ0Q7O0FBRUQsTUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM3QyxNQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZDLFlBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzlCLFlBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0VBQzFCOztBQUVELFVBQVMsSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNsQixNQUFJLEdBQUcsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUIsTUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDckMsTUFBSSxJQUFJLENBQUM7OztBQUdULE1BQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQUUsVUFBTyxLQUFLLENBQUM7R0FBQSxBQUVoRCxJQUFJLEdBQUcsY0FBYyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNoQyxNQUFJLENBQUMsSUFBSTtBQUFFLFVBQU8sS0FBSyxDQUFDO0dBQUEsQUFFeEIsSUFBSSxRQUFRLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsRUFBRTtBQUMvRCxPQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDL0MsT0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDN0IsT0FBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0dBQ1gsTUFBTTtBQUNOLE9BQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNqRCxPQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNqQyxPQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ2hCOztBQUVELE1BQUksSUFBSSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQ25ELGFBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDeEIsVUFBTyxJQUFJLENBQUM7R0FDWjtBQUNELFNBQU8sS0FBSyxDQUFDO0VBQ2I7O0FBRUQsVUFBUyxXQUFXLENBQUMsTUFBTSxFQUFFO0FBQzVCLE1BQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QixNQUFJLEdBQUcsR0FBRyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDekMsTUFBSSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ25COztBQUVELEtBQUksS0FBSyxHQUFHLENBQUMsWUFBWTtBQUN4QixNQUFJLEVBQUUsRUFBRSxFQUFFLENBQUM7O0FBRVgsU0FBTyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDdEIsSUFBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsSUFBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsT0FBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFBLEFBQUMsRUFBRTtBQUN2RCxNQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ1AsTUFBRSxHQUFHLENBQUMsQ0FBQztBQUNQLGVBQVcsQ0FBQyxFQUFDLENBQUMsRUFBRCxDQUFDLEVBQUUsQ0FBQyxFQUFELENBQUMsRUFBQyxDQUFDLENBQUM7SUFDcEI7R0FDRCxDQUFDO0VBRUYsQ0FBQSxFQUFHLENBQUM7O0FBRUwsS0FBSSxHQUFHLFFBQVEsRUFBRSxDQUFDOztBQUVsQixRQUFPO0FBQ04sUUFBTSxFQUFOLE1BQU07QUFDTixNQUFJLEVBQUosSUFBSTtBQUNKLE9BQUssRUFBTCxLQUFLO0VBQ0wsQ0FBQztDQUVGLENBQUE7O0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Ozs7O2lCQ3BTUCxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDOUIsUUFBTyxDQUFDLEFBQUMsQ0FBQyxHQUFHLENBQUMsR0FBSSxDQUFDLENBQUEsR0FBSSxDQUFDLENBQUM7Q0FDekI7Ozs7O2lCQ0Z1QixNQUFNO0FBQWYsU0FBUyxNQUFNLEdBQUc7QUFDaEMsS0FBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDeEMsUUFBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUN6Qjs7QUFFRCxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VSb290IjoiL2pzeCIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IE1hemUgZnJvbSAnLi9tYXplJztcbmltcG9ydCByYW5kb20gZnJvbSAnLi9yYW5kb20nO1xuXG5jbGFzcyBBcHAge1xuXHRnZXQgd2lkdGgoKSB7IHJldHVybiArdGhpcy4kd2lkdGgudmFsdWU7IH1cblx0c2V0IHdpZHRoKHZhbHVlKSB7IHRoaXMuJHdpZHRoLnZhbHVlID0gdmFsdWU7IH1cblxuXHRnZXQgaGVpZ2h0KCkgeyByZXR1cm4gK3RoaXMuJGhlaWdodC52YWx1ZTsgfVxuXHRzZXQgaGVpZ2h0KHZhbHVlKSB7IHRoaXMuJGhlaWdodC52YWx1ZSA9IHZhbHVlOyB9XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy4kd2lkdGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd2lkdGgnKTtcblx0XHR0aGlzLiRoZWlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaGVpZ2h0Jyk7XG5cdFx0dGhpcy4kcGVybWFsaW5rID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Blcm1hbGluaycpO1xuXHRcdHRoaXMuJGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjYW52YXMnKTtcblxuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNnZW5lcmF0ZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dGhpcy5nZW5lcmF0ZSgpO1xuXHRcdH0pO1xuXG5cdFx0ZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldmVudCkgPT4ge1xuXHRcdFx0bGV0IGtleSA9IGV2ZW50LmtleSB8fCBldmVudC5jaGFyQ29kZSB8fCBldmVudC5rZXlDb2RlO1xuXHRcdFx0bGV0IGRpcmVjdGlvbiA9IFsnd2VzdCcsICdub3J0aCcsICdlYXN0JywgJ3NvdXRoJ11ba2V5IC0gMzddO1xuXHRcdFx0aWYgKCFkaXJlY3Rpb24pIHJldHVybjtcblxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHRoaXMubWF6ZS5tb3ZlKGRpcmVjdGlvbik7XG5cdFx0fSk7XG5cblx0XHR0aGlzLiRjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGV2ZW50KSA9PiB7XG5cdFx0XHR0aGlzLm1hemUuaG92ZXIoZXZlbnQubGF5ZXJYLCBldmVudC5sYXllclkpO1xuXHRcdH0pO1xuXG5cdFx0Ly8gQXR0ZW1wdCB0byByZWFkIG1hemUgcGFyYW1ldGVycyBmcm9tIFVSTCBoYXNoXG5cdFx0bGV0IFssIHdpZHRoLCBoZWlnaHQsIHNlZWRdID0gLyMoXFxkKyl4KFxcZCspKD86cyhcXGQrLlxcZCspKT98LiovLmV4ZWMod2luZG93LmxvY2F0aW9uLmhhc2gpO1xuXG5cdFx0aWYgKHdpZHRoICYmIGhlaWdodCkge1xuXHRcdFx0dGhpcy53aWR0aCA9IHdpZHRoO1xuXHRcdFx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cdFx0fVxuXG5cdFx0aWYgKHNlZWQpIHtcblx0XHRcdHJhbmRvbS5zZWVkID0gcGFyc2VGbG9hdChzZWVkKTtcblx0XHR9XG5cblx0XHR0aGlzLmdlbmVyYXRlKCk7XG5cdH1cblxuXHRnZW5lcmF0ZSgpIHtcblx0XHR0aGlzLnNldFBlcm1hbGluaygpO1xuXG5cdFx0dGhpcy5tYXplID0gbmV3IE1hemUodGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXHRcdHRoaXMubWF6ZS5yZW5kZXIodGhpcy4kY2FudmFzKTtcblx0fVxuXG5cdHNldFBlcm1hbGluaygpIHtcblx0XHRsZXQgaGFzaCA9IGAjJHt0aGlzLndpZHRofXgke3RoaXMuaGVpZ2h0fXMke3JhbmRvbS5zZWVkfWA7XG5cdFx0bGV0IGhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdCgnIycpWzBdICsgaGFzaDtcblx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IGhhc2g7XG5cdFx0dGhpcy4kcGVybWFsaW5rLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuXHR9XG59XG5cbm5ldyBBcHAoKTtcbiIsImltcG9ydCBtb2QgZnJvbSAnLi9tb2QnO1xuXG5jb25zdCBTSVpFID0gMjA7IC8vIFdpZHRoIG9mIGEgc3F1YXJlIGluIHBpeGVsc1xuY29uc3QgV0VJR0hUID0gMjsgLy8gV2lkdGggb2YgdGhlIGxpbmUgYmV0d2VlbiBzcXVhcmVzIGluIHBpeGVsc1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmlkIHtcblxuXHRnZXQgcGl4ZWxIZWlnaHQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuY3R4LmNhbnZhcy5oZWlnaHQ7XG5cdH1cblxuXHRzZXQgcGl4ZWxIZWlnaHQocGl4ZWxzKSB7XG5cdFx0dGhpcy5jdHguY2FudmFzLmhlaWdodCA9IHBpeGVscztcblx0fVxuXG5cdGdldCBwaXhlbFdpZHRoKCkge1xuXHRcdHJldHVybiB0aGlzLmN0eC5jYW52YXMud2lkdGg7XG5cdH1cblxuXHRzZXQgcGl4ZWxXaWR0aChwaXhlbHMpIHtcblx0XHR0aGlzLmN0eC5jYW52YXMud2lkdGggPSBwaXhlbHM7XG5cdH1cblxuXHRnZXQgZ3JpZEhlaWdodCgpIHtcblx0XHRyZXR1cm4gKHRoaXMucGl4ZWxIZWlnaHQgLSBXRUlHSFQpIC8gKFNJWkUgKyBXRUlHSFQpO1xuXHR9XG5cblx0c2V0IGdyaWRIZWlnaHQoc3F1YXJlcykge1xuXHRcdHRoaXMucGl4ZWxIZWlnaHQgPSBzcXVhcmVzICogU0laRSArIChzcXVhcmVzICsgMSkgKiBXRUlHSFQ7XG5cdH1cblxuXHRnZXQgZ3JpZFdpZHRoKCkge1xuXHRcdHJldHVybiAodGhpcy5waXhlbFdpZHRoIC0gV0VJR0hUKSAvIChTSVpFICsgV0VJR0hUKTtcblx0fVxuXG5cdHNldCBncmlkV2lkdGgoc3F1YXJlcykge1xuXHRcdHRoaXMucGl4ZWxXaWR0aCA9IHNxdWFyZXMgKiBTSVpFICsgKHNxdWFyZXMgKyAxKSAqIFdFSUdIVDtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBmcm9tIHNxdWFyZSB1bml0cyB0byBwaXhlbCB1bml0cy5cblx0ICogQHBhcmFtIHtpbnR9IHNxdWFyZXMgWmVyby1iYXNlZCBzcXVhcmUgY29vcmRpbmF0ZS5cblx0ICogQHJldHVybnMge2ludH0gVGhlIGNvb3JkaW5hdGUgb2YgdGhlIHBpeGVsIGNsb3Nlc3QgdG8gdGhlIG9yaWdpbiBpbiB0aGUgc3F1YXJlLlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRzdGF0aWMgdG9QaXhlbHMoc3F1YXJlcykge1xuXHRcdHJldHVybiAoV0VJR0hUIC8gMikgKyBzcXVhcmVzICogKFdFSUdIVCArIFNJWkUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGZyb20gcGl4ZWwgdW5pdHMgdG8gc3F1YXJlIHVuaXRzLlxuXHQgKiBAcGFyYW0ge2ludH0gcGl4ZWxzIFplcm8tYmFzZWQgY29vcmRpbmF0ZSBvZiBhIHBpeGVsLlxuXHQgKiBAcmV0dXJucyB7aW50fSBUaGUgemVyby1iYXNlZCBjb29yZGluYXRlIG9mIHRoZSBzcXVhcmUgY29udGFpbmluZyB0aGUgcGl4ZWwsIG9yIC0xIGlmIHRoZVxuXHQgKiAgICAgICAgICAgICAgICBwaXhlbCBpcyBvbiBhIGJvdW5kYXJ5IGJldHdlZW4gc3F1YXJlcy5cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0c3RhdGljIHRvU3F1YXJlcyhwaXhlbHMpIHtcblx0XHRpZiAobW9kKHBpeGVscyAtIFdFSUdIVCwgU0laRSArIFdFSUdIVCkgPj0gKFNJWkUgLSBXRUlHSFQpKSB7XG5cdFx0XHQvLyBPbiBhIGxpbmVcblx0XHRcdHJldHVybiAtMTtcblx0XHR9XG5cblx0XHRyZXR1cm4gTWF0aC5mbG9vcigocGl4ZWxzIC0gV0VJR0hUKSAvIChTSVpFICsgV0VJR0hUKSk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBHcmlkIGluc3RhbmNlIGdpdmVuIGEgZHJhd2luZyBjYW52YXMuXG5cdCAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR9ICRjYW52YXMgVGhlIDxjYW52YXM+IGVsZW1lbnQgb24gd2hpY2ggdG8gZHJhdy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKCRjYW52YXMpIHtcblx0XHR0aGlzLmN0eCA9ICRjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDbGVhcnMgdGhlIGVudGlyZSBkcmF3aW5nIHN1cmZhY2UuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRjbGVhcigpIHtcblx0XHR0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5waXhlbFdpZHRoLCB0aGlzLnBpeGVsSGVpZ2h0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBGaWxscyB0aGUgaW50ZXJpb3Igb2YgYSBncmlkIHNxdWFyZSB3aXRoIGEgY29sb3IuXG5cdCAqIEBwYXJhbSB7aW50fSB4IFplcm8tYmFzZWQgeC1jb29yZGluYXRlIG9mIHRoZSBzcXVhcmUgaW4gdW5pdHMgb2Ygc3F1YXJlcy5cblx0ICogQHBhcmFtIHtpbnR9IHkgWmVyby1iYXNlZCB5LWNvb3JkaW5hdGUgb2YgdGhlIHNxdWFyZSBpbiB1bml0cyBvZiBzcXVhcmVzLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gY29sb3IgQSBDU1MgY29sb3IgdmFsdWUuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRmaWxsKHgsIHksIGNvbG9yKSB7XG5cdFx0Y29uc3QgY3R4ID0gdGhpcy5jdHg7XG5cdFx0Y29uc3QgX2ZpbGxTdHlsZSA9IGN0eC5maWxsU3R5bGU7XG5cdFx0Y3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuXG5cdFx0Y3R4LmZpbGxSZWN0KFxuXHRcdFx0R3JpZC50b1BpeGVscyh4KSArIChXRUlHSFQgLyAyKSxcblx0XHRcdEdyaWQudG9QaXhlbHMoeSkgKyAoV0VJR0hUIC8gMiksXG5cdFx0XHRTSVpFLFxuXHRcdFx0U0laRVxuXHRcdCk7XG5cblx0XHRjdHguZmlsbFN0eWxlID0gX2ZpbGxTdHlsZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEcmF3cyB0aGUgYm9yZGVyIHNoYXJlZCBieSB0d28gc3F1YXJlcy5cblx0ICogQHBhcmFtIHtpbnR9IHgxIFplcm8tYmFzZWQgeC1jb29yZGluYXRlIG9mIHRoZSBmaXJzdCBzcXVhcmUgaW4gdW5pdHMgb2Ygc3F1YXJlcy5cblx0ICogQHBhcmFtIHtpbnR9IHkxIFplcm8tYmFzZWQgeS1jb29yZGluYXRlIG9mIHRoZSBmaXJzdCBzcXVhcmUgaW4gdW5pdHMgb2Ygc3F1YXJlcy5cblx0ICogQHBhcmFtIHtpbnR9IHgyIFplcm8tYmFzZWQgeC1jb29yZGluYXRlIG9mIHRoZSBzZWNvbmQgc3F1YXJlIGluIHVuaXRzIG9mIHNxdWFyZXMuXG5cdCAqIEBwYXJhbSB7aW50fSB5MiBaZXJvLWJhc2VkIHktY29vcmRpbmF0ZSBvZiB0aGUgc2Vjb25kIHNxdWFyZSBpbiB1bml0cyBvZiBzcXVhcmVzLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gY29sb3IgQSBDU1MgY29sb3IgdmFsdWUuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRicmlkZ2UoeDEsIHkxLCB4MiwgeTIsIGNvbG9yKSB7XG5cdFx0aWYgKE1hdGguYWJzKHgyIC0geDEpICsgTWF0aC5hYnMoeTIgLSB5MSkgIT09IDEpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignU3F1YXJlcyBhcmUgbm90IGFkamFjZW50LicpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHggPSBNYXRoLm1heCh4MSwgeDIpO1xuXHRcdGNvbnN0IHkgPSBNYXRoLm1heCh5MSwgeTIpO1xuXG5cdFx0Y29uc3QgY3R4ICAgICAgICAgID0gdGhpcy5jdHg7XG5cdFx0Y29uc3QgX2xpbmVDYXAgICAgID0gY3R4LmxpbmVDYXA7XG5cdFx0Y29uc3QgX2xpbmVXaWR0aCAgID0gY3R4LmxpbmVXaWR0aDtcblx0XHRjb25zdCBfc3Ryb2tlU3R5bGUgPSBjdHguc3Ryb2tlU3R5bGU7XG5cdFx0Y3R4LmxpbmVDYXAgICAgICAgID0gJ3NxdWFyZSc7XG5cdFx0Y3R4LmxpbmVXaWR0aCAgICAgID0gV0VJR0hUO1xuXHRcdGN0eC5zdHJva2VTdHlsZSAgICA9IGNvbG9yO1xuXG5cdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdGlmICh4MSA9PT0geDIpIHtcblx0XHRcdC8vIEJyaWRnZSBub3J0aC9zb3V0aCBzcXVhcmVzXG5cdFx0XHQvLyBOYXJyb3dlciB4IGRpbWVuc2lvbnNcblx0XHRcdGN0eC5tb3ZlVG8oR3JpZC50b1BpeGVscyh4MSkgKyBXRUlHSFQsIEdyaWQudG9QaXhlbHMoeSkpO1xuXHRcdFx0Y3R4LmxpbmVUbyhHcmlkLnRvUGl4ZWxzKHgxICsgMSkgLSBXRUlHSFQsIEdyaWQudG9QaXhlbHMoeSkpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBCcmlkZ2UgZWFzdC93ZXN0IHNxdWFyZXNcblx0XHRcdC8vIE5hcnJvd2VyIHkgZGltZW5zaW9uc1xuXHRcdFx0Y3R4Lm1vdmVUbyhHcmlkLnRvUGl4ZWxzKHgpLCBHcmlkLnRvUGl4ZWxzKHkxKSArIFdFSUdIVCk7XG5cdFx0XHRjdHgubGluZVRvKEdyaWQudG9QaXhlbHMoeCksIEdyaWQudG9QaXhlbHMoeTEgKyAxKSAtIFdFSUdIVCk7XG5cdFx0fVxuXHRcdGN0eC5zdHJva2UoKTtcblxuXHRcdGN0eC5saW5lQ2FwICAgICA9IF9saW5lQ2FwO1xuXHRcdGN0eC5saW5lV2lkdGggICA9IF9saW5lV2lkdGg7XG5cdFx0Y3R4LnN0cm9rZVN0eWxlID0gX3N0cm9rZVN0eWxlO1xuXHR9XG5cblx0LyoqXG5cdCAqIERyYXdzIGEgbGluZSBiZXR3ZWVuIHRoZSB1cHBlciBsZWZ0IGNvcm5lcnMgb2YgdHdvIGdyaWQgc3F1YXJlcy5cblx0ICogQHBhcmFtIHtpbnR9IHgxIFplcm8tYmFzZWQgeC1jb29yZGluYXRlIG9mIHRoZSBmaXJzdCBzcXVhcmUgcmVsYXRpdmUgdG8gdGhlIG9yaWdpbi5cblx0ICogQHBhcmFtIHtpbnR9IHkxIFplcm8tYmFzZWQgeS1jb29yZGluYXRlIG9mIHRoZSBmaXJzdCBzcXVhcmUgcmVsYXRpdmUgdG8gdGhlIG9yaWdpbi5cblx0ICogQHBhcmFtIHtpbnR9IHgyIFplcm8tYmFzZWQgeC1jb29yZGluYXRlIG9mIHRoZSBzZWNvbmQgc3F1YXJlIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW4uXG5cdCAqIEBwYXJhbSB7aW50fSB5MiBaZXJvLWJhc2VkIHktY29vcmRpbmF0ZSBvZiB0aGUgc2Vjb25kIHNxdWFyZSByZWxhdGl2ZSB0byB0aGUgb3JpZ2luLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gW2NvbG9yPScjMTYxOTFkJ10gQSBDU1MgY29sb3IgdmFsdWUuIERlZmF1bHRzIHRvIGEgZGFyayBncmF5LlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0bGluZSh4MSwgeTEsIHgyLCB5MiwgY29sb3IgPSAnIzE2MTkxZCcpIHtcblx0XHRjb25zdCBjdHggICAgICAgICAgPSB0aGlzLmN0eDtcblx0XHRjb25zdCBfbGluZUNhcCAgICAgPSBjdHgubGluZUNhcDtcblx0XHRjb25zdCBfbGluZVdpZHRoICAgPSBjdHgubGluZVdpZHRoO1xuXHRcdGNvbnN0IF9zdHJva2VTdHlsZSA9IGN0eC5zdHJva2VTdHlsZTtcblx0XHRjdHgubGluZUNhcCAgICAgICAgPSAnc3F1YXJlJztcblx0XHRjdHgubGluZVdpZHRoICAgICAgPSBXRUlHSFQ7XG5cdFx0Y3R4LnN0cm9rZVN0eWxlICAgID0gY29sb3I7XG5cblx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0Y3R4Lm1vdmVUbyhHcmlkLnRvUGl4ZWxzKHgxKSwgR3JpZC50b1BpeGVscyh5MSkpO1xuXHRcdGN0eC5saW5lVG8oR3JpZC50b1BpeGVscyh4MiksIEdyaWQudG9QaXhlbHMoeTIpKTtcblx0XHRjdHguc3Ryb2tlKCk7XG5cblx0XHRjdHgubGluZUNhcCAgICAgPSBfbGluZUNhcDtcblx0XHRjdHgubGluZVdpZHRoICAgPSBfbGluZVdpZHRoO1xuXHRcdGN0eC5zdHJva2VTdHlsZSA9IF9zdHJva2VTdHlsZTtcblx0fVxuXG59XG4iLCJ2YXIgR3JpZCA9IHJlcXVpcmUoJy4vZ3JpZCcpO1xudmFyIHJhbmRvbSA9IHJlcXVpcmUoJy4vcmFuZG9tJyk7XG5cbnZhciBNYXplID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQpIHtcblxuXHR2YXIgRElSRUNUSU9OUyA9IFsnbm9ydGgnLCAnc291dGgnLCAnZWFzdCcsICd3ZXN0J107XG5cdHZhciBHUkVFTiA9ICcjNGVjZGM0JywgUkVEID0gJyNmZjZiNmInO1xuXG5cdHZhciBwYXRoID0gW107XG5cdHZhciBtYXplLCBncmlkO1xuXG5cdGZ1bmN0aW9uIHJhbmRvbUludChtYXgpIHtcblx0XHRyZXR1cm4gTWF0aC5mbG9vcihyYW5kb20oKSAqIG1heCk7XG5cdH1cblxuXHRmdW5jdGlvbiByYW5kb21FbGVtZW50KGFycikge1xuXHRcdHJldHVybiBhcnJbcmFuZG9tSW50KGFyci5sZW5ndGgpXTtcblx0fVxuXG5cdGZ1bmN0aW9uIGxhc3RFbGVtZW50KGFycikge1xuXHRcdHJldHVybiBhcnJbYXJyLmxlbmd0aCAtIDFdO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIGNvb3JkaW5hdGVzIG9mIGFuIGFkamFjZW50IHNxdWFyZS5cblx0ICogQHBhcmFtIHtvYmplY3R9IHN0YXJ0IFN0YXJ0aW5nIHNxdWFyZSdzIGNvb3JkaW5hdGVzLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZGlyZWN0aW9uIENhcmRpbmFsIGRpcmVjdGlvbiBvZiBhZGphY2VudCBzcXVhcmUuXG5cdCAqIEByZXR1cm5zIHtvYmplY3R9IEFkamFjZW50IHNxdWFyZSdzIGNvb3JkaW5hdGVzLlxuXHQgKi9cblx0ZnVuY3Rpb24gYWRqYWNlbnRTcXVhcmUoc3RhcnQsIGRpcmVjdGlvbikge1xuXHRcdHN3aXRjaCAoZGlyZWN0aW9uKSB7XG5cdFx0XHRjYXNlICdub3J0aCc6XG5cdFx0XHRcdHJldHVybiBzdGFydC55ID4gMFxuXHRcdFx0XHRcdD8geyB4OiBzdGFydC54LCB5OiBzdGFydC55IC0gMSB9XG5cdFx0XHRcdFx0OiBudWxsO1xuXHRcdFx0Y2FzZSAnc291dGgnOlxuXHRcdFx0XHRyZXR1cm4gc3RhcnQueSA8IGhlaWdodCAtIDFcblx0XHRcdFx0XHQ/IHsgeDogc3RhcnQueCwgeTogc3RhcnQueSArIDEgfVxuXHRcdFx0XHRcdDogbnVsbDtcblx0XHRcdGNhc2UgJ2Vhc3QnOlxuXHRcdFx0XHRyZXR1cm4gc3RhcnQueCA8IHdpZHRoIC0gMVxuXHRcdFx0XHRcdD8geyB4OiBzdGFydC54ICsgMSwgeTogc3RhcnQueSB9XG5cdFx0XHRcdFx0OiBudWxsO1xuXHRcdFx0Y2FzZSAnd2VzdCc6XG5cdFx0XHRcdHJldHVybiBzdGFydC54ID4gMFxuXHRcdFx0XHRcdD8geyB4OiBzdGFydC54IC0gMSwgeTogc3RhcnQueSB9XG5cdFx0XHRcdFx0OiBudWxsO1xuXHRcdFx0ZGVmYXVsdDogdGhyb3cgbmV3IEV4Y2VwdGlvbignSW52YWxpZCBkaXJlY3Rpb24gJyArIGRpcik7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIGNvb3JkaW5hdGVzIG9mIGFsbCBzcXVhcmVzIGFkamFjZW50IHRvIGEgZ2l2ZW4gc3F1YXJlLlxuXHQgKiBAcGFyYW0ge29iamVjdH0gc3RhcnQgQ29vcmRpbmF0ZXMgb2YgdGhlIHN0YXJ0aW5nIHNxdWFyZS5cblx0ICogQHJldHVybnMge29iamVjdH0gQ29vcmRpbmF0ZXMgb2YgYWRqYWNlbnQgc3F1YXJlcyBpbiBlYWNoIGRpcmVjdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIGFkamFjZW50U3F1YXJlcyhzdGFydCkge1xuXHRcdHJldHVybiBESVJFQ1RJT05TLnJlZHVjZSgob2JqLCBkaXIpID0+IHtcblx0XHRcdG9ialtkaXJdID0gYWRqYWNlbnRTcXVhcmUoc3RhcnQsIGRpcik7XG5cdFx0XHRyZXR1cm4gb2JqO1xuXHRcdH0sIHt9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSByZWxhdGl2ZSBkaXJlY3Rpb24gYmV0d2VlbiB0d28gYWRqYWNlbnQgc3F1YXJlcy5cblx0ICogQHBhcmFtIHtvYmplY3R9IHN0YXJ0IFRoZSBzdGFydGluZyBzcXVhcmUuXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBlbmQgVGhlIGVuZGluZyBzcXVhcmUuXG5cdCAqIEByZXR1cm5zIHtzdHJpZ259IENhcmRpbmFsIGRpcmVjdGlvbiBmcm9tIHN0YXJ0IHRvIGVuZC5cblx0ICovXG5cdGZ1bmN0aW9uIHJlbGF0aXZlRGlyZWN0aW9uKHN0YXJ0LCBlbmQpIHtcblx0XHRpZiAoTWF0aC5hYnMoZW5kLnggLSBzdGFydC54KSArIE1hdGguYWJzKGVuZC55IC0gc3RhcnQueSkgPiAxKSB7XG5cdFx0XHQvLyBTcXVhcmVzIGFyZSBub3QgYWRqYWNlbnRcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGlmIChzdGFydC54IDwgZW5kLngpIHtcblx0XHRcdHJldHVybiAnZWFzdCc7XG5cdFx0fSBlbHNlIGlmIChlbmQueCA8IHN0YXJ0LngpIHtcblx0XHRcdHJldHVybiAnd2VzdCc7XG5cdFx0fSBlbHNlIGlmIChzdGFydC55IDwgZW5kLnkpIHtcblx0XHRcdHJldHVybiAnc291dGgnO1xuXHRcdH0gZWxzZSBpZiAoZW5kLnkgPCBzdGFydC55KSB7XG5cdFx0XHRyZXR1cm4gJ25vcnRoJztcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBnZW5lcmF0ZSgpIHtcblx0XHR2YXIgbWVzaCA9IFtdO1xuXHRcdHZhciBlZGdlcyA9IFtdO1xuXHRcdHZhciBsZW5ndGggPSAwO1xuXHRcdHZhciB4LCB5O1xuXHRcdHZhciBzdGFydCwgZW5kO1xuXG5cdFx0ZnVuY3Rpb24gZ2V0U3F1YXJlKHNxdWFyZSkge1xuXHRcdFx0cmV0dXJuIG1lc2hbc3F1YXJlLnhdW3NxdWFyZS55XTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBpc29sYXRlZChzcXVhcmUpIHtcblx0XHRcdHNxdWFyZSA9IGdldFNxdWFyZShzcXVhcmUpO1xuXHRcdFx0cmV0dXJuIERJUkVDVElPTlMuZXZlcnkoZGlyID0+IHNxdWFyZVtkaXJdICE9PSB0cnVlKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjb25uZWN0KGEsIGIpIHtcblx0XHRcdC8vY29uc29sZS5sb2coWydDT05ORUNUSU5HICgnLGEueCwnLCcsYS55LCcpIGFuZCAoJyxiLngsJywnLGIueSwnKS4nXS5qb2luKCcnKSk7XG5cdFx0XHRtZXNoW2EueF1bYS55XVtyZWxhdGl2ZURpcmVjdGlvbihhLCBiKV0gPSB0cnVlO1xuXHRcdFx0bWVzaFtiLnhdW2IueV1bcmVsYXRpdmVEaXJlY3Rpb24oYiwgYSldID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBvcGVuRWRnZShzcXVhcmUpIHtcblx0XHRcdHZhciB7eCwgeX0gPSBzcXVhcmU7XG5cdFx0XHRpZiAoeCA9PT0gMCkge1xuXHRcdFx0XHRtZXNoW3hdW3ldLndlc3QgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmICh5ID09PSAwKSB7XG5cdFx0XHRcdG1lc2hbeF1beV0ubm9ydGggPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmICh4ID09PSAod2lkdGggLSAxKSkge1xuXHRcdFx0XHRtZXNoW3hdW3ldLmVhc3QgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmICh5ID09PSAoaGVpZ2h0IC0gMSkpIHtcblx0XHRcdFx0bWVzaFt4XVt5XS5zb3V0aCA9IHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0Rlc3RpbmF0aW9uIG5vdCBvbiBlZGdlLicpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNlYXJjaChwb3MpIHtcblx0XHRcdHZhciBhZGphY2VuY2llcywgb3B0aW9ucywgaGVhZGluZywgbmV4dDtcblxuXHRcdFx0aWYgKHBvcy54ID09PSBlbmQueCAmJiBwb3MueSA9PT0gZW5kLnkpIHtcblx0XHRcdFx0b3BlbkVkZ2UocG9zKTtcblx0XHRcdFx0Y29uc29sZS5sb2coJ0xFTkdUSCcsIGxlbmd0aCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0YWRqYWNlbmNpZXMgPSBhZGphY2VudFNxdWFyZXMocG9zKTtcblxuXHRcdFx0d2hpbGUgKDEpIHtcblx0XHRcdFx0b3B0aW9ucyA9IE9iamVjdC5rZXlzKGFkamFjZW5jaWVzKVxuXHRcdFx0XHRcdC5maWx0ZXIoZGlyID0+IGFkamFjZW5jaWVzW2Rpcl0pXG5cdFx0XHRcdFx0LmZpbHRlcihkaXIgPT4gaXNvbGF0ZWQoYWRqYWNlbnRTcXVhcmUocG9zLCBkaXIpKSk7XG5cdFx0XHRcdGlmICghb3B0aW9ucy5sZW5ndGgpIGJyZWFrO1xuXG5cdFx0XHRcdGhlYWRpbmcgPSByYW5kb21FbGVtZW50KG9wdGlvbnMpO1xuXHRcdFx0XHRuZXh0ID0gYWRqYWNlbmNpZXNbaGVhZGluZ107XG5cdFx0XHRcdGNvbm5lY3QocG9zLCBuZXh0KTtcblx0XHRcdFx0bGVuZ3RoKys7XG5cdFx0XHRcdHNlYXJjaChuZXh0KTtcblx0XHRcdFx0bGVuZ3RoLS07XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRmb3IgKHggPSAwOyB4IDwgd2lkdGg7IHgrKykge1xuXHRcdFx0bWVzaFt4XSA9IFtdO1xuXHRcdFx0Zm9yICh5ID0gMDsgeSA8IGhlaWdodDsgeSsrKSB7XG5cdFx0XHRcdGlmICh4ID09PSAwIHx8XG5cdFx0XHRcdFx0eSA9PT0gMCB8fFxuXHRcdFx0XHRcdHggPT09ICh3aWR0aCAtIDEpIHx8XG5cdFx0XHRcdFx0eSA9PT0gKGhlaWdodCAtIDEpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdGVkZ2VzLnB1c2goe3gsIHl9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdG1lc2hbeF1beV0gPSB7XG5cdFx0XHRcdFx0bm9ydGg6IDAgPCB5ID8gZmFsc2UgOiBudWxsLFxuXHRcdFx0XHRcdHNvdXRoOiB5IDwgKGhlaWdodCAtIDEpID8gZmFsc2UgOiBudWxsLFxuXHRcdFx0XHRcdHdlc3Q6IDAgPCB4ID8gZmFsc2UgOiBudWxsLFxuXHRcdFx0XHRcdGVhc3Q6IHggPCAod2lkdGggLSAxKSA/IGZhbHNlIDogbnVsbFxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHN0YXJ0ID0gcmFuZG9tRWxlbWVudChlZGdlcyk7XG5cdFx0cGF0aC5wdXNoKHN0YXJ0KTtcblx0XHRkbyB7XG5cdFx0XHRlbmQgPSByYW5kb21FbGVtZW50KGVkZ2VzKTtcblx0XHR9IHdoaWxlIChzdGFydC54ID09PSBlbmQueCB8fCBzdGFydC55ID09PSBlbmQueSk7XG5cblx0XHRvcGVuRWRnZShzdGFydCk7XG5cdFx0c2VhcmNoKHN0YXJ0KTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRtZXNoLFxuXHRcdFx0c3RhcnQsXG5cdFx0XHRlbmRcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gYnJpZGdlRWRnZShzcXVhcmUsIGNvbG9yKSB7XG5cdFx0aWYgKHNxdWFyZS54ID09PSAwKSB7IC8vIFdlc3Rcblx0XHRcdGdyaWQuYnJpZGdlKHNxdWFyZS54IC0gMSwgc3F1YXJlLnksIHNxdWFyZS54LCBzcXVhcmUueSwgY29sb3IpO1xuXHRcdH0gZWxzZSBpZiAoc3F1YXJlLnkgPT09IDApIHsgLy8gTm9ydGhcblx0XHRcdGdyaWQuYnJpZGdlKHNxdWFyZS54LCBzcXVhcmUueSAtIDEsIHNxdWFyZS54LCBzcXVhcmUueSwgY29sb3IpO1xuXHRcdH0gZWxzZSBpZiAoc3F1YXJlLnggPT09ICh3aWR0aCAtIDEpKSB7IC8vIEVhc3Rcblx0XHRcdGdyaWQuYnJpZGdlKHNxdWFyZS54LCBzcXVhcmUueSwgc3F1YXJlLnggKyAxLCBzcXVhcmUueSwgY29sb3IpO1xuXHRcdH0gZWxzZSBpZiAoc3F1YXJlLnkgPT09IChoZWlnaHQgLSAxKSkgeyAvLyBTb3V0aFxuXHRcdFx0Z3JpZC5icmlkZ2Uoc3F1YXJlLngsIHNxdWFyZS55LCBzcXVhcmUueCwgc3F1YXJlLnkgKyAxLCBjb2xvcik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignU3F1YXJlIGlzIG5vdCBvbiBlZGdlLicpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHJlbmRlcigkZWwpIHtcblx0XHR2YXIgeCwgeTtcblxuXHRcdGdyaWQgPSBuZXcgR3JpZCgkZWwpO1xuXHRcdGdyaWQuY2xlYXIoKTtcblx0XHRncmlkLmdyaWRXaWR0aCA9IHdpZHRoO1xuXHRcdGdyaWQuZ3JpZEhlaWdodCA9IGhlaWdodDtcblxuXHRcdGZvciAoeCA9IDA7IHggPCB3aWR0aDsgeCsrKSB7XG5cdFx0XHRmb3IgKHkgPSAwOyB5IDwgaGVpZ2h0OyB5KyspIHtcblx0XHRcdFx0aWYgKCFtYXplLm1lc2hbeF1beV0ud2VzdCkge1xuXHRcdFx0XHRcdGdyaWQubGluZSh4LCB5LCB4LCB5ICsgMSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFtYXplLm1lc2hbeF1beV0ubm9ydGgpIHtcblx0XHRcdFx0XHRncmlkLmxpbmUoeCwgeSwgeCArIDEsIHkpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gT25seSBuZWVkIHRvIGRyYXcgc291dGggYW5kIGVhc3Qgb24gZWRnZXNcblx0XHRcdFx0aWYgKHggPT09IHdpZHRoIC0gMSAmJiAhbWF6ZS5tZXNoW3hdW3ldLmVhc3QpIHtcblx0XHRcdFx0XHRncmlkLmxpbmUoeCArIDEsIHksIHggKyAxLCB5ICsgMSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHkgPT09IGhlaWdodCAtIDEgJiYgIW1hemUubWVzaFt4XVt5XS5zb3V0aCkge1xuXHRcdFx0XHRcdGdyaWQubGluZSh4LCB5ICsgMSwgeCArIDEsIHkgKyAxKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGdyaWQuZmlsbChtYXplLnN0YXJ0LngsIG1hemUuc3RhcnQueSwgR1JFRU4pO1xuXHRcdGdyaWQuZmlsbChtYXplLmVuZC54LCBtYXplLmVuZC55LCBSRUQpO1xuXHRcdGJyaWRnZUVkZ2UobWF6ZS5zdGFydCwgR1JFRU4pO1xuXHRcdGJyaWRnZUVkZ2UobWF6ZS5lbmQsIFJFRCk7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3ZlKGRpcikge1xuXHRcdHZhciBwb3MgPSBsYXN0RWxlbWVudChwYXRoKTtcblx0XHR2YXIgcHJldmlvdXMgPSBwYXRoW3BhdGgubGVuZ3RoIC0gMl07XG5cdFx0dmFyIG5leHQ7XG5cblx0XHQvLyBEb24ndCBicmVhayBkb3duIHdhbGxzXG5cdFx0aWYgKCFtYXplLm1lc2hbcG9zLnhdW3Bvcy55XVtkaXJdKSByZXR1cm4gZmFsc2U7XG5cblx0XHRuZXh0ID0gYWRqYWNlbnRTcXVhcmUocG9zLCBkaXIpO1xuXHRcdGlmICghbmV4dCkgcmV0dXJuIGZhbHNlO1xuXG5cdFx0aWYgKHByZXZpb3VzICYmIG5leHQueCA9PT0gcHJldmlvdXMueCAmJiBuZXh0LnkgPT09IHByZXZpb3VzLnkpIHtcblx0XHRcdGdyaWQuYnJpZGdlKHBvcy54LCBwb3MueSwgbmV4dC54LCBuZXh0LnksIFJFRCk7XG5cdFx0XHRncmlkLmZpbGwocG9zLngsIHBvcy55LCBSRUQpO1xuXHRcdFx0cGF0aC5wb3AoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Z3JpZC5icmlkZ2UocG9zLngsIHBvcy55LCBuZXh0LngsIG5leHQueSwgR1JFRU4pO1xuXHRcdFx0Z3JpZC5maWxsKG5leHQueCwgbmV4dC55LCBHUkVFTik7XG5cdFx0XHRwYXRoLnB1c2gobmV4dCk7XG5cdFx0fVxuXG5cdFx0aWYgKG5leHQueCA9PT0gbWF6ZS5lbmQueCAmJiBuZXh0LnkgPT09IG1hemUuZW5kLnkpIHtcblx0XHRcdGJyaWRnZUVkZ2UobmV4dCwgR1JFRU4pO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGVudGVyU3F1YXJlKHNxdWFyZSkge1xuXHRcdHZhciBwb3MgPSBsYXN0RWxlbWVudChwYXRoKTtcblx0XHR2YXIgZGlyID0gcmVsYXRpdmVEaXJlY3Rpb24ocG9zLCBzcXVhcmUpO1xuXHRcdGlmIChkaXIpIG1vdmUoZGlyKTtcblx0fVxuXG5cdHZhciBob3ZlciA9IChmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIF94LCBfeTtcblxuXHRcdHJldHVybiBmdW5jdGlvbiAoeCwgeSkge1xuXHRcdFx0eCA9IEdyaWQudG9TcXVhcmVzKHgpO1xuXHRcdFx0eSA9IEdyaWQudG9TcXVhcmVzKHkpO1xuXHRcdFx0aWYgKHggIT09IG51bGwgJiYgeSAhPT0gbnVsbCAmJiAoeCAhPT0gX3ggfHwgeSAhPT0gX3kpKSB7XG5cdFx0XHRcdF94ID0geDtcblx0XHRcdFx0X3kgPSB5O1xuXHRcdFx0XHRlbnRlclNxdWFyZSh7eCwgeX0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSkoKTtcblxuXHRtYXplID0gZ2VuZXJhdGUoKTtcblxuXHRyZXR1cm4ge1xuXHRcdHJlbmRlcixcblx0XHRtb3ZlLFxuXHRcdGhvdmVyXG5cdH07XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNYXplO1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGEsIGIpIHtcclxuXHRyZXR1cm4gKChhICUgYikgKyBiKSAlIGI7XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmFuZG9tKCkge1xuXHRsZXQgeCA9IE1hdGguc2luKHJhbmRvbS5zZWVkKyspICogMTAwMDA7XG5cdHJldHVybiB4IC0gTWF0aC5mbG9vcih4KTtcbn1cblxucmFuZG9tLnNlZWQgPSBNYXRoLnJhbmRvbSgpO1xuIl19