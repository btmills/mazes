(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Maze = _interopRequire(require("./maze"));

var random = require("./util").random;
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

},{"./maze":4,"./util":5}],2:[function(require,module,exports){
"use strict";

var DARK_GRAY = exports.DARK_GRAY = "#16191d";
var GREEN = exports.GREEN = "#4ecdc4";
var RED = exports.RED = "#ff7b7b";
Object.defineProperty(exports, "__esModule", {
  value: true
});

},{}],3:[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var mod = require("./util").mod;
var DARK_GRAY = require("./colors").DARK_GRAY;


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
    * @param {string} [color] A CSS color value. Defaults to dark gray.
    * @returns {void}
    * @public
    */
			value: function line(x1, y1, x2, y2) {
				var color = arguments[4] === undefined ? DARK_GRAY : arguments[4];
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

},{"./colors":2,"./util":5}],4:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Grid = _interopRequire(require("./grid"));

var _util = require("./util");

var lastElement = _util.lastElement;
var random = _util.random;
var randomElement = _util.randomElement;
var _colors = require("./colors");

var GREEN = _colors.GREEN;
var RED = _colors.RED;


var DIRECTIONS = ["north", "south", "east", "west"];

var Maze = (function () {
	function Maze(width, height) {
		_classCallCheck(this, Maze);

		this.width = width;
		this.height = height;
		this.maze = this.generate();
		this.path = [this.maze.start];
	}

	_prototypeProperties(Maze, {
		relativeDirection: {

			/**
    * Gets the relative direction between two adjacent squares.
    * @param {object} start The starting square.
    * @param {object} end The ending square.
    * @returns {strign} Cardinal direction from start to end.
    */
			value: function relativeDirection(start, end) {
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
			},
			writable: true,
			configurable: true
		}
	}, {
		getAdjacentSquare: {

			/**
    * Gets the coordinates of an adjacent square.
    * @param {object} start Starting square's coordinates.
    * @param {string} direction Cardinal direction of adjacent square.
    * @returns {object} Adjacent square's coordinates.
    */
			value: function getAdjacentSquare(start, direction) {
				switch (direction) {
					case "north":
						return start.y > 0 ? { x: start.x, y: start.y - 1 } : null;
					case "south":
						return start.y < this.height - 1 ? { x: start.x, y: start.y + 1 } : null;
					case "east":
						return start.x < this.width - 1 ? { x: start.x + 1, y: start.y } : null;
					case "west":
						return start.x > 0 ? { x: start.x - 1, y: start.y } : null;
					default:
						throw new Error("Invalid direction " + dir);
				}
			},
			writable: true,
			configurable: true
		},
		getAdjacentSquares: {

			/**
    * Gets the coordinates of all squares adjacent to a given square.
    * @param {object} start Coordinates of the starting square.
    * @returns {object} Coordinates of adjacent squares in each direction.
    */
			value: function getAdjacentSquares(start) {
				var _this = this;
				return DIRECTIONS.reduce(function (obj, dir) {
					obj[dir] = _this.getAdjacentSquare(start, dir);
					return obj;
				}, {});
			},
			writable: true,
			configurable: true
		},
		generate: {
			value: function generate() {
				var _this = this;
				var _ref = this;
				var width = _ref.width;
				var height = _ref.height;
				var mesh = [];
				var edges = [];
				var length = 0;
				var start = undefined,
				    end = undefined;

				function getSquare(_ref2) {
					var x = _ref2.x;
					var y = _ref2.y;
					return mesh[x][y];
				}

				function isIsolated(square) {
					square = getSquare(square);
					return DIRECTIONS.every(function (dir) {
						return square[dir] !== true;
					});
				}

				function connect(a, b) {
					getSquare(a)[Maze.relativeDirection(a, b)] = true;
					getSquare(b)[Maze.relativeDirection(b, a)] = true;
				}

				function openEdge(square) {
					var x = square.x;
					var y = square.y;
					var direction = undefined;

					if (x === 0) {
						direction = "west";
					} else if (y === 0) {
						direction = "north";
					} else if (x === width - 1) {
						direction = "east";
					} else if (y === height - 1) {
						direction = "south";
					} else {
						throw new Error("Destination not an edge.");
					}

					getSquare({ x: x, y: y })[direction] = true;
				}

				var search = function (pos) {
					var adjacencies = undefined,
					    options = undefined,
					    heading = undefined,
					    next = undefined;

					if (pos.x === end.x && pos.y == end.y) {
						openEdge(end);
						return;
					}

					adjacencies = _this.getAdjacentSquares(pos);

					while (1) {
						options = Object.keys(adjacencies).filter(function (dir) {
							return adjacencies[dir];
						}).filter(function (dir) {
							return isIsolated(_this.getAdjacentSquare(pos, dir));
						});
						if (!options.length) break;

						heading = randomElement(options);
						next = adjacencies[heading];
						connect(pos, next);
						length++;
						search(next);
						length--;
					}
				};

				for (var x = 0; x < width; x++) {
					mesh[x] = [];
					for (var y = 0; y < height; y++) {
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
			},
			writable: true,
			configurable: true
		},
		bridgeEdge: {
			value: function bridgeEdge(square, color) {
				if (square.x === 0) {
					// West
					this.grid.bridge(square.x - 1, square.y, square.x, square.y, color);
				} else if (square.y === 0) {
					// North
					this.grid.bridge(square.x, square.y - 1, square.x, square.y, color);
				} else if (square.x === this.width - 1) {
					// East
					this.grid.bridge(square.x, square.y, square.x + 1, square.y, color);
				} else if (square.y === this.height - 1) {
					// South
					this.grid.bridge(square.x, square.y, square.x, square.y + 1, color);
				} else {
					throw new Error("Square is not on edge.");
				}
			},
			writable: true,
			configurable: true
		},
		render: {

			/**
    * @public
    */
			value: function render($canvas) {
				var grid = this.grid = new Grid($canvas);
				var maze = this.maze;
				var _ref = this;
				var width = _ref.width;
				var height = _ref.height;


				grid.clear();
				grid.gridWidth = width;
				grid.gridHeight = height;

				for (var x = 0; x < width; x++) {
					for (var y = 0; y < height; y++) {
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
				this.bridgeEdge(maze.start, GREEN);
				this.bridgeEdge(maze.end, RED);
			},
			writable: true,
			configurable: true
		},
		move: {

			/**
    * @public
    */
			value: function move(dir) {
				var path = this.path;
				var pos = lastElement(path);
				var previous = path[path.length - 2];
				var next = undefined;

				// Don't break down walls
				if (!this.maze.mesh[pos.x][pos.y][dir]) {
					return false;
				}next = this.getAdjacentSquare(pos, dir);
				if (!next) {
					return false;
				}if (previous && next.x === previous.x && next.y === previous.y) {
					this.grid.bridge(pos.x, pos.y, next.x, next.y, RED);
					this.grid.fill(pos.x, pos.y, RED);
					this.path.pop();
				} else {
					this.grid.bridge(pos.x, pos.y, next.x, next.y, GREEN);
					this.grid.fill(next.x, next.y, GREEN);
					this.path.push(next);
				}

				if (next.x === this.maze.end.x && next.y === this.maze.end.y) {
					this.bridgeEdge(next, GREEN);
					return true;
				}

				return false;
			},
			writable: true,
			configurable: true
		},
		enterSquare: {
			value: function enterSquare(square) {
				var pos = lastElement(this.path);
				var dir = Maze.relativeDirection(pos, square);
				if (dir) this.move(dir);
			},
			writable: true,
			configurable: true
		},
		hover: {

			/**
    * @public
    */
			value: function hover(x, y) {
				x = Grid.toSquares(x);
				y = Grid.toSquares(y);

				if (x >= 0 && y >= 0 && (x !== this._x || y !== this._y)) {
					this._x = x;
					this._y = y;
					this.enterSquare({ x: x, y: y });
				}
			},
			writable: true,
			configurable: true
		}
	});

	return Maze;
})();

module.exports = Maze;





// var Grid2 = require('./grid');
// //var random2 = require('./random');

// var Maze2 = function (width, height) {

// 	var DIRECTIONS = ['north', 'south', 'east', 'west'];
// 	var GREEN = '#4ecdc4', RED = '#ff6b6b';

// 	var path = [];
// 	var maze, grid;

// 	/**
// 	 * Gets the coordinates of an adjacent square.
// 	 * @param {object} start Starting square's coordinates.
// 	 * @param {string} direction Cardinal direction of adjacent square.
// 	 * @returns {object} Adjacent square's coordinates.
// 	 */
// 	function adjacentSquare(start, direction) {
// 		switch (direction) {
// 			case 'north':
// 				return start.y > 0
// 					? { x: start.x, y: start.y - 1 }
// 					: null;
// 			case 'south':
// 				return start.y < height - 1
// 					? { x: start.x, y: start.y + 1 }
// 					: null;
// 			case 'east':
// 				return start.x < width - 1
// 					? { x: start.x + 1, y: start.y }
// 					: null;
// 			case 'west':
// 				return start.x > 0
// 					? { x: start.x - 1, y: start.y }
// 					: null;
// 			default: throw new Exception('Invalid direction ' + dir);
// 		}
// 	}

// 	/**
// 	 * Gets the coordinates of all squares adjacent to a given square.
// 	 * @param {object} start Coordinates of the starting square.
// 	 * @returns {object} Coordinates of adjacent squares in each direction.
// 	 */
// 	function adjacentSquares(start) {
// 		return DIRECTIONS.reduce((obj, dir) => {
// 			obj[dir] = adjacentSquare(start, dir);
// 			return obj;
// 		}, {});
// 	}

// 	/**
// 	 * Gets the relative direction between two adjacent squares.
// 	 * @param {object} start The starting square.
// 	 * @param {object} end The ending square.
// 	 * @returns {strign} Cardinal direction from start to end.
// 	 */
// 	function relativeDirection(start, end) {
// 		if (Math.abs(end.x - start.x) + Math.abs(end.y - start.y) > 1) {
// 			// Squares are not adjacent
// 			return null;
// 		}

// 		if (start.x < end.x) {
// 			return 'east';
// 		} else if (end.x < start.x) {
// 			return 'west';
// 		} else if (start.y < end.y) {
// 			return 'south';
// 		} else if (end.y < start.y) {
// 			return 'north';
// 		}
// 	}

// 	function generate() {
// 		var mesh = [];
// 		var edges = [];
// 		var length = 0;
// 		var x, y;
// 		var start, end;

// 		function getSquare(square) {
// 			return mesh[square.x][square.y];
// 		}

// 		function isolated(square) {
// 			square = getSquare(square);
// 			return DIRECTIONS.every(dir => square[dir] !== true);
// 		}

// 		function connect(a, b) {
// 			//console.log(['CONNECTING (',a.x,',',a.y,') and (',b.x,',',b.y,').'].join(''));
// 			mesh[a.x][a.y][relativeDirection(a, b)] = true;
// 			mesh[b.x][b.y][relativeDirection(b, a)] = true;
// 		}

// 		function openEdge(square) {
// 			var {x, y} = square;
// 			if (x === 0) {
// 				mesh[x][y].west = true;
// 			} else if (y === 0) {
// 				mesh[x][y].north = true;
// 			} else if (x === (width - 1)) {
// 				mesh[x][y].east = true;
// 			} else if (y === (height - 1)) {
// 				mesh[x][y].south = true;
// 			} else {
// 				throw new Error('Destination not on edge.');
// 			}
// 		}

// 		function search(pos) {
// 			var adjacencies, options, heading, next;

// 			if (pos.x === end.x && pos.y === end.y) {
// 				openEdge(pos);
// 				console.log('LENGTH', length);
// 				return;
// 			}

// 			adjacencies = adjacentSquares(pos);

// 			while (1) {
// 				options = Object.keys(adjacencies)
// 					.filter(dir => adjacencies[dir])
// 					.filter(dir => isolated(adjacentSquare(pos, dir)));
// 				if (!options.length) break;

// 				heading = randomElement(options);
// 				next = adjacencies[heading];
// 				connect(pos, next);
// 				length++;
// 				search(next);
// 				length--;
// 			}

// 		}

// 		for (x = 0; x < width; x++) {
// 			mesh[x] = [];
// 			for (y = 0; y < height; y++) {
// 				if (x === 0 ||
// 					y === 0 ||
// 					x === (width - 1) ||
// 					y === (height - 1)
// 				) {
// 					edges.push({x, y});
// 				}

// 				mesh[x][y] = {
// 					north: 0 < y ? false : null,
// 					south: y < (height - 1) ? false : null,
// 					west: 0 < x ? false : null,
// 					east: x < (width - 1) ? false : null
// 				};
// 			}
// 		}

// 		start = randomElement(edges);
// 		path.push(start);
// 		do {
// 			end = randomElement(edges);
// 		} while (start.x === end.x || start.y === end.y);

// 		openEdge(start);
// 		search(start);

// 		return {
// 			mesh,
// 			start,
// 			end
// 		};
// 	}

// 	function bridgeEdge(square, color) {
// 		if (square.x === 0) { // West
// 			grid.bridge(square.x - 1, square.y, square.x, square.y, color);
// 		} else if (square.y === 0) { // North
// 			grid.bridge(square.x, square.y - 1, square.x, square.y, color);
// 		} else if (square.x === (width - 1)) { // East
// 			grid.bridge(square.x, square.y, square.x + 1, square.y, color);
// 		} else if (square.y === (height - 1)) { // South
// 			grid.bridge(square.x, square.y, square.x, square.y + 1, color);
// 		} else {
// 			throw new Error('Square is not on edge.');
// 		}
// 	}

// 	function render($el) {
// 		var x, y;

// 		grid = new Grid($el);
// 		grid.clear();
// 		grid.gridWidth = width;
// 		grid.gridHeight = height;

// 		for (x = 0; x < width; x++) {
// 			for (y = 0; y < height; y++) {
// 				if (!maze.mesh[x][y].west) {
// 					grid.line(x, y, x, y + 1);
// 				}
// 				if (!maze.mesh[x][y].north) {
// 					grid.line(x, y, x + 1, y);
// 				}

// 				// Only need to draw south and east on edges
// 				if (x === width - 1 && !maze.mesh[x][y].east) {
// 					grid.line(x + 1, y, x + 1, y + 1);
// 				}
// 				if (y === height - 1 && !maze.mesh[x][y].south) {
// 					grid.line(x, y + 1, x + 1, y + 1);
// 				}
// 			}
// 		}

// 		grid.fill(maze.start.x, maze.start.y, GREEN);
// 		grid.fill(maze.end.x, maze.end.y, RED);
// 		bridgeEdge(maze.start, GREEN);
// 		bridgeEdge(maze.end, RED);
// 	}

// 	function move(dir) {
// 		var pos = lastElement(path);
// 		var previous = path[path.length - 2];
// 		var next;

// 		// Don't break down walls
// 		if (!maze.mesh[pos.x][pos.y][dir]) return false;

// 		next = adjacentSquare(pos, dir);
// 		if (!next) return false;

// 		if (previous && next.x === previous.x && next.y === previous.y) {
// 			grid.bridge(pos.x, pos.y, next.x, next.y, RED);
// 			grid.fill(pos.x, pos.y, RED);
// 			path.pop();
// 		} else {
// 			grid.bridge(pos.x, pos.y, next.x, next.y, GREEN);
// 			grid.fill(next.x, next.y, GREEN);
// 			path.push(next);
// 		}

// 		if (next.x === maze.end.x && next.y === maze.end.y) {
// 			bridgeEdge(next, GREEN);
// 			return true;
// 		}
// 		return false;
// 	}

// 	function enterSquare(square) {
// 		var pos = lastElement(path);
// 		var dir = relativeDirection(pos, square);
// 		if (dir) move(dir);
// 	}

// 	var hover = (function () {
// 		var _x, _y;

// 		return function (x, y) {
// 			x = Grid.toSquares(x);
// 			y = Grid.toSquares(y);
// 			if (x >= 0 && y >= 0 && (x !== _x || y !== _y)) {
// 				_x = x;
// 				_y = y;
// 				enterSquare({x, y});
// 			}
// 		};

// 	})();

// 	maze = generate();

// 	return {
// 		render,
// 		move,
// 		hover
// 	};

// }

// module.exports = Maze;

},{"./colors":2,"./grid":3,"./util":5}],5:[function(require,module,exports){
"use strict";

exports.mod = mod;
exports.random = random;
exports.randomInt = randomInt;
exports.randomElement = randomElement;
exports.lastElement = lastElement;
function mod(a, b) {
	return (a % b + b) % b;
}

function random() {
	var x = Math.sin(random.seed++) * 10000;
	return x - Math.floor(x);
}

random.seed = Math.random();

function randomInt(max) {
	return Math.floor(random() * max);
}

function randomElement(arr) {
	return arr[randomInt(arr.length)];
}

function lastElement(arr) {
	return arr[arr.length - 1];
}
Object.defineProperty(exports, "__esModule", {
	value: true
});

},{}]},{},[1])


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2NvbG9ycy5qcyIsInNyYy9ncmlkLmpzIiwic3JjL21hemUuanMiLCJzcmMvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7SUNBTyxJQUFJLDJCQUFNLFFBQVE7O0lBQ2hCLE1BQU0sV0FBUSxRQUFRLEVBQXRCLE1BQU07SUFFVCxHQUFHO0FBT0csVUFQTixHQUFHOzt3QkFBSCxHQUFHOztBQVFQLE1BQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQyxNQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakQsTUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3ZELE1BQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFakQsVUFBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDeEUsUUFBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3ZCLFNBQUssUUFBUSxFQUFFLENBQUM7R0FDaEIsQ0FBQyxDQUFDOztBQUVILFVBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ2xELE9BQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDO0FBQ3ZELE9BQUksU0FBUyxHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUMs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QU0sQ0FBQyxDQUFDLENBQUM7Q0FDbEM7O0FBRU0sU0FBUyxXQUFXLENBQUMsR0FBRyxFQUFFO0FBQ2hDLFFBQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7Q0FDM0IiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii9qc3giLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBNYXplIGZyb20gJy4vbWF6ZSc7XG5pbXBvcnQgeyByYW5kb20gfSBmcm9tICcuL3V0aWwnO1xuXG5jbGFzcyBBcHAge1xuXHRnZXQgd2lkdGgoKSB7IHJldHVybiArdGhpcy4kd2lkdGgudmFsdWU7IH1cblx0c2V0IHdpZHRoKHZhbHVlKSB7IHRoaXMuJHdpZHRoLnZhbHVlID0gdmFsdWU7IH1cblxuXHRnZXQgaGVpZ2h0KCkgeyByZXR1cm4gK3RoaXMuJGhlaWdodC52YWx1ZTsgfVxuXHRzZXQgaGVpZ2h0KHZhbHVlKSB7IHRoaXMuJGhlaWdodC52YWx1ZSA9IHZhbHVlOyB9XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy4kd2lkdGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd2lkdGgnKTtcblx0XHR0aGlzLiRoZWlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaGVpZ2h0Jyk7XG5cdFx0dGhpcy4kcGVybWFsaW5rID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Blcm1hbGluaycpO1xuXHRcdHRoaXMuJGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjYW52YXMnKTtcblxuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNnZW5lcmF0ZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dGhpcy5nZW5lcmF0ZSgpO1xuXHRcdH0pO1xuXG5cdFx0ZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldmVudCkgPT4ge1xuXHRcdFx0bGV0IGtleSA9IGV2ZW50LmtleSB8fCBldmVudC5jaGFyQ29kZSB8fCBldmVudC5rZXlDb2RlO1xuXHRcdFx0bGV0IGRpcmVjdGlvbiA9IFsnd2VzdCcsICdub3J0aCcsICdlYXN0JywgJ3NvdXRoJ11ba2V5IC0gMzddO1xuXHRcdFx0aWYgKCFkaXJlY3Rpb24pIHJldHVybjtcblxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHRoaXMubWF6ZS5tb3ZlKGRpcmVjdGlvbik7XG5cdFx0fSk7XG5cblx0XHR0aGlzLiRjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGV2ZW50KSA9PiB7XG5cdFx0XHR0aGlzLm1hemUuaG92ZXIoZXZlbnQubGF5ZXJYLCBldmVudC5sYXllclkpO1xuXHRcdH0pO1xuXG5cdFx0Ly8gQXR0ZW1wdCB0byByZWFkIG1hemUgcGFyYW1ldGVycyBmcm9tIFVSTCBoYXNoXG5cdFx0bGV0IFssIHdpZHRoLCBoZWlnaHQsIHNlZWRdID0gLyMoXFxkKyl4KFxcZCspKD86cyhcXGQrLlxcZCspKT98LiovLmV4ZWMod2luZG93LmxvY2F0aW9uLmhhc2gpO1xuXG5cdFx0aWYgKHdpZHRoICYmIGhlaWdodCkge1xuXHRcdFx0dGhpcy53aWR0aCA9IHdpZHRoO1xuXHRcdFx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cdFx0fVxuXG5cdFx0aWYgKHNlZWQpIHtcblx0XHRcdHJhbmRvbS5zZWVkID0gcGFyc2VGbG9hdChzZWVkKTtcblx0XHR9XG5cblx0XHR0aGlzLmdlbmVyYXRlKCk7XG5cdH1cblxuXHRnZW5lcmF0ZSgpIHtcblx0XHR0aGlzLnNldFBlcm1hbGluaygpO1xuXG5cdFx0dGhpcy5tYXplID0gbmV3IE1hemUodGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXHRcdHRoaXMubWF6ZS5yZW5kZXIodGhpcy4kY2FudmFzKTtcblx0fVxuXG5cdHNldFBlcm1hbGluaygpIHtcblx0XHRsZXQgaGFzaCA9IGAjJHt0aGlzLndpZHRofXgke3RoaXMuaGVpZ2h0fXMke3JhbmRvbS5zZWVkfWA7XG5cdFx0bGV0IGhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdCgnIycpWzBdICsgaGFzaDtcblx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IGhhc2g7XG5cdFx0dGhpcy4kcGVybWFsaW5rLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuXHR9XG59XG5cbm5ldyBBcHAoKTtcbiIsImV4cG9ydCBjb25zdCBEQVJLX0dSQVkgPSAnIzE2MTkxZCc7XHJcbmV4cG9ydCBjb25zdCBHUkVFTiA9ICcjNGVjZGM0JztcclxuZXhwb3J0IGNvbnN0IFJFRCA9ICcjZmY3YjdiJztcclxuIiwiaW1wb3J0IHsgbW9kIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IERBUktfR1JBWSB9IGZyb20gJy4vY29sb3JzJztcblxuY29uc3QgU0laRSA9IDIwOyAvLyBXaWR0aCBvZiBhIHNxdWFyZSBpbiBwaXhlbHNcbmNvbnN0IFdFSUdIVCA9IDI7IC8vIFdpZHRoIG9mIHRoZSBsaW5lIGJldHdlZW4gc3F1YXJlcyBpbiBwaXhlbHNcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZCB7XG5cblx0Z2V0IHBpeGVsSGVpZ2h0KCkge1xuXHRcdHJldHVybiB0aGlzLmN0eC5jYW52YXMuaGVpZ2h0O1xuXHR9XG5cblx0c2V0IHBpeGVsSGVpZ2h0KHBpeGVscykge1xuXHRcdHRoaXMuY3R4LmNhbnZhcy5oZWlnaHQgPSBwaXhlbHM7XG5cdH1cblxuXHRnZXQgcGl4ZWxXaWR0aCgpIHtcblx0XHRyZXR1cm4gdGhpcy5jdHguY2FudmFzLndpZHRoO1xuXHR9XG5cblx0c2V0IHBpeGVsV2lkdGgocGl4ZWxzKSB7XG5cdFx0dGhpcy5jdHguY2FudmFzLndpZHRoID0gcGl4ZWxzO1xuXHR9XG5cblx0Z2V0IGdyaWRIZWlnaHQoKSB7XG5cdFx0cmV0dXJuICh0aGlzLnBpeGVsSGVpZ2h0IC0gV0VJR0hUKSAvIChTSVpFICsgV0VJR0hUKTtcblx0fVxuXG5cdHNldCBncmlkSGVpZ2h0KHNxdWFyZXMpIHtcblx0XHR0aGlzLnBpeGVsSGVpZ2h0ID0gc3F1YXJlcyAqIFNJWkUgKyAoc3F1YXJlcyArIDEpICogV0VJR0hUO1xuXHR9XG5cblx0Z2V0IGdyaWRXaWR0aCgpIHtcblx0XHRyZXR1cm4gKHRoaXMucGl4ZWxXaWR0aCAtIFdFSUdIVCkgLyAoU0laRSArIFdFSUdIVCk7XG5cdH1cblxuXHRzZXQgZ3JpZFdpZHRoKHNxdWFyZXMpIHtcblx0XHR0aGlzLnBpeGVsV2lkdGggPSBzcXVhcmVzICogU0laRSArIChzcXVhcmVzICsgMSkgKiBXRUlHSFQ7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgZnJvbSBzcXVhcmUgdW5pdHMgdG8gcGl4ZWwgdW5pdHMuXG5cdCAqIEBwYXJhbSB7aW50fSBzcXVhcmVzIFplcm8tYmFzZWQgc3F1YXJlIGNvb3JkaW5hdGUuXG5cdCAqIEByZXR1cm5zIHtpbnR9IFRoZSBjb29yZGluYXRlIG9mIHRoZSBwaXhlbCBjbG9zZXN0IHRvIHRoZSBvcmlnaW4gaW4gdGhlIHNxdWFyZS5cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0c3RhdGljIHRvUGl4ZWxzKHNxdWFyZXMpIHtcblx0XHRyZXR1cm4gKFdFSUdIVCAvIDIpICsgc3F1YXJlcyAqIChXRUlHSFQgKyBTSVpFKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBmcm9tIHBpeGVsIHVuaXRzIHRvIHNxdWFyZSB1bml0cy5cblx0ICogQHBhcmFtIHtpbnR9IHBpeGVscyBaZXJvLWJhc2VkIGNvb3JkaW5hdGUgb2YgYSBwaXhlbC5cblx0ICogQHJldHVybnMge2ludH0gVGhlIHplcm8tYmFzZWQgY29vcmRpbmF0ZSBvZiB0aGUgc3F1YXJlIGNvbnRhaW5pbmcgdGhlIHBpeGVsLCBvciAtMSBpZiB0aGVcblx0ICogICAgICAgICAgICAgICAgcGl4ZWwgaXMgb24gYSBib3VuZGFyeSBiZXR3ZWVuIHNxdWFyZXMuXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdHN0YXRpYyB0b1NxdWFyZXMocGl4ZWxzKSB7XG5cdFx0aWYgKG1vZChwaXhlbHMgLSBXRUlHSFQsIFNJWkUgKyBXRUlHSFQpID49IChTSVpFIC0gV0VJR0hUKSkge1xuXHRcdFx0Ly8gT24gYSBsaW5lXG5cdFx0XHRyZXR1cm4gLTE7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIE1hdGguZmxvb3IoKHBpeGVscyAtIFdFSUdIVCkgLyAoU0laRSArIFdFSUdIVCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgR3JpZCBpbnN0YW5jZSBnaXZlbiBhIGRyYXdpbmcgY2FudmFzLlxuXHQgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSAkY2FudmFzIFRoZSA8Y2FudmFzPiBlbGVtZW50IG9uIHdoaWNoIHRvIGRyYXcuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigkY2FudmFzKSB7XG5cdFx0dGhpcy5jdHggPSAkY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdH1cblxuXHQvKipcblx0ICogQ2xlYXJzIHRoZSBlbnRpcmUgZHJhd2luZyBzdXJmYWNlLlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0Y2xlYXIoKSB7XG5cdFx0dGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucGl4ZWxXaWR0aCwgdGhpcy5waXhlbEhlaWdodCk7XG5cdH1cblxuXHQvKipcblx0ICogRmlsbHMgdGhlIGludGVyaW9yIG9mIGEgZ3JpZCBzcXVhcmUgd2l0aCBhIGNvbG9yLlxuXHQgKiBAcGFyYW0ge2ludH0geCBaZXJvLWJhc2VkIHgtY29vcmRpbmF0ZSBvZiB0aGUgc3F1YXJlIGluIHVuaXRzIG9mIHNxdWFyZXMuXG5cdCAqIEBwYXJhbSB7aW50fSB5IFplcm8tYmFzZWQgeS1jb29yZGluYXRlIG9mIHRoZSBzcXVhcmUgaW4gdW5pdHMgb2Ygc3F1YXJlcy5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGNvbG9yIEEgQ1NTIGNvbG9yIHZhbHVlLlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0ZmlsbCh4LCB5LCBjb2xvcikge1xuXHRcdGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuXHRcdGNvbnN0IF9maWxsU3R5bGUgPSBjdHguZmlsbFN0eWxlO1xuXHRcdGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcblxuXHRcdGN0eC5maWxsUmVjdChcblx0XHRcdEdyaWQudG9QaXhlbHMoeCkgKyAoV0VJR0hUIC8gMiksXG5cdFx0XHRHcmlkLnRvUGl4ZWxzKHkpICsgKFdFSUdIVCAvIDIpLFxuXHRcdFx0U0laRSxcblx0XHRcdFNJWkVcblx0XHQpO1xuXG5cdFx0Y3R4LmZpbGxTdHlsZSA9IF9maWxsU3R5bGU7XG5cdH1cblxuXHQvKipcblx0ICogRHJhd3MgdGhlIGJvcmRlciBzaGFyZWQgYnkgdHdvIHNxdWFyZXMuXG5cdCAqIEBwYXJhbSB7aW50fSB4MSBaZXJvLWJhc2VkIHgtY29vcmRpbmF0ZSBvZiB0aGUgZmlyc3Qgc3F1YXJlIGluIHVuaXRzIG9mIHNxdWFyZXMuXG5cdCAqIEBwYXJhbSB7aW50fSB5MSBaZXJvLWJhc2VkIHktY29vcmRpbmF0ZSBvZiB0aGUgZmlyc3Qgc3F1YXJlIGluIHVuaXRzIG9mIHNxdWFyZXMuXG5cdCAqIEBwYXJhbSB7aW50fSB4MiBaZXJvLWJhc2VkIHgtY29vcmRpbmF0ZSBvZiB0aGUgc2Vjb25kIHNxdWFyZSBpbiB1bml0cyBvZiBzcXVhcmVzLlxuXHQgKiBAcGFyYW0ge2ludH0geTIgWmVyby1iYXNlZCB5LWNvb3JkaW5hdGUgb2YgdGhlIHNlY29uZCBzcXVhcmUgaW4gdW5pdHMgb2Ygc3F1YXJlcy5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGNvbG9yIEEgQ1NTIGNvbG9yIHZhbHVlLlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0YnJpZGdlKHgxLCB5MSwgeDIsIHkyLCBjb2xvcikge1xuXHRcdGlmIChNYXRoLmFicyh4MiAtIHgxKSArIE1hdGguYWJzKHkyIC0geTEpICE9PSAxKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1NxdWFyZXMgYXJlIG5vdCBhZGphY2VudC4nKTtcblx0XHR9XG5cblx0XHRjb25zdCB4ID0gTWF0aC5tYXgoeDEsIHgyKTtcblx0XHRjb25zdCB5ID0gTWF0aC5tYXgoeTEsIHkyKTtcblxuXHRcdGNvbnN0IGN0eCAgICAgICAgICA9IHRoaXMuY3R4O1xuXHRcdGNvbnN0IF9saW5lQ2FwICAgICA9IGN0eC5saW5lQ2FwO1xuXHRcdGNvbnN0IF9saW5lV2lkdGggICA9IGN0eC5saW5lV2lkdGg7XG5cdFx0Y29uc3QgX3N0cm9rZVN0eWxlID0gY3R4LnN0cm9rZVN0eWxlO1xuXHRcdGN0eC5saW5lQ2FwICAgICAgICA9ICdzcXVhcmUnO1xuXHRcdGN0eC5saW5lV2lkdGggICAgICA9IFdFSUdIVDtcblx0XHRjdHguc3Ryb2tlU3R5bGUgICAgPSBjb2xvcjtcblxuXHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRpZiAoeDEgPT09IHgyKSB7XG5cdFx0XHQvLyBCcmlkZ2Ugbm9ydGgvc291dGggc3F1YXJlc1xuXHRcdFx0Ly8gTmFycm93ZXIgeCBkaW1lbnNpb25zXG5cdFx0XHRjdHgubW92ZVRvKEdyaWQudG9QaXhlbHMoeDEpICsgV0VJR0hULCBHcmlkLnRvUGl4ZWxzKHkpKTtcblx0XHRcdGN0eC5saW5lVG8oR3JpZC50b1BpeGVscyh4MSArIDEpIC0gV0VJR0hULCBHcmlkLnRvUGl4ZWxzKHkpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gQnJpZGdlIGVhc3Qvd2VzdCBzcXVhcmVzXG5cdFx0XHQvLyBOYXJyb3dlciB5IGRpbWVuc2lvbnNcblx0XHRcdGN0eC5tb3ZlVG8oR3JpZC50b1BpeGVscyh4KSwgR3JpZC50b1BpeGVscyh5MSkgKyBXRUlHSFQpO1xuXHRcdFx0Y3R4LmxpbmVUbyhHcmlkLnRvUGl4ZWxzKHgpLCBHcmlkLnRvUGl4ZWxzKHkxICsgMSkgLSBXRUlHSFQpO1xuXHRcdH1cblx0XHRjdHguc3Ryb2tlKCk7XG5cblx0XHRjdHgubGluZUNhcCAgICAgPSBfbGluZUNhcDtcblx0XHRjdHgubGluZVdpZHRoICAgPSBfbGluZVdpZHRoO1xuXHRcdGN0eC5zdHJva2VTdHlsZSA9IF9zdHJva2VTdHlsZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEcmF3cyBhIGxpbmUgYmV0d2VlbiB0aGUgdXBwZXIgbGVmdCBjb3JuZXJzIG9mIHR3byBncmlkIHNxdWFyZXMuXG5cdCAqIEBwYXJhbSB7aW50fSB4MSBaZXJvLWJhc2VkIHgtY29vcmRpbmF0ZSBvZiB0aGUgZmlyc3Qgc3F1YXJlIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW4uXG5cdCAqIEBwYXJhbSB7aW50fSB5MSBaZXJvLWJhc2VkIHktY29vcmRpbmF0ZSBvZiB0aGUgZmlyc3Qgc3F1YXJlIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW4uXG5cdCAqIEBwYXJhbSB7aW50fSB4MiBaZXJvLWJhc2VkIHgtY29vcmRpbmF0ZSBvZiB0aGUgc2Vjb25kIHNxdWFyZSByZWxhdGl2ZSB0byB0aGUgb3JpZ2luLlxuXHQgKiBAcGFyYW0ge2ludH0geTIgWmVyby1iYXNlZCB5LWNvb3JkaW5hdGUgb2YgdGhlIHNlY29uZCBzcXVhcmUgcmVsYXRpdmUgdG8gdGhlIG9yaWdpbi5cblx0ICogQHBhcmFtIHtzdHJpbmd9IFtjb2xvcl0gQSBDU1MgY29sb3IgdmFsdWUuIERlZmF1bHRzIHRvIGRhcmsgZ3JheS5cblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdGxpbmUoeDEsIHkxLCB4MiwgeTIsIGNvbG9yID0gREFSS19HUkFZKSB7XG5cdFx0Y29uc3QgY3R4ICAgICAgICAgID0gdGhpcy5jdHg7XG5cdFx0Y29uc3QgX2xpbmVDYXAgICAgID0gY3R4LmxpbmVDYXA7XG5cdFx0Y29uc3QgX2xpbmVXaWR0aCAgID0gY3R4LmxpbmVXaWR0aDtcblx0XHRjb25zdCBfc3Ryb2tlU3R5bGUgPSBjdHguc3Ryb2tlU3R5bGU7XG5cdFx0Y3R4LmxpbmVDYXAgICAgICAgID0gJ3NxdWFyZSc7XG5cdFx0Y3R4LmxpbmVXaWR0aCAgICAgID0gV0VJR0hUO1xuXHRcdGN0eC5zdHJva2VTdHlsZSAgICA9IGNvbG9yO1xuXG5cdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdGN0eC5tb3ZlVG8oR3JpZC50b1BpeGVscyh4MSksIEdyaWQudG9QaXhlbHMoeTEpKTtcblx0XHRjdHgubGluZVRvKEdyaWQudG9QaXhlbHMoeDIpLCBHcmlkLnRvUGl4ZWxzKHkyKSk7XG5cdFx0Y3R4LnN0cm9rZSgpO1xuXG5cdFx0Y3R4LmxpbmVDYXAgICAgID0gX2xpbmVDYXA7XG5cdFx0Y3R4LmxpbmVXaWR0aCAgID0gX2xpbmVXaWR0aDtcblx0XHRjdHguc3Ryb2tlU3R5bGUgPSBfc3Ryb2tlU3R5bGU7XG5cdH1cblxufVxuIiwiaW1wb3J0IEdyaWQgZnJvbSAnLi9ncmlkJztcbmltcG9ydCB7IGxhc3RFbGVtZW50LCByYW5kb20sIHJhbmRvbUVsZW1lbnQgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgR1JFRU4sIFJFRCB9IGZyb20gJy4vY29sb3JzJztcblxuY29uc3QgRElSRUNUSU9OUyA9IFsnbm9ydGgnLCAnc291dGgnLCAnZWFzdCcsICd3ZXN0J107XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hemUge1xuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSByZWxhdGl2ZSBkaXJlY3Rpb24gYmV0d2VlbiB0d28gYWRqYWNlbnQgc3F1YXJlcy5cblx0ICogQHBhcmFtIHtvYmplY3R9IHN0YXJ0IFRoZSBzdGFydGluZyBzcXVhcmUuXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBlbmQgVGhlIGVuZGluZyBzcXVhcmUuXG5cdCAqIEByZXR1cm5zIHtzdHJpZ259IENhcmRpbmFsIGRpcmVjdGlvbiBmcm9tIHN0YXJ0IHRvIGVuZC5cblx0ICovXG5cdHN0YXRpYyByZWxhdGl2ZURpcmVjdGlvbihzdGFydCwgZW5kKSB7XG5cdFx0aWYgKE1hdGguYWJzKGVuZC54IC0gc3RhcnQueCkgKyBNYXRoLmFicyhlbmQueSAtIHN0YXJ0LnkpID4gMSkge1xuXHRcdFx0Ly8gU3F1YXJlcyBhcmUgbm90IGFkamFjZW50XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRpZiAoc3RhcnQueCA8IGVuZC54KSB7XG5cdFx0XHRyZXR1cm4gJ2Vhc3QnO1xuXHRcdH0gZWxzZSBpZiAoZW5kLnggPCBzdGFydC54KSB7XG5cdFx0XHRyZXR1cm4gJ3dlc3QnO1xuXHRcdH0gZWxzZSBpZiAoc3RhcnQueSA8IGVuZC55KSB7XG5cdFx0XHRyZXR1cm4gJ3NvdXRoJztcblx0XHR9IGVsc2UgaWYgKGVuZC55IDwgc3RhcnQueSkge1xuXHRcdFx0cmV0dXJuICdub3J0aCc7XG5cdFx0fVxuXHR9XG5cblx0Y29uc3RydWN0b3Iod2lkdGgsIGhlaWdodCkge1xuXHRcdHRoaXMud2lkdGggPSB3aWR0aDtcblx0XHR0aGlzLmhlaWdodCA9IGhlaWdodDtcblx0XHR0aGlzLm1hemUgPSB0aGlzLmdlbmVyYXRlKCk7XG5cdFx0dGhpcy5wYXRoID0gW3RoaXMubWF6ZS5zdGFydF07XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgY29vcmRpbmF0ZXMgb2YgYW4gYWRqYWNlbnQgc3F1YXJlLlxuXHQgKiBAcGFyYW0ge29iamVjdH0gc3RhcnQgU3RhcnRpbmcgc3F1YXJlJ3MgY29vcmRpbmF0ZXMuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBkaXJlY3Rpb24gQ2FyZGluYWwgZGlyZWN0aW9uIG9mIGFkamFjZW50IHNxdWFyZS5cblx0ICogQHJldHVybnMge29iamVjdH0gQWRqYWNlbnQgc3F1YXJlJ3MgY29vcmRpbmF0ZXMuXG5cdCAqL1xuXHRnZXRBZGphY2VudFNxdWFyZShzdGFydCwgZGlyZWN0aW9uKSB7XG5cdFx0c3dpdGNoIChkaXJlY3Rpb24pIHtcblx0XHRcdGNhc2UgJ25vcnRoJzpcblx0XHRcdFx0cmV0dXJuIHN0YXJ0LnkgPiAwXG5cdFx0XHRcdFx0PyB7IHg6IHN0YXJ0LngsIHk6IHN0YXJ0LnkgLSAxIH1cblx0XHRcdFx0XHQ6IG51bGw7XG5cdFx0XHRjYXNlICdzb3V0aCc6XG5cdFx0XHRcdHJldHVybiBzdGFydC55IDwgdGhpcy5oZWlnaHQgLSAxXG5cdFx0XHRcdFx0PyB7IHg6IHN0YXJ0LngsIHk6IHN0YXJ0LnkgKyAxIH1cblx0XHRcdFx0XHQ6IG51bGw7XG5cdFx0XHRjYXNlICdlYXN0Jzpcblx0XHRcdFx0cmV0dXJuIHN0YXJ0LnggPCB0aGlzLndpZHRoIC0gMVxuXHRcdFx0XHRcdD8geyB4OiBzdGFydC54ICsgMSwgeTogc3RhcnQueSB9XG5cdFx0XHRcdFx0OiBudWxsO1xuXHRcdFx0Y2FzZSAnd2VzdCc6XG5cdFx0XHRcdHJldHVybiBzdGFydC54ID4gMFxuXHRcdFx0XHRcdD8geyB4OiBzdGFydC54IC0gMSwgeTogc3RhcnQueSB9XG5cdFx0XHRcdFx0OiBudWxsO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGRpcmVjdGlvbiAnICsgZGlyKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgY29vcmRpbmF0ZXMgb2YgYWxsIHNxdWFyZXMgYWRqYWNlbnQgdG8gYSBnaXZlbiBzcXVhcmUuXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBzdGFydCBDb29yZGluYXRlcyBvZiB0aGUgc3RhcnRpbmcgc3F1YXJlLlxuXHQgKiBAcmV0dXJucyB7b2JqZWN0fSBDb29yZGluYXRlcyBvZiBhZGphY2VudCBzcXVhcmVzIGluIGVhY2ggZGlyZWN0aW9uLlxuXHQgKi9cblx0Z2V0QWRqYWNlbnRTcXVhcmVzKHN0YXJ0KSB7XG5cdFx0cmV0dXJuIERJUkVDVElPTlMucmVkdWNlKChvYmosIGRpcikgPT4ge1xuXHRcdFx0b2JqW2Rpcl0gPSB0aGlzLmdldEFkamFjZW50U3F1YXJlKHN0YXJ0LCBkaXIpO1xuXHRcdFx0cmV0dXJuIG9iajtcblx0XHR9LCB7fSk7XG5cdH1cblxuXHRnZW5lcmF0ZSgpIHtcblx0XHRjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHRoaXM7XG5cdFx0Y29uc3QgbWVzaCA9IFtdO1xuXHRcdGNvbnN0IGVkZ2VzID0gW107XG5cdFx0bGV0IGxlbmd0aCA9IDA7XG5cdFx0bGV0IHN0YXJ0LCBlbmQ7XG5cblx0XHRmdW5jdGlvbiBnZXRTcXVhcmUoeyB4LCB5IH0pIHtcblx0XHRcdHJldHVybiBtZXNoW3hdW3ldO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGlzSXNvbGF0ZWQoc3F1YXJlKSB7XG5cdFx0XHRzcXVhcmUgPSBnZXRTcXVhcmUoc3F1YXJlKTtcblx0XHRcdHJldHVybiBESVJFQ1RJT05TLmV2ZXJ5KGRpciA9PiBzcXVhcmVbZGlyXSAhPT0gdHJ1ZSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY29ubmVjdChhLCBiKSB7XG5cdFx0XHRnZXRTcXVhcmUoYSlbTWF6ZS5yZWxhdGl2ZURpcmVjdGlvbihhLCBiKV0gPSB0cnVlO1xuXHRcdFx0Z2V0U3F1YXJlKGIpW01hemUucmVsYXRpdmVEaXJlY3Rpb24oYiwgYSldID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBvcGVuRWRnZShzcXVhcmUpIHtcblx0XHRcdGNvbnN0IHsgeCwgeSB9ID0gc3F1YXJlO1xuXHRcdFx0bGV0IGRpcmVjdGlvbjtcblxuXHRcdFx0aWYgKHggPT09IDApIHtcblx0XHRcdFx0ZGlyZWN0aW9uID0gJ3dlc3QnO1xuXHRcdFx0fSBlbHNlIGlmICh5ID09PSAwKSB7XG5cdFx0XHRcdGRpcmVjdGlvbiA9ICdub3J0aCc7XG5cdFx0XHR9IGVsc2UgaWYgKHggPT09ICh3aWR0aCAtIDEpKSB7XG5cdFx0XHRcdGRpcmVjdGlvbiA9ICdlYXN0Jztcblx0XHRcdH0gZWxzZSBpZiAoeSA9PT0gKGhlaWdodCAtIDEpKSB7XG5cdFx0XHRcdGRpcmVjdGlvbiA9ICdzb3V0aCc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0Rlc3RpbmF0aW9uIG5vdCBhbiBlZGdlLicpO1xuXHRcdFx0fVxuXG5cdFx0XHRnZXRTcXVhcmUoeyB4LCB5IH0pW2RpcmVjdGlvbl0gPSB0cnVlO1xuXHRcdH1cblxuXHRcdGNvbnN0IHNlYXJjaCA9IChwb3MpID0+IHtcblx0XHRcdGxldCBhZGphY2VuY2llcywgb3B0aW9ucywgaGVhZGluZywgbmV4dDtcblxuXHRcdFx0aWYgKHBvcy54ID09PSBlbmQueCAmJiBwb3MueSA9PSBlbmQueSkge1xuXHRcdFx0XHRvcGVuRWRnZShlbmQpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGFkamFjZW5jaWVzID0gdGhpcy5nZXRBZGphY2VudFNxdWFyZXMocG9zKTtcblxuXHRcdFx0d2hpbGUgKDEpIHtcblx0XHRcdFx0b3B0aW9ucyA9IE9iamVjdC5rZXlzKGFkamFjZW5jaWVzKVxuXHRcdFx0XHRcdC5maWx0ZXIoZGlyID0+IGFkamFjZW5jaWVzW2Rpcl0pXG5cdFx0XHRcdFx0LmZpbHRlcihkaXIgPT4gaXNJc29sYXRlZCh0aGlzLmdldEFkamFjZW50U3F1YXJlKHBvcywgZGlyKSkpO1xuXHRcdFx0XHRpZiAoIW9wdGlvbnMubGVuZ3RoKSBicmVhaztcblxuXHRcdFx0XHRoZWFkaW5nID0gcmFuZG9tRWxlbWVudChvcHRpb25zKTtcblx0XHRcdFx0bmV4dCA9IGFkamFjZW5jaWVzW2hlYWRpbmddO1xuXHRcdFx0XHRjb25uZWN0KHBvcywgbmV4dCk7XG5cdFx0XHRcdGxlbmd0aCsrO1xuXHRcdFx0XHRzZWFyY2gobmV4dCk7XG5cdFx0XHRcdGxlbmd0aC0tO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZvciAobGV0IHggPSAwOyB4IDwgd2lkdGg7IHgrKykge1xuXHRcdFx0bWVzaFt4XSA9IFtdO1xuXHRcdFx0Zm9yIChsZXQgeSA9IDA7IHkgPCBoZWlnaHQ7IHkrKykge1xuXHRcdFx0XHRpZiAoeCA9PT0gMCB8fFxuXHRcdFx0XHQgICAgeSA9PT0gMCB8fFxuXHRcdFx0XHQgICAgeCA9PT0gKHdpZHRoIC0gMSkgfHxcblx0XHRcdFx0ICAgIHkgPT09IChoZWlnaHQgLSAxKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRlZGdlcy5wdXNoKHsgeCwgeSB9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdG1lc2hbeF1beV0gPSB7XG5cdFx0XHRcdFx0bm9ydGg6IDAgPCB5ID8gZmFsc2UgOiBudWxsLFxuXHRcdFx0XHRcdHNvdXRoOiB5IDwgKGhlaWdodCAtIDEpID8gZmFsc2UgOiBudWxsLFxuXHRcdFx0XHRcdHdlc3Q6IDAgPCB4ID8gZmFsc2UgOiBudWxsLFxuXHRcdFx0XHRcdGVhc3Q6IHggPCAod2lkdGggLSAxKSA/IGZhbHNlIDogbnVsbFxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHN0YXJ0ID0gcmFuZG9tRWxlbWVudChlZGdlcyk7XG5cdFx0ZG8ge1xuXHRcdFx0ZW5kID0gcmFuZG9tRWxlbWVudChlZGdlcyk7XG5cdFx0fSB3aGlsZSAoc3RhcnQueCA9PT0gZW5kLnggfHwgc3RhcnQueSA9PT0gZW5kLnkpO1xuXG5cdFx0b3BlbkVkZ2Uoc3RhcnQpO1xuXHRcdHNlYXJjaChzdGFydCk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0bWVzaCxcblx0XHRcdHN0YXJ0LFxuXHRcdFx0ZW5kXG5cdFx0fTtcblx0fVxuXG5cdGJyaWRnZUVkZ2Uoc3F1YXJlLCBjb2xvcikge1xuXHRcdGlmIChzcXVhcmUueCA9PT0gMCkgeyAvLyBXZXN0XG5cdFx0XHR0aGlzLmdyaWQuYnJpZGdlKHNxdWFyZS54IC0gMSwgc3F1YXJlLnksIHNxdWFyZS54LCBzcXVhcmUueSwgY29sb3IpO1xuXHRcdH0gZWxzZSBpZiAoc3F1YXJlLnkgPT09IDApIHsgLy8gTm9ydGhcblx0XHRcdHRoaXMuZ3JpZC5icmlkZ2Uoc3F1YXJlLngsIHNxdWFyZS55IC0gMSwgc3F1YXJlLngsIHNxdWFyZS55LCBjb2xvcik7XG5cdFx0fSBlbHNlIGlmIChzcXVhcmUueCA9PT0gKHRoaXMud2lkdGggLSAxKSkgeyAvLyBFYXN0XG5cdFx0XHR0aGlzLmdyaWQuYnJpZGdlKHNxdWFyZS54LCBzcXVhcmUueSwgc3F1YXJlLnggKyAxLCBzcXVhcmUueSwgY29sb3IpO1xuXHRcdH0gZWxzZSBpZiAoc3F1YXJlLnkgPT09ICh0aGlzLmhlaWdodCAtIDEpKSB7IC8vIFNvdXRoXG5cdFx0XHR0aGlzLmdyaWQuYnJpZGdlKHNxdWFyZS54LCBzcXVhcmUueSwgc3F1YXJlLngsIHNxdWFyZS55ICsgMSwgY29sb3IpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1NxdWFyZSBpcyBub3Qgb24gZWRnZS4nKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0cmVuZGVyKCRjYW52YXMpIHtcblx0XHRjb25zdCBncmlkID0gdGhpcy5ncmlkID0gbmV3IEdyaWQoJGNhbnZhcyk7XG5cdFx0Y29uc3QgbWF6ZSA9IHRoaXMubWF6ZTtcblx0XHRjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHRoaXM7XG5cblx0XHRncmlkLmNsZWFyKCk7XG5cdFx0Z3JpZC5ncmlkV2lkdGggPSB3aWR0aDtcblx0XHRncmlkLmdyaWRIZWlnaHQgPSBoZWlnaHQ7XG5cblx0XHRmb3IgKGxldCB4ID0gMDsgeCA8IHdpZHRoOyB4KyspIHtcblx0XHRcdGZvciAobGV0IHkgPSAwOyB5IDwgaGVpZ2h0OyB5KyspIHtcblx0XHRcdFx0aWYgKCFtYXplLm1lc2hbeF1beV0ud2VzdCkge1xuXHRcdFx0XHRcdGdyaWQubGluZSh4LCB5LCB4LCB5ICsgMSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFtYXplLm1lc2hbeF1beV0ubm9ydGgpIHtcblx0XHRcdFx0XHRncmlkLmxpbmUoeCwgeSwgeCArIDEsIHkpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gT25seSBuZWVkIHRvIGRyYXcgc291dGggYW5kIGVhc3Qgb24gZWRnZXNcblx0XHRcdFx0aWYgKHggPT09IHdpZHRoIC0gMSAmJiAhbWF6ZS5tZXNoW3hdW3ldLmVhc3QpIHtcblx0XHRcdFx0XHRncmlkLmxpbmUoeCArIDEsIHksIHggKyAxLCB5ICsgMSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHkgPT09IGhlaWdodCAtIDEgJiYgIW1hemUubWVzaFt4XVt5XS5zb3V0aCkge1xuXHRcdFx0XHRcdGdyaWQubGluZSh4LCB5ICsgMSwgeCArIDEsIHkgKyAxKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGdyaWQuZmlsbChtYXplLnN0YXJ0LngsIG1hemUuc3RhcnQueSwgR1JFRU4pO1xuXHRcdGdyaWQuZmlsbChtYXplLmVuZC54LCBtYXplLmVuZC55LCBSRUQpO1xuXHRcdHRoaXMuYnJpZGdlRWRnZShtYXplLnN0YXJ0LCBHUkVFTik7XG5cdFx0dGhpcy5icmlkZ2VFZGdlKG1hemUuZW5kLCBSRUQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdG1vdmUoZGlyKSB7XG5cdFx0Y29uc3QgcGF0aCA9IHRoaXMucGF0aDtcblx0XHRjb25zdCBwb3MgPSBsYXN0RWxlbWVudChwYXRoKTtcblx0XHRjb25zdCBwcmV2aW91cyA9IHBhdGhbcGF0aC5sZW5ndGggLSAyXTtcblx0XHRsZXQgbmV4dDtcblxuXHRcdC8vIERvbid0IGJyZWFrIGRvd24gd2FsbHNcblx0XHRpZiAoIXRoaXMubWF6ZS5tZXNoW3Bvcy54XVtwb3MueV1bZGlyXSkgcmV0dXJuIGZhbHNlO1xuXG5cdFx0bmV4dCA9IHRoaXMuZ2V0QWRqYWNlbnRTcXVhcmUocG9zLCBkaXIpO1xuXHRcdGlmICghbmV4dCkgcmV0dXJuIGZhbHNlO1xuXG5cdFx0aWYgKHByZXZpb3VzICYmIG5leHQueCA9PT0gcHJldmlvdXMueCAmJiBuZXh0LnkgPT09IHByZXZpb3VzLnkpIHtcblx0XHRcdHRoaXMuZ3JpZC5icmlkZ2UocG9zLngsIHBvcy55LCBuZXh0LngsIG5leHQueSwgUkVEKTtcblx0XHRcdHRoaXMuZ3JpZC5maWxsKHBvcy54LCBwb3MueSwgUkVEKTtcblx0XHRcdHRoaXMucGF0aC5wb3AoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5ncmlkLmJyaWRnZShwb3MueCwgcG9zLnksIG5leHQueCwgbmV4dC55LCBHUkVFTik7XG5cdFx0XHR0aGlzLmdyaWQuZmlsbChuZXh0LngsIG5leHQueSwgR1JFRU4pO1xuXHRcdFx0dGhpcy5wYXRoLnB1c2gobmV4dCk7XG5cdFx0fVxuXG5cdFx0aWYgKG5leHQueCA9PT0gdGhpcy5tYXplLmVuZC54ICYmIG5leHQueSA9PT0gdGhpcy5tYXplLmVuZC55KSB7XG5cdFx0XHR0aGlzLmJyaWRnZUVkZ2UobmV4dCwgR1JFRU4pO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0ZW50ZXJTcXVhcmUoc3F1YXJlKSB7XG5cdFx0Y29uc3QgcG9zID0gbGFzdEVsZW1lbnQodGhpcy5wYXRoKTtcblx0XHRjb25zdCBkaXIgPSBNYXplLnJlbGF0aXZlRGlyZWN0aW9uKHBvcywgc3F1YXJlKTtcblx0XHRpZiAoZGlyKSB0aGlzLm1vdmUoZGlyKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRob3Zlcih4LCB5KSB7XG5cdFx0eCA9IEdyaWQudG9TcXVhcmVzKHgpO1xuXHRcdHkgPSBHcmlkLnRvU3F1YXJlcyh5KTtcblxuXHRcdGlmICh4ID49IDAgJiYgeSA+PSAwICYmICh4ICE9PSB0aGlzLl94IHx8IHkgIT09IHRoaXMuX3kpKSB7XG5cdFx0XHR0aGlzLl94ID0geDtcblx0XHRcdHRoaXMuX3kgPSB5O1xuXHRcdFx0dGhpcy5lbnRlclNxdWFyZSh7IHgsIHkgfSk7XG5cdFx0fVxuXHR9XG59XG5cblxuXG5cbi8vIHZhciBHcmlkMiA9IHJlcXVpcmUoJy4vZ3JpZCcpO1xuLy8gLy92YXIgcmFuZG9tMiA9IHJlcXVpcmUoJy4vcmFuZG9tJyk7XG5cbi8vIHZhciBNYXplMiA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0KSB7XG5cbi8vIFx0dmFyIERJUkVDVElPTlMgPSBbJ25vcnRoJywgJ3NvdXRoJywgJ2Vhc3QnLCAnd2VzdCddO1xuLy8gXHR2YXIgR1JFRU4gPSAnIzRlY2RjNCcsIFJFRCA9ICcjZmY2YjZiJztcblxuLy8gXHR2YXIgcGF0aCA9IFtdO1xuLy8gXHR2YXIgbWF6ZSwgZ3JpZDtcblxuLy8gXHQvKipcbi8vIFx0ICogR2V0cyB0aGUgY29vcmRpbmF0ZXMgb2YgYW4gYWRqYWNlbnQgc3F1YXJlLlxuLy8gXHQgKiBAcGFyYW0ge29iamVjdH0gc3RhcnQgU3RhcnRpbmcgc3F1YXJlJ3MgY29vcmRpbmF0ZXMuXG4vLyBcdCAqIEBwYXJhbSB7c3RyaW5nfSBkaXJlY3Rpb24gQ2FyZGluYWwgZGlyZWN0aW9uIG9mIGFkamFjZW50IHNxdWFyZS5cbi8vIFx0ICogQHJldHVybnMge29iamVjdH0gQWRqYWNlbnQgc3F1YXJlJ3MgY29vcmRpbmF0ZXMuXG4vLyBcdCAqL1xuLy8gXHRmdW5jdGlvbiBhZGphY2VudFNxdWFyZShzdGFydCwgZGlyZWN0aW9uKSB7XG4vLyBcdFx0c3dpdGNoIChkaXJlY3Rpb24pIHtcbi8vIFx0XHRcdGNhc2UgJ25vcnRoJzpcbi8vIFx0XHRcdFx0cmV0dXJuIHN0YXJ0LnkgPiAwXG4vLyBcdFx0XHRcdFx0PyB7IHg6IHN0YXJ0LngsIHk6IHN0YXJ0LnkgLSAxIH1cbi8vIFx0XHRcdFx0XHQ6IG51bGw7XG4vLyBcdFx0XHRjYXNlICdzb3V0aCc6XG4vLyBcdFx0XHRcdHJldHVybiBzdGFydC55IDwgaGVpZ2h0IC0gMVxuLy8gXHRcdFx0XHRcdD8geyB4OiBzdGFydC54LCB5OiBzdGFydC55ICsgMSB9XG4vLyBcdFx0XHRcdFx0OiBudWxsO1xuLy8gXHRcdFx0Y2FzZSAnZWFzdCc6XG4vLyBcdFx0XHRcdHJldHVybiBzdGFydC54IDwgd2lkdGggLSAxXG4vLyBcdFx0XHRcdFx0PyB7IHg6IHN0YXJ0LnggKyAxLCB5OiBzdGFydC55IH1cbi8vIFx0XHRcdFx0XHQ6IG51bGw7XG4vLyBcdFx0XHRjYXNlICd3ZXN0Jzpcbi8vIFx0XHRcdFx0cmV0dXJuIHN0YXJ0LnggPiAwXG4vLyBcdFx0XHRcdFx0PyB7IHg6IHN0YXJ0LnggLSAxLCB5OiBzdGFydC55IH1cbi8vIFx0XHRcdFx0XHQ6IG51bGw7XG4vLyBcdFx0XHRkZWZhdWx0OiB0aHJvdyBuZXcgRXhjZXB0aW9uKCdJbnZhbGlkIGRpcmVjdGlvbiAnICsgZGlyKTtcbi8vIFx0XHR9XG4vLyBcdH1cblxuLy8gXHQvKipcbi8vIFx0ICogR2V0cyB0aGUgY29vcmRpbmF0ZXMgb2YgYWxsIHNxdWFyZXMgYWRqYWNlbnQgdG8gYSBnaXZlbiBzcXVhcmUuXG4vLyBcdCAqIEBwYXJhbSB7b2JqZWN0fSBzdGFydCBDb29yZGluYXRlcyBvZiB0aGUgc3RhcnRpbmcgc3F1YXJlLlxuLy8gXHQgKiBAcmV0dXJucyB7b2JqZWN0fSBDb29yZGluYXRlcyBvZiBhZGphY2VudCBzcXVhcmVzIGluIGVhY2ggZGlyZWN0aW9uLlxuLy8gXHQgKi9cbi8vIFx0ZnVuY3Rpb24gYWRqYWNlbnRTcXVhcmVzKHN0YXJ0KSB7XG4vLyBcdFx0cmV0dXJuIERJUkVDVElPTlMucmVkdWNlKChvYmosIGRpcikgPT4ge1xuLy8gXHRcdFx0b2JqW2Rpcl0gPSBhZGphY2VudFNxdWFyZShzdGFydCwgZGlyKTtcbi8vIFx0XHRcdHJldHVybiBvYmo7XG4vLyBcdFx0fSwge30pO1xuLy8gXHR9XG5cbi8vIFx0LyoqXG4vLyBcdCAqIEdldHMgdGhlIHJlbGF0aXZlIGRpcmVjdGlvbiBiZXR3ZWVuIHR3byBhZGphY2VudCBzcXVhcmVzLlxuLy8gXHQgKiBAcGFyYW0ge29iamVjdH0gc3RhcnQgVGhlIHN0YXJ0aW5nIHNxdWFyZS5cbi8vIFx0ICogQHBhcmFtIHtvYmplY3R9IGVuZCBUaGUgZW5kaW5nIHNxdWFyZS5cbi8vIFx0ICogQHJldHVybnMge3N0cmlnbn0gQ2FyZGluYWwgZGlyZWN0aW9uIGZyb20gc3RhcnQgdG8gZW5kLlxuLy8gXHQgKi9cbi8vIFx0ZnVuY3Rpb24gcmVsYXRpdmVEaXJlY3Rpb24oc3RhcnQsIGVuZCkge1xuLy8gXHRcdGlmIChNYXRoLmFicyhlbmQueCAtIHN0YXJ0LngpICsgTWF0aC5hYnMoZW5kLnkgLSBzdGFydC55KSA+IDEpIHtcbi8vIFx0XHRcdC8vIFNxdWFyZXMgYXJlIG5vdCBhZGphY2VudFxuLy8gXHRcdFx0cmV0dXJuIG51bGw7XG4vLyBcdFx0fVxuXG4vLyBcdFx0aWYgKHN0YXJ0LnggPCBlbmQueCkge1xuLy8gXHRcdFx0cmV0dXJuICdlYXN0Jztcbi8vIFx0XHR9IGVsc2UgaWYgKGVuZC54IDwgc3RhcnQueCkge1xuLy8gXHRcdFx0cmV0dXJuICd3ZXN0Jztcbi8vIFx0XHR9IGVsc2UgaWYgKHN0YXJ0LnkgPCBlbmQueSkge1xuLy8gXHRcdFx0cmV0dXJuICdzb3V0aCc7XG4vLyBcdFx0fSBlbHNlIGlmIChlbmQueSA8IHN0YXJ0LnkpIHtcbi8vIFx0XHRcdHJldHVybiAnbm9ydGgnO1xuLy8gXHRcdH1cbi8vIFx0fVxuXG4vLyBcdGZ1bmN0aW9uIGdlbmVyYXRlKCkge1xuLy8gXHRcdHZhciBtZXNoID0gW107XG4vLyBcdFx0dmFyIGVkZ2VzID0gW107XG4vLyBcdFx0dmFyIGxlbmd0aCA9IDA7XG4vLyBcdFx0dmFyIHgsIHk7XG4vLyBcdFx0dmFyIHN0YXJ0LCBlbmQ7XG5cbi8vIFx0XHRmdW5jdGlvbiBnZXRTcXVhcmUoc3F1YXJlKSB7XG4vLyBcdFx0XHRyZXR1cm4gbWVzaFtzcXVhcmUueF1bc3F1YXJlLnldO1xuLy8gXHRcdH1cblxuLy8gXHRcdGZ1bmN0aW9uIGlzb2xhdGVkKHNxdWFyZSkge1xuLy8gXHRcdFx0c3F1YXJlID0gZ2V0U3F1YXJlKHNxdWFyZSk7XG4vLyBcdFx0XHRyZXR1cm4gRElSRUNUSU9OUy5ldmVyeShkaXIgPT4gc3F1YXJlW2Rpcl0gIT09IHRydWUpO1xuLy8gXHRcdH1cblxuLy8gXHRcdGZ1bmN0aW9uIGNvbm5lY3QoYSwgYikge1xuLy8gXHRcdFx0Ly9jb25zb2xlLmxvZyhbJ0NPTk5FQ1RJTkcgKCcsYS54LCcsJyxhLnksJykgYW5kICgnLGIueCwnLCcsYi55LCcpLiddLmpvaW4oJycpKTtcbi8vIFx0XHRcdG1lc2hbYS54XVthLnldW3JlbGF0aXZlRGlyZWN0aW9uKGEsIGIpXSA9IHRydWU7XG4vLyBcdFx0XHRtZXNoW2IueF1bYi55XVtyZWxhdGl2ZURpcmVjdGlvbihiLCBhKV0gPSB0cnVlO1xuLy8gXHRcdH1cblxuLy8gXHRcdGZ1bmN0aW9uIG9wZW5FZGdlKHNxdWFyZSkge1xuLy8gXHRcdFx0dmFyIHt4LCB5fSA9IHNxdWFyZTtcbi8vIFx0XHRcdGlmICh4ID09PSAwKSB7XG4vLyBcdFx0XHRcdG1lc2hbeF1beV0ud2VzdCA9IHRydWU7XG4vLyBcdFx0XHR9IGVsc2UgaWYgKHkgPT09IDApIHtcbi8vIFx0XHRcdFx0bWVzaFt4XVt5XS5ub3J0aCA9IHRydWU7XG4vLyBcdFx0XHR9IGVsc2UgaWYgKHggPT09ICh3aWR0aCAtIDEpKSB7XG4vLyBcdFx0XHRcdG1lc2hbeF1beV0uZWFzdCA9IHRydWU7XG4vLyBcdFx0XHR9IGVsc2UgaWYgKHkgPT09IChoZWlnaHQgLSAxKSkge1xuLy8gXHRcdFx0XHRtZXNoW3hdW3ldLnNvdXRoID0gdHJ1ZTtcbi8vIFx0XHRcdH0gZWxzZSB7XG4vLyBcdFx0XHRcdHRocm93IG5ldyBFcnJvcignRGVzdGluYXRpb24gbm90IG9uIGVkZ2UuJyk7XG4vLyBcdFx0XHR9XG4vLyBcdFx0fVxuXG4vLyBcdFx0ZnVuY3Rpb24gc2VhcmNoKHBvcykge1xuLy8gXHRcdFx0dmFyIGFkamFjZW5jaWVzLCBvcHRpb25zLCBoZWFkaW5nLCBuZXh0O1xuXG4vLyBcdFx0XHRpZiAocG9zLnggPT09IGVuZC54ICYmIHBvcy55ID09PSBlbmQueSkge1xuLy8gXHRcdFx0XHRvcGVuRWRnZShwb3MpO1xuLy8gXHRcdFx0XHRjb25zb2xlLmxvZygnTEVOR1RIJywgbGVuZ3RoKTtcbi8vIFx0XHRcdFx0cmV0dXJuO1xuLy8gXHRcdFx0fVxuXG4vLyBcdFx0XHRhZGphY2VuY2llcyA9IGFkamFjZW50U3F1YXJlcyhwb3MpO1xuXG4vLyBcdFx0XHR3aGlsZSAoMSkge1xuLy8gXHRcdFx0XHRvcHRpb25zID0gT2JqZWN0LmtleXMoYWRqYWNlbmNpZXMpXG4vLyBcdFx0XHRcdFx0LmZpbHRlcihkaXIgPT4gYWRqYWNlbmNpZXNbZGlyXSlcbi8vIFx0XHRcdFx0XHQuZmlsdGVyKGRpciA9PiBpc29sYXRlZChhZGphY2VudFNxdWFyZShwb3MsIGRpcikpKTtcbi8vIFx0XHRcdFx0aWYgKCFvcHRpb25zLmxlbmd0aCkgYnJlYWs7XG5cbi8vIFx0XHRcdFx0aGVhZGluZyA9IHJhbmRvbUVsZW1lbnQob3B0aW9ucyk7XG4vLyBcdFx0XHRcdG5leHQgPSBhZGphY2VuY2llc1toZWFkaW5nXTtcbi8vIFx0XHRcdFx0Y29ubmVjdChwb3MsIG5leHQpO1xuLy8gXHRcdFx0XHRsZW5ndGgrKztcbi8vIFx0XHRcdFx0c2VhcmNoKG5leHQpO1xuLy8gXHRcdFx0XHRsZW5ndGgtLTtcbi8vIFx0XHRcdH1cblxuLy8gXHRcdH1cblxuLy8gXHRcdGZvciAoeCA9IDA7IHggPCB3aWR0aDsgeCsrKSB7XG4vLyBcdFx0XHRtZXNoW3hdID0gW107XG4vLyBcdFx0XHRmb3IgKHkgPSAwOyB5IDwgaGVpZ2h0OyB5KyspIHtcbi8vIFx0XHRcdFx0aWYgKHggPT09IDAgfHxcbi8vIFx0XHRcdFx0XHR5ID09PSAwIHx8XG4vLyBcdFx0XHRcdFx0eCA9PT0gKHdpZHRoIC0gMSkgfHxcbi8vIFx0XHRcdFx0XHR5ID09PSAoaGVpZ2h0IC0gMSlcbi8vIFx0XHRcdFx0KSB7XG4vLyBcdFx0XHRcdFx0ZWRnZXMucHVzaCh7eCwgeX0pO1xuLy8gXHRcdFx0XHR9XG5cbi8vIFx0XHRcdFx0bWVzaFt4XVt5XSA9IHtcbi8vIFx0XHRcdFx0XHRub3J0aDogMCA8IHkgPyBmYWxzZSA6IG51bGwsXG4vLyBcdFx0XHRcdFx0c291dGg6IHkgPCAoaGVpZ2h0IC0gMSkgPyBmYWxzZSA6IG51bGwsXG4vLyBcdFx0XHRcdFx0d2VzdDogMCA8IHggPyBmYWxzZSA6IG51bGwsXG4vLyBcdFx0XHRcdFx0ZWFzdDogeCA8ICh3aWR0aCAtIDEpID8gZmFsc2UgOiBudWxsXG4vLyBcdFx0XHRcdH07XG4vLyBcdFx0XHR9XG4vLyBcdFx0fVxuXG4vLyBcdFx0c3RhcnQgPSByYW5kb21FbGVtZW50KGVkZ2VzKTtcbi8vIFx0XHRwYXRoLnB1c2goc3RhcnQpO1xuLy8gXHRcdGRvIHtcbi8vIFx0XHRcdGVuZCA9IHJhbmRvbUVsZW1lbnQoZWRnZXMpO1xuLy8gXHRcdH0gd2hpbGUgKHN0YXJ0LnggPT09IGVuZC54IHx8IHN0YXJ0LnkgPT09IGVuZC55KTtcblxuLy8gXHRcdG9wZW5FZGdlKHN0YXJ0KTtcbi8vIFx0XHRzZWFyY2goc3RhcnQpO1xuXG4vLyBcdFx0cmV0dXJuIHtcbi8vIFx0XHRcdG1lc2gsXG4vLyBcdFx0XHRzdGFydCxcbi8vIFx0XHRcdGVuZFxuLy8gXHRcdH07XG4vLyBcdH1cblxuLy8gXHRmdW5jdGlvbiBicmlkZ2VFZGdlKHNxdWFyZSwgY29sb3IpIHtcbi8vIFx0XHRpZiAoc3F1YXJlLnggPT09IDApIHsgLy8gV2VzdFxuLy8gXHRcdFx0Z3JpZC5icmlkZ2Uoc3F1YXJlLnggLSAxLCBzcXVhcmUueSwgc3F1YXJlLngsIHNxdWFyZS55LCBjb2xvcik7XG4vLyBcdFx0fSBlbHNlIGlmIChzcXVhcmUueSA9PT0gMCkgeyAvLyBOb3J0aFxuLy8gXHRcdFx0Z3JpZC5icmlkZ2Uoc3F1YXJlLngsIHNxdWFyZS55IC0gMSwgc3F1YXJlLngsIHNxdWFyZS55LCBjb2xvcik7XG4vLyBcdFx0fSBlbHNlIGlmIChzcXVhcmUueCA9PT0gKHdpZHRoIC0gMSkpIHsgLy8gRWFzdFxuLy8gXHRcdFx0Z3JpZC5icmlkZ2Uoc3F1YXJlLngsIHNxdWFyZS55LCBzcXVhcmUueCArIDEsIHNxdWFyZS55LCBjb2xvcik7XG4vLyBcdFx0fSBlbHNlIGlmIChzcXVhcmUueSA9PT0gKGhlaWdodCAtIDEpKSB7IC8vIFNvdXRoXG4vLyBcdFx0XHRncmlkLmJyaWRnZShzcXVhcmUueCwgc3F1YXJlLnksIHNxdWFyZS54LCBzcXVhcmUueSArIDEsIGNvbG9yKTtcbi8vIFx0XHR9IGVsc2Uge1xuLy8gXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdTcXVhcmUgaXMgbm90IG9uIGVkZ2UuJyk7XG4vLyBcdFx0fVxuLy8gXHR9XG5cbi8vIFx0ZnVuY3Rpb24gcmVuZGVyKCRlbCkge1xuLy8gXHRcdHZhciB4LCB5O1xuXG4vLyBcdFx0Z3JpZCA9IG5ldyBHcmlkKCRlbCk7XG4vLyBcdFx0Z3JpZC5jbGVhcigpO1xuLy8gXHRcdGdyaWQuZ3JpZFdpZHRoID0gd2lkdGg7XG4vLyBcdFx0Z3JpZC5ncmlkSGVpZ2h0ID0gaGVpZ2h0O1xuXG4vLyBcdFx0Zm9yICh4ID0gMDsgeCA8IHdpZHRoOyB4KyspIHtcbi8vIFx0XHRcdGZvciAoeSA9IDA7IHkgPCBoZWlnaHQ7IHkrKykge1xuLy8gXHRcdFx0XHRpZiAoIW1hemUubWVzaFt4XVt5XS53ZXN0KSB7XG4vLyBcdFx0XHRcdFx0Z3JpZC5saW5lKHgsIHksIHgsIHkgKyAxKTtcbi8vIFx0XHRcdFx0fVxuLy8gXHRcdFx0XHRpZiAoIW1hemUubWVzaFt4XVt5XS5ub3J0aCkge1xuLy8gXHRcdFx0XHRcdGdyaWQubGluZSh4LCB5LCB4ICsgMSwgeSk7XG4vLyBcdFx0XHRcdH1cblxuLy8gXHRcdFx0XHQvLyBPbmx5IG5lZWQgdG8gZHJhdyBzb3V0aCBhbmQgZWFzdCBvbiBlZGdlc1xuLy8gXHRcdFx0XHRpZiAoeCA9PT0gd2lkdGggLSAxICYmICFtYXplLm1lc2hbeF1beV0uZWFzdCkge1xuLy8gXHRcdFx0XHRcdGdyaWQubGluZSh4ICsgMSwgeSwgeCArIDEsIHkgKyAxKTtcbi8vIFx0XHRcdFx0fVxuLy8gXHRcdFx0XHRpZiAoeSA9PT0gaGVpZ2h0IC0gMSAmJiAhbWF6ZS5tZXNoW3hdW3ldLnNvdXRoKSB7XG4vLyBcdFx0XHRcdFx0Z3JpZC5saW5lKHgsIHkgKyAxLCB4ICsgMSwgeSArIDEpO1xuLy8gXHRcdFx0XHR9XG4vLyBcdFx0XHR9XG4vLyBcdFx0fVxuXG4vLyBcdFx0Z3JpZC5maWxsKG1hemUuc3RhcnQueCwgbWF6ZS5zdGFydC55LCBHUkVFTik7XG4vLyBcdFx0Z3JpZC5maWxsKG1hemUuZW5kLngsIG1hemUuZW5kLnksIFJFRCk7XG4vLyBcdFx0YnJpZGdlRWRnZShtYXplLnN0YXJ0LCBHUkVFTik7XG4vLyBcdFx0YnJpZGdlRWRnZShtYXplLmVuZCwgUkVEKTtcbi8vIFx0fVxuXG4vLyBcdGZ1bmN0aW9uIG1vdmUoZGlyKSB7XG4vLyBcdFx0dmFyIHBvcyA9IGxhc3RFbGVtZW50KHBhdGgpO1xuLy8gXHRcdHZhciBwcmV2aW91cyA9IHBhdGhbcGF0aC5sZW5ndGggLSAyXTtcbi8vIFx0XHR2YXIgbmV4dDtcblxuLy8gXHRcdC8vIERvbid0IGJyZWFrIGRvd24gd2FsbHNcbi8vIFx0XHRpZiAoIW1hemUubWVzaFtwb3MueF1bcG9zLnldW2Rpcl0pIHJldHVybiBmYWxzZTtcblxuLy8gXHRcdG5leHQgPSBhZGphY2VudFNxdWFyZShwb3MsIGRpcik7XG4vLyBcdFx0aWYgKCFuZXh0KSByZXR1cm4gZmFsc2U7XG5cbi8vIFx0XHRpZiAocHJldmlvdXMgJiYgbmV4dC54ID09PSBwcmV2aW91cy54ICYmIG5leHQueSA9PT0gcHJldmlvdXMueSkge1xuLy8gXHRcdFx0Z3JpZC5icmlkZ2UocG9zLngsIHBvcy55LCBuZXh0LngsIG5leHQueSwgUkVEKTtcbi8vIFx0XHRcdGdyaWQuZmlsbChwb3MueCwgcG9zLnksIFJFRCk7XG4vLyBcdFx0XHRwYXRoLnBvcCgpO1xuLy8gXHRcdH0gZWxzZSB7XG4vLyBcdFx0XHRncmlkLmJyaWRnZShwb3MueCwgcG9zLnksIG5leHQueCwgbmV4dC55LCBHUkVFTik7XG4vLyBcdFx0XHRncmlkLmZpbGwobmV4dC54LCBuZXh0LnksIEdSRUVOKTtcbi8vIFx0XHRcdHBhdGgucHVzaChuZXh0KTtcbi8vIFx0XHR9XG5cbi8vIFx0XHRpZiAobmV4dC54ID09PSBtYXplLmVuZC54ICYmIG5leHQueSA9PT0gbWF6ZS5lbmQueSkge1xuLy8gXHRcdFx0YnJpZGdlRWRnZShuZXh0LCBHUkVFTik7XG4vLyBcdFx0XHRyZXR1cm4gdHJ1ZTtcbi8vIFx0XHR9XG4vLyBcdFx0cmV0dXJuIGZhbHNlO1xuLy8gXHR9XG5cbi8vIFx0ZnVuY3Rpb24gZW50ZXJTcXVhcmUoc3F1YXJlKSB7XG4vLyBcdFx0dmFyIHBvcyA9IGxhc3RFbGVtZW50KHBhdGgpO1xuLy8gXHRcdHZhciBkaXIgPSByZWxhdGl2ZURpcmVjdGlvbihwb3MsIHNxdWFyZSk7XG4vLyBcdFx0aWYgKGRpcikgbW92ZShkaXIpO1xuLy8gXHR9XG5cbi8vIFx0dmFyIGhvdmVyID0gKGZ1bmN0aW9uICgpIHtcbi8vIFx0XHR2YXIgX3gsIF95O1xuXG4vLyBcdFx0cmV0dXJuIGZ1bmN0aW9uICh4LCB5KSB7XG4vLyBcdFx0XHR4ID0gR3JpZC50b1NxdWFyZXMoeCk7XG4vLyBcdFx0XHR5ID0gR3JpZC50b1NxdWFyZXMoeSk7XG4vLyBcdFx0XHRpZiAoeCA+PSAwICYmIHkgPj0gMCAmJiAoeCAhPT0gX3ggfHwgeSAhPT0gX3kpKSB7XG4vLyBcdFx0XHRcdF94ID0geDtcbi8vIFx0XHRcdFx0X3kgPSB5O1xuLy8gXHRcdFx0XHRlbnRlclNxdWFyZSh7eCwgeX0pO1xuLy8gXHRcdFx0fVxuLy8gXHRcdH07XG5cbi8vIFx0fSkoKTtcblxuLy8gXHRtYXplID0gZ2VuZXJhdGUoKTtcblxuLy8gXHRyZXR1cm4ge1xuLy8gXHRcdHJlbmRlcixcbi8vIFx0XHRtb3ZlLFxuLy8gXHRcdGhvdmVyXG4vLyBcdH07XG5cbi8vIH1cblxuLy8gbW9kdWxlLmV4cG9ydHMgPSBNYXplO1xuIiwiZXhwb3J0IGZ1bmN0aW9uIG1vZChhLCBiKSB7XG5cdHJldHVybiAoKGEgJSBiKSArIGIpICUgYjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbSgpIHtcblx0bGV0IHggPSBNYXRoLnNpbihyYW5kb20uc2VlZCsrKSAqIDEwMDAwO1xuXHRyZXR1cm4geCAtIE1hdGguZmxvb3IoeCk7XG59XG5cbnJhbmRvbS5zZWVkID0gTWF0aC5yYW5kb20oKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbUludChtYXgpIHtcblx0cmV0dXJuIE1hdGguZmxvb3IocmFuZG9tKCkgKiBtYXgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tRWxlbWVudChhcnIpIHtcblx0cmV0dXJuIGFycltyYW5kb21JbnQoYXJyLmxlbmd0aCldO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGFzdEVsZW1lbnQoYXJyKSB7XG5cdHJldHVybiBhcnJbYXJyLmxlbmd0aCAtIDFdO1xufVxuIl19