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
		_classCallCheck(this, App);

		this.$width = document.querySelector("#width");
		this.$height = document.querySelector("#height");
		this.$permalink = document.querySelector("#permalink");
		this.$canvas = document.querySelector("#canvas");

		document.querySelector("#generate").addEventListener("click", this.onGenerate.bind(this));
		document.body.addEventListener("keydown", this.onKeyDown.bind(this));
		this.$canvas.addEventListener("mousemove", this.onMouseMove.bind(this));

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
		},
		onGenerate: {
			value: function onGenerate(event) {
				event.preventDefault();
				this.generate();
			},
			writable: true,
			configurable: true
		},
		onKeyDown: {
			value: function onKeyDown(event) {
				var direction = ["west", "north", "east", "south"][event.keyCode - 37];
				if (!direction) {
					return;
				}event.preventDefault();
				this.maze.move(direction);
			},
			writable: true,
			configurable: true
		},
		onMouseMove: {
			value: function onMouseMove(event) {
				var clientRect = this.$canvas.getBoundingClientRect();
				this.maze.hover(event.clientX - clientRect.left, event.clientY - clientRect.top);
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2NvbG9ycy5qcyIsInNyYy9ncmlkLmpzIiwic3JjL21hemUuanMiLCJzcmMvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7SUNBTyxJQUFJLDJCQUFNLFFBQVE7O0lBQ2hCLE1BQU0sV0FBUSxRQUFRLEVBQXRCLE1BQU07SUFFVCxHQUFHO0FBT0csVUFQTixHQUFHO3dCQUFILEdBQUc7O0FBUVAsTUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9DLE1BQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqRCxNQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdkQsTUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUVqRCxVQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzFGLFVBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDckUsTUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7O3FCQUd4QyxnQ0FBZ0MsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENB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QyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFO0FBQzNCLFdBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO09BQzFCOzs7QUFHRCxVQUFJLENBQUMsS0FBSyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7QUFDN0MsV0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztPQUNsQztBQUNELFVBQUksQ0FBQyxLQUFLLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRTtBQUMvQyxXQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO09BQ2xDO01BQ0Q7S0FDRDs7QUFFRCxRQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzdDLFFBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdkMsUUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ25DLFFBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJ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QUVELE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDOztBQUVyQixTQUFTLFNBQVMsQ0FBQyxHQUFHLEVBQUU7QUFDOUIsUUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0NBQ2xDOztBQUVNLFNBQVMsYUFBYSxDQUFDLEdBQUcsRUFBRTtBQUNsQyxRQUFPLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Q0FDbEM7O0FBRU0sU0FBUyxXQUFXLENBQUMsR0FBRyxFQUFFO0FBQ2hDLFFBQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7Q0FDM0IiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii9qc3giLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBNYXplIGZyb20gJy4vbWF6ZSc7XG5pbXBvcnQgeyByYW5kb20gfSBmcm9tICcuL3V0aWwnO1xuXG5jbGFzcyBBcHAge1xuXHRnZXQgd2lkdGgoKSB7IHJldHVybiArdGhpcy4kd2lkdGgudmFsdWU7IH1cblx0c2V0IHdpZHRoKHZhbHVlKSB7IHRoaXMuJHdpZHRoLnZhbHVlID0gdmFsdWU7IH1cblxuXHRnZXQgaGVpZ2h0KCkgeyByZXR1cm4gK3RoaXMuJGhlaWdodC52YWx1ZTsgfVxuXHRzZXQgaGVpZ2h0KHZhbHVlKSB7IHRoaXMuJGhlaWdodC52YWx1ZSA9IHZhbHVlOyB9XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy4kd2lkdGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd2lkdGgnKTtcblx0XHR0aGlzLiRoZWlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaGVpZ2h0Jyk7XG5cdFx0dGhpcy4kcGVybWFsaW5rID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Blcm1hbGluaycpO1xuXHRcdHRoaXMuJGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjYW52YXMnKTtcblxuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNnZW5lcmF0ZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkdlbmVyYXRlLmJpbmQodGhpcykpO1xuXHRcdGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMub25LZXlEb3duLmJpbmQodGhpcykpO1xuXHRcdHRoaXMuJGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlLmJpbmQodGhpcykpO1xuXG5cdFx0Ly8gQXR0ZW1wdCB0byByZWFkIG1hemUgcGFyYW1ldGVycyBmcm9tIFVSTCBoYXNoXG5cdFx0Y29uc3QgWywgd2lkdGgsIGhlaWdodCwgc2VlZF0gPSAvIyhcXGQrKXgoXFxkKykoPzpzKFxcZCsuXFxkKykpP3wuKi8uZXhlYyh3aW5kb3cubG9jYXRpb24uaGFzaCk7XG5cblx0XHRpZiAod2lkdGggJiYgaGVpZ2h0KSB7XG5cdFx0XHR0aGlzLndpZHRoID0gd2lkdGg7XG5cdFx0XHR0aGlzLmhlaWdodCA9IGhlaWdodDtcblx0XHR9XG5cblx0XHRpZiAoc2VlZCkge1xuXHRcdFx0cmFuZG9tLnNlZWQgPSBwYXJzZUZsb2F0KHNlZWQpO1xuXHRcdH1cblxuXHRcdHRoaXMuZ2VuZXJhdGUoKTtcblx0fVxuXG5cdGdlbmVyYXRlKCkge1xuXHRcdHRoaXMuc2V0UGVybWFsaW5rKCk7XG5cblx0XHR0aGlzLm1hemUgPSBuZXcgTWF6ZSh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cdFx0dGhpcy5tYXplLnJlbmRlcih0aGlzLiRjYW52YXMpO1xuXHR9XG5cblx0c2V0UGVybWFsaW5rKCkge1xuXHRcdGNvbnN0IGhhc2ggPSBgIyR7dGhpcy53aWR0aH14JHt0aGlzLmhlaWdodH1zJHtyYW5kb20uc2VlZH1gO1xuXHRcdGNvbnN0IGhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdCgnIycpWzBdICsgaGFzaDtcblx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IGhhc2g7XG5cdFx0dGhpcy4kcGVybWFsaW5rLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuXHR9XG5cblx0b25HZW5lcmF0ZShldmVudCkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dGhpcy5nZW5lcmF0ZSgpO1xuXHR9XG5cblx0b25LZXlEb3duKGV2ZW50KSB7XG5cdFx0Y29uc3QgZGlyZWN0aW9uID0gWyd3ZXN0JywgJ25vcnRoJywgJ2Vhc3QnLCAnc291dGgnXVtldmVudC5rZXlDb2RlIC0gMzddO1xuXHRcdGlmICghZGlyZWN0aW9uKSByZXR1cm47XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHRoaXMubWF6ZS5tb3ZlKGRpcmVjdGlvbik7XG5cdH1cblxuXHRvbk1vdXNlTW92ZShldmVudCkge1xuXHRcdGNvbnN0IGNsaWVudFJlY3QgPSB0aGlzLiRjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0dGhpcy5tYXplLmhvdmVyKGV2ZW50LmNsaWVudFggLSBjbGllbnRSZWN0LmxlZnQsIGV2ZW50LmNsaWVudFkgLSBjbGllbnRSZWN0LnRvcCk7XG5cdH1cbn1cblxubmV3IEFwcCgpO1xuIiwiZXhwb3J0IGNvbnN0IERBUktfR1JBWSA9ICcjMTYxOTFkJztcclxuZXhwb3J0IGNvbnN0IEdSRUVOID0gJyM0ZWNkYzQnO1xyXG5leHBvcnQgY29uc3QgUkVEID0gJyNmZjdiN2InO1xyXG4iLCJpbXBvcnQgeyBtb2QgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgREFSS19HUkFZIH0gZnJvbSAnLi9jb2xvcnMnO1xuXG5jb25zdCBTSVpFID0gMjA7IC8vIFdpZHRoIG9mIGEgc3F1YXJlIGluIHBpeGVsc1xuY29uc3QgV0VJR0hUID0gMjsgLy8gV2lkdGggb2YgdGhlIGxpbmUgYmV0d2VlbiBzcXVhcmVzIGluIHBpeGVsc1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmlkIHtcblxuXHRnZXQgcGl4ZWxIZWlnaHQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuY3R4LmNhbnZhcy5oZWlnaHQ7XG5cdH1cblxuXHRzZXQgcGl4ZWxIZWlnaHQocGl4ZWxzKSB7XG5cdFx0dGhpcy5jdHguY2FudmFzLmhlaWdodCA9IHBpeGVscztcblx0fVxuXG5cdGdldCBwaXhlbFdpZHRoKCkge1xuXHRcdHJldHVybiB0aGlzLmN0eC5jYW52YXMud2lkdGg7XG5cdH1cblxuXHRzZXQgcGl4ZWxXaWR0aChwaXhlbHMpIHtcblx0XHR0aGlzLmN0eC5jYW52YXMud2lkdGggPSBwaXhlbHM7XG5cdH1cblxuXHRnZXQgZ3JpZEhlaWdodCgpIHtcblx0XHRyZXR1cm4gKHRoaXMucGl4ZWxIZWlnaHQgLSBXRUlHSFQpIC8gKFNJWkUgKyBXRUlHSFQpO1xuXHR9XG5cblx0c2V0IGdyaWRIZWlnaHQoc3F1YXJlcykge1xuXHRcdHRoaXMucGl4ZWxIZWlnaHQgPSBzcXVhcmVzICogU0laRSArIChzcXVhcmVzICsgMSkgKiBXRUlHSFQ7XG5cdH1cblxuXHRnZXQgZ3JpZFdpZHRoKCkge1xuXHRcdHJldHVybiAodGhpcy5waXhlbFdpZHRoIC0gV0VJR0hUKSAvIChTSVpFICsgV0VJR0hUKTtcblx0fVxuXG5cdHNldCBncmlkV2lkdGgoc3F1YXJlcykge1xuXHRcdHRoaXMucGl4ZWxXaWR0aCA9IHNxdWFyZXMgKiBTSVpFICsgKHNxdWFyZXMgKyAxKSAqIFdFSUdIVDtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBmcm9tIHNxdWFyZSB1bml0cyB0byBwaXhlbCB1bml0cy5cblx0ICogQHBhcmFtIHtpbnR9IHNxdWFyZXMgWmVyby1iYXNlZCBzcXVhcmUgY29vcmRpbmF0ZS5cblx0ICogQHJldHVybnMge2ludH0gVGhlIGNvb3JkaW5hdGUgb2YgdGhlIHBpeGVsIGNsb3Nlc3QgdG8gdGhlIG9yaWdpbiBpbiB0aGUgc3F1YXJlLlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRzdGF0aWMgdG9QaXhlbHMoc3F1YXJlcykge1xuXHRcdHJldHVybiAoV0VJR0hUIC8gMikgKyBzcXVhcmVzICogKFdFSUdIVCArIFNJWkUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGZyb20gcGl4ZWwgdW5pdHMgdG8gc3F1YXJlIHVuaXRzLlxuXHQgKiBAcGFyYW0ge2ludH0gcGl4ZWxzIFplcm8tYmFzZWQgY29vcmRpbmF0ZSBvZiBhIHBpeGVsLlxuXHQgKiBAcmV0dXJucyB7aW50fSBUaGUgemVyby1iYXNlZCBjb29yZGluYXRlIG9mIHRoZSBzcXVhcmUgY29udGFpbmluZyB0aGUgcGl4ZWwsIG9yIC0xIGlmIHRoZVxuXHQgKiAgICAgICAgICAgICAgICBwaXhlbCBpcyBvbiBhIGJvdW5kYXJ5IGJldHdlZW4gc3F1YXJlcy5cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0c3RhdGljIHRvU3F1YXJlcyhwaXhlbHMpIHtcblx0XHRpZiAobW9kKHBpeGVscyAtIFdFSUdIVCwgU0laRSArIFdFSUdIVCkgPj0gKFNJWkUgLSBXRUlHSFQpKSB7XG5cdFx0XHQvLyBPbiBhIGxpbmVcblx0XHRcdHJldHVybiAtMTtcblx0XHR9XG5cblx0XHRyZXR1cm4gTWF0aC5mbG9vcigocGl4ZWxzIC0gV0VJR0hUKSAvIChTSVpFICsgV0VJR0hUKSk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBHcmlkIGluc3RhbmNlIGdpdmVuIGEgZHJhd2luZyBjYW52YXMuXG5cdCAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR9ICRjYW52YXMgVGhlIDxjYW52YXM+IGVsZW1lbnQgb24gd2hpY2ggdG8gZHJhdy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKCRjYW52YXMpIHtcblx0XHR0aGlzLmN0eCA9ICRjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDbGVhcnMgdGhlIGVudGlyZSBkcmF3aW5nIHN1cmZhY2UuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRjbGVhcigpIHtcblx0XHR0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5waXhlbFdpZHRoLCB0aGlzLnBpeGVsSGVpZ2h0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBGaWxscyB0aGUgaW50ZXJpb3Igb2YgYSBncmlkIHNxdWFyZSB3aXRoIGEgY29sb3IuXG5cdCAqIEBwYXJhbSB7aW50fSB4IFplcm8tYmFzZWQgeC1jb29yZGluYXRlIG9mIHRoZSBzcXVhcmUgaW4gdW5pdHMgb2Ygc3F1YXJlcy5cblx0ICogQHBhcmFtIHtpbnR9IHkgWmVyby1iYXNlZCB5LWNvb3JkaW5hdGUgb2YgdGhlIHNxdWFyZSBpbiB1bml0cyBvZiBzcXVhcmVzLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gY29sb3IgQSBDU1MgY29sb3IgdmFsdWUuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRmaWxsKHgsIHksIGNvbG9yKSB7XG5cdFx0Y29uc3QgY3R4ID0gdGhpcy5jdHg7XG5cdFx0Y29uc3QgX2ZpbGxTdHlsZSA9IGN0eC5maWxsU3R5bGU7XG5cdFx0Y3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuXG5cdFx0Y3R4LmZpbGxSZWN0KFxuXHRcdFx0R3JpZC50b1BpeGVscyh4KSArIChXRUlHSFQgLyAyKSxcblx0XHRcdEdyaWQudG9QaXhlbHMoeSkgKyAoV0VJR0hUIC8gMiksXG5cdFx0XHRTSVpFLFxuXHRcdFx0U0laRVxuXHRcdCk7XG5cblx0XHRjdHguZmlsbFN0eWxlID0gX2ZpbGxTdHlsZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEcmF3cyB0aGUgYm9yZGVyIHNoYXJlZCBieSB0d28gc3F1YXJlcy5cblx0ICogQHBhcmFtIHtpbnR9IHgxIFplcm8tYmFzZWQgeC1jb29yZGluYXRlIG9mIHRoZSBmaXJzdCBzcXVhcmUgaW4gdW5pdHMgb2Ygc3F1YXJlcy5cblx0ICogQHBhcmFtIHtpbnR9IHkxIFplcm8tYmFzZWQgeS1jb29yZGluYXRlIG9mIHRoZSBmaXJzdCBzcXVhcmUgaW4gdW5pdHMgb2Ygc3F1YXJlcy5cblx0ICogQHBhcmFtIHtpbnR9IHgyIFplcm8tYmFzZWQgeC1jb29yZGluYXRlIG9mIHRoZSBzZWNvbmQgc3F1YXJlIGluIHVuaXRzIG9mIHNxdWFyZXMuXG5cdCAqIEBwYXJhbSB7aW50fSB5MiBaZXJvLWJhc2VkIHktY29vcmRpbmF0ZSBvZiB0aGUgc2Vjb25kIHNxdWFyZSBpbiB1bml0cyBvZiBzcXVhcmVzLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gY29sb3IgQSBDU1MgY29sb3IgdmFsdWUuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRicmlkZ2UoeDEsIHkxLCB4MiwgeTIsIGNvbG9yKSB7XG5cdFx0aWYgKE1hdGguYWJzKHgyIC0geDEpICsgTWF0aC5hYnMoeTIgLSB5MSkgIT09IDEpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignU3F1YXJlcyBhcmUgbm90IGFkamFjZW50LicpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHggPSBNYXRoLm1heCh4MSwgeDIpO1xuXHRcdGNvbnN0IHkgPSBNYXRoLm1heCh5MSwgeTIpO1xuXG5cdFx0Y29uc3QgY3R4ICAgICAgICAgID0gdGhpcy5jdHg7XG5cdFx0Y29uc3QgX2xpbmVDYXAgICAgID0gY3R4LmxpbmVDYXA7XG5cdFx0Y29uc3QgX2xpbmVXaWR0aCAgID0gY3R4LmxpbmVXaWR0aDtcblx0XHRjb25zdCBfc3Ryb2tlU3R5bGUgPSBjdHguc3Ryb2tlU3R5bGU7XG5cdFx0Y3R4LmxpbmVDYXAgICAgICAgID0gJ3NxdWFyZSc7XG5cdFx0Y3R4LmxpbmVXaWR0aCAgICAgID0gV0VJR0hUO1xuXHRcdGN0eC5zdHJva2VTdHlsZSAgICA9IGNvbG9yO1xuXG5cdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdGlmICh4MSA9PT0geDIpIHtcblx0XHRcdC8vIEJyaWRnZSBub3J0aC9zb3V0aCBzcXVhcmVzXG5cdFx0XHQvLyBOYXJyb3dlciB4IGRpbWVuc2lvbnNcblx0XHRcdGN0eC5tb3ZlVG8oR3JpZC50b1BpeGVscyh4MSkgKyBXRUlHSFQsIEdyaWQudG9QaXhlbHMoeSkpO1xuXHRcdFx0Y3R4LmxpbmVUbyhHcmlkLnRvUGl4ZWxzKHgxICsgMSkgLSBXRUlHSFQsIEdyaWQudG9QaXhlbHMoeSkpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBCcmlkZ2UgZWFzdC93ZXN0IHNxdWFyZXNcblx0XHRcdC8vIE5hcnJvd2VyIHkgZGltZW5zaW9uc1xuXHRcdFx0Y3R4Lm1vdmVUbyhHcmlkLnRvUGl4ZWxzKHgpLCBHcmlkLnRvUGl4ZWxzKHkxKSArIFdFSUdIVCk7XG5cdFx0XHRjdHgubGluZVRvKEdyaWQudG9QaXhlbHMoeCksIEdyaWQudG9QaXhlbHMoeTEgKyAxKSAtIFdFSUdIVCk7XG5cdFx0fVxuXHRcdGN0eC5zdHJva2UoKTtcblxuXHRcdGN0eC5saW5lQ2FwICAgICA9IF9saW5lQ2FwO1xuXHRcdGN0eC5saW5lV2lkdGggICA9IF9saW5lV2lkdGg7XG5cdFx0Y3R4LnN0cm9rZVN0eWxlID0gX3N0cm9rZVN0eWxlO1xuXHR9XG5cblx0LyoqXG5cdCAqIERyYXdzIGEgbGluZSBiZXR3ZWVuIHRoZSB1cHBlciBsZWZ0IGNvcm5lcnMgb2YgdHdvIGdyaWQgc3F1YXJlcy5cblx0ICogQHBhcmFtIHtpbnR9IHgxIFplcm8tYmFzZWQgeC1jb29yZGluYXRlIG9mIHRoZSBmaXJzdCBzcXVhcmUgcmVsYXRpdmUgdG8gdGhlIG9yaWdpbi5cblx0ICogQHBhcmFtIHtpbnR9IHkxIFplcm8tYmFzZWQgeS1jb29yZGluYXRlIG9mIHRoZSBmaXJzdCBzcXVhcmUgcmVsYXRpdmUgdG8gdGhlIG9yaWdpbi5cblx0ICogQHBhcmFtIHtpbnR9IHgyIFplcm8tYmFzZWQgeC1jb29yZGluYXRlIG9mIHRoZSBzZWNvbmQgc3F1YXJlIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW4uXG5cdCAqIEBwYXJhbSB7aW50fSB5MiBaZXJvLWJhc2VkIHktY29vcmRpbmF0ZSBvZiB0aGUgc2Vjb25kIHNxdWFyZSByZWxhdGl2ZSB0byB0aGUgb3JpZ2luLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gW2NvbG9yXSBBIENTUyBjb2xvciB2YWx1ZS4gRGVmYXVsdHMgdG8gZGFyayBncmF5LlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0bGluZSh4MSwgeTEsIHgyLCB5MiwgY29sb3IgPSBEQVJLX0dSQVkpIHtcblx0XHRjb25zdCBjdHggICAgICAgICAgPSB0aGlzLmN0eDtcblx0XHRjb25zdCBfbGluZUNhcCAgICAgPSBjdHgubGluZUNhcDtcblx0XHRjb25zdCBfbGluZVdpZHRoICAgPSBjdHgubGluZVdpZHRoO1xuXHRcdGNvbnN0IF9zdHJva2VTdHlsZSA9IGN0eC5zdHJva2VTdHlsZTtcblx0XHRjdHgubGluZUNhcCAgICAgICAgPSAnc3F1YXJlJztcblx0XHRjdHgubGluZVdpZHRoICAgICAgPSBXRUlHSFQ7XG5cdFx0Y3R4LnN0cm9rZVN0eWxlICAgID0gY29sb3I7XG5cblx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0Y3R4Lm1vdmVUbyhHcmlkLnRvUGl4ZWxzKHgxKSwgR3JpZC50b1BpeGVscyh5MSkpO1xuXHRcdGN0eC5saW5lVG8oR3JpZC50b1BpeGVscyh4MiksIEdyaWQudG9QaXhlbHMoeTIpKTtcblx0XHRjdHguc3Ryb2tlKCk7XG5cblx0XHRjdHgubGluZUNhcCAgICAgPSBfbGluZUNhcDtcblx0XHRjdHgubGluZVdpZHRoICAgPSBfbGluZVdpZHRoO1xuXHRcdGN0eC5zdHJva2VTdHlsZSA9IF9zdHJva2VTdHlsZTtcblx0fVxuXG59XG4iLCJpbXBvcnQgR3JpZCBmcm9tICcuL2dyaWQnO1xuaW1wb3J0IHsgbGFzdEVsZW1lbnQsIHJhbmRvbSwgcmFuZG9tRWxlbWVudCB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyBHUkVFTiwgUkVEIH0gZnJvbSAnLi9jb2xvcnMnO1xuXG5jb25zdCBESVJFQ1RJT05TID0gWydub3J0aCcsICdzb3V0aCcsICdlYXN0JywgJ3dlc3QnXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWF6ZSB7XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIHJlbGF0aXZlIGRpcmVjdGlvbiBiZXR3ZWVuIHR3byBhZGphY2VudCBzcXVhcmVzLlxuXHQgKiBAcGFyYW0ge29iamVjdH0gc3RhcnQgVGhlIHN0YXJ0aW5nIHNxdWFyZS5cblx0ICogQHBhcmFtIHtvYmplY3R9IGVuZCBUaGUgZW5kaW5nIHNxdWFyZS5cblx0ICogQHJldHVybnMge3N0cmlnbn0gQ2FyZGluYWwgZGlyZWN0aW9uIGZyb20gc3RhcnQgdG8gZW5kLlxuXHQgKi9cblx0c3RhdGljIHJlbGF0aXZlRGlyZWN0aW9uKHN0YXJ0LCBlbmQpIHtcblx0XHRpZiAoTWF0aC5hYnMoZW5kLnggLSBzdGFydC54KSArIE1hdGguYWJzKGVuZC55IC0gc3RhcnQueSkgPiAxKSB7XG5cdFx0XHQvLyBTcXVhcmVzIGFyZSBub3QgYWRqYWNlbnRcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGlmIChzdGFydC54IDwgZW5kLngpIHtcblx0XHRcdHJldHVybiAnZWFzdCc7XG5cdFx0fSBlbHNlIGlmIChlbmQueCA8IHN0YXJ0LngpIHtcblx0XHRcdHJldHVybiAnd2VzdCc7XG5cdFx0fSBlbHNlIGlmIChzdGFydC55IDwgZW5kLnkpIHtcblx0XHRcdHJldHVybiAnc291dGgnO1xuXHRcdH0gZWxzZSBpZiAoZW5kLnkgPCBzdGFydC55KSB7XG5cdFx0XHRyZXR1cm4gJ25vcnRoJztcblx0XHR9XG5cdH1cblxuXHRjb25zdHJ1Y3Rvcih3aWR0aCwgaGVpZ2h0KSB7XG5cdFx0dGhpcy53aWR0aCA9IHdpZHRoO1xuXHRcdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdHRoaXMubWF6ZSA9IHRoaXMuZ2VuZXJhdGUoKTtcblx0XHR0aGlzLnBhdGggPSBbdGhpcy5tYXplLnN0YXJ0XTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSBjb29yZGluYXRlcyBvZiBhbiBhZGphY2VudCBzcXVhcmUuXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBzdGFydCBTdGFydGluZyBzcXVhcmUncyBjb29yZGluYXRlcy5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGRpcmVjdGlvbiBDYXJkaW5hbCBkaXJlY3Rpb24gb2YgYWRqYWNlbnQgc3F1YXJlLlxuXHQgKiBAcmV0dXJucyB7b2JqZWN0fSBBZGphY2VudCBzcXVhcmUncyBjb29yZGluYXRlcy5cblx0ICovXG5cdGdldEFkamFjZW50U3F1YXJlKHN0YXJ0LCBkaXJlY3Rpb24pIHtcblx0XHRzd2l0Y2ggKGRpcmVjdGlvbikge1xuXHRcdFx0Y2FzZSAnbm9ydGgnOlxuXHRcdFx0XHRyZXR1cm4gc3RhcnQueSA+IDBcblx0XHRcdFx0XHQ/IHsgeDogc3RhcnQueCwgeTogc3RhcnQueSAtIDEgfVxuXHRcdFx0XHRcdDogbnVsbDtcblx0XHRcdGNhc2UgJ3NvdXRoJzpcblx0XHRcdFx0cmV0dXJuIHN0YXJ0LnkgPCB0aGlzLmhlaWdodCAtIDFcblx0XHRcdFx0XHQ/IHsgeDogc3RhcnQueCwgeTogc3RhcnQueSArIDEgfVxuXHRcdFx0XHRcdDogbnVsbDtcblx0XHRcdGNhc2UgJ2Vhc3QnOlxuXHRcdFx0XHRyZXR1cm4gc3RhcnQueCA8IHRoaXMud2lkdGggLSAxXG5cdFx0XHRcdFx0PyB7IHg6IHN0YXJ0LnggKyAxLCB5OiBzdGFydC55IH1cblx0XHRcdFx0XHQ6IG51bGw7XG5cdFx0XHRjYXNlICd3ZXN0Jzpcblx0XHRcdFx0cmV0dXJuIHN0YXJ0LnggPiAwXG5cdFx0XHRcdFx0PyB7IHg6IHN0YXJ0LnggLSAxLCB5OiBzdGFydC55IH1cblx0XHRcdFx0XHQ6IG51bGw7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZGlyZWN0aW9uICcgKyBkaXIpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSBjb29yZGluYXRlcyBvZiBhbGwgc3F1YXJlcyBhZGphY2VudCB0byBhIGdpdmVuIHNxdWFyZS5cblx0ICogQHBhcmFtIHtvYmplY3R9IHN0YXJ0IENvb3JkaW5hdGVzIG9mIHRoZSBzdGFydGluZyBzcXVhcmUuXG5cdCAqIEByZXR1cm5zIHtvYmplY3R9IENvb3JkaW5hdGVzIG9mIGFkamFjZW50IHNxdWFyZXMgaW4gZWFjaCBkaXJlY3Rpb24uXG5cdCAqL1xuXHRnZXRBZGphY2VudFNxdWFyZXMoc3RhcnQpIHtcblx0XHRyZXR1cm4gRElSRUNUSU9OUy5yZWR1Y2UoKG9iaiwgZGlyKSA9PiB7XG5cdFx0XHRvYmpbZGlyXSA9IHRoaXMuZ2V0QWRqYWNlbnRTcXVhcmUoc3RhcnQsIGRpcik7XG5cdFx0XHRyZXR1cm4gb2JqO1xuXHRcdH0sIHt9KTtcblx0fVxuXG5cdGdlbmVyYXRlKCkge1xuXHRcdGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gdGhpcztcblx0XHRjb25zdCBtZXNoID0gW107XG5cdFx0Y29uc3QgZWRnZXMgPSBbXTtcblx0XHRsZXQgbGVuZ3RoID0gMDtcblx0XHRsZXQgc3RhcnQsIGVuZDtcblxuXHRcdGZ1bmN0aW9uIGdldFNxdWFyZSh7IHgsIHkgfSkge1xuXHRcdFx0cmV0dXJuIG1lc2hbeF1beV07XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gaXNJc29sYXRlZChzcXVhcmUpIHtcblx0XHRcdHNxdWFyZSA9IGdldFNxdWFyZShzcXVhcmUpO1xuXHRcdFx0cmV0dXJuIERJUkVDVElPTlMuZXZlcnkoZGlyID0+IHNxdWFyZVtkaXJdICE9PSB0cnVlKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjb25uZWN0KGEsIGIpIHtcblx0XHRcdGdldFNxdWFyZShhKVtNYXplLnJlbGF0aXZlRGlyZWN0aW9uKGEsIGIpXSA9IHRydWU7XG5cdFx0XHRnZXRTcXVhcmUoYilbTWF6ZS5yZWxhdGl2ZURpcmVjdGlvbihiLCBhKV0gPSB0cnVlO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG9wZW5FZGdlKHNxdWFyZSkge1xuXHRcdFx0Y29uc3QgeyB4LCB5IH0gPSBzcXVhcmU7XG5cdFx0XHRsZXQgZGlyZWN0aW9uO1xuXG5cdFx0XHRpZiAoeCA9PT0gMCkge1xuXHRcdFx0XHRkaXJlY3Rpb24gPSAnd2VzdCc7XG5cdFx0XHR9IGVsc2UgaWYgKHkgPT09IDApIHtcblx0XHRcdFx0ZGlyZWN0aW9uID0gJ25vcnRoJztcblx0XHRcdH0gZWxzZSBpZiAoeCA9PT0gKHdpZHRoIC0gMSkpIHtcblx0XHRcdFx0ZGlyZWN0aW9uID0gJ2Vhc3QnO1xuXHRcdFx0fSBlbHNlIGlmICh5ID09PSAoaGVpZ2h0IC0gMSkpIHtcblx0XHRcdFx0ZGlyZWN0aW9uID0gJ3NvdXRoJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignRGVzdGluYXRpb24gbm90IGFuIGVkZ2UuJyk7XG5cdFx0XHR9XG5cblx0XHRcdGdldFNxdWFyZSh7IHgsIHkgfSlbZGlyZWN0aW9uXSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0Y29uc3Qgc2VhcmNoID0gKHBvcykgPT4ge1xuXHRcdFx0bGV0IGFkamFjZW5jaWVzLCBvcHRpb25zLCBoZWFkaW5nLCBuZXh0O1xuXG5cdFx0XHRpZiAocG9zLnggPT09IGVuZC54ICYmIHBvcy55ID09IGVuZC55KSB7XG5cdFx0XHRcdG9wZW5FZGdlKGVuZCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0YWRqYWNlbmNpZXMgPSB0aGlzLmdldEFkamFjZW50U3F1YXJlcyhwb3MpO1xuXG5cdFx0XHR3aGlsZSAoMSkge1xuXHRcdFx0XHRvcHRpb25zID0gT2JqZWN0LmtleXMoYWRqYWNlbmNpZXMpXG5cdFx0XHRcdFx0LmZpbHRlcihkaXIgPT4gYWRqYWNlbmNpZXNbZGlyXSlcblx0XHRcdFx0XHQuZmlsdGVyKGRpciA9PiBpc0lzb2xhdGVkKHRoaXMuZ2V0QWRqYWNlbnRTcXVhcmUocG9zLCBkaXIpKSk7XG5cdFx0XHRcdGlmICghb3B0aW9ucy5sZW5ndGgpIGJyZWFrO1xuXG5cdFx0XHRcdGhlYWRpbmcgPSByYW5kb21FbGVtZW50KG9wdGlvbnMpO1xuXHRcdFx0XHRuZXh0ID0gYWRqYWNlbmNpZXNbaGVhZGluZ107XG5cdFx0XHRcdGNvbm5lY3QocG9zLCBuZXh0KTtcblx0XHRcdFx0bGVuZ3RoKys7XG5cdFx0XHRcdHNlYXJjaChuZXh0KTtcblx0XHRcdFx0bGVuZ3RoLS07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Zm9yIChsZXQgeCA9IDA7IHggPCB3aWR0aDsgeCsrKSB7XG5cdFx0XHRtZXNoW3hdID0gW107XG5cdFx0XHRmb3IgKGxldCB5ID0gMDsgeSA8IGhlaWdodDsgeSsrKSB7XG5cdFx0XHRcdGlmICh4ID09PSAwIHx8XG5cdFx0XHRcdCAgICB5ID09PSAwIHx8XG5cdFx0XHRcdCAgICB4ID09PSAod2lkdGggLSAxKSB8fFxuXHRcdFx0XHQgICAgeSA9PT0gKGhlaWdodCAtIDEpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdGVkZ2VzLnB1c2goeyB4LCB5IH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bWVzaFt4XVt5XSA9IHtcblx0XHRcdFx0XHRub3J0aDogMCA8IHkgPyBmYWxzZSA6IG51bGwsXG5cdFx0XHRcdFx0c291dGg6IHkgPCAoaGVpZ2h0IC0gMSkgPyBmYWxzZSA6IG51bGwsXG5cdFx0XHRcdFx0d2VzdDogMCA8IHggPyBmYWxzZSA6IG51bGwsXG5cdFx0XHRcdFx0ZWFzdDogeCA8ICh3aWR0aCAtIDEpID8gZmFsc2UgOiBudWxsXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0c3RhcnQgPSByYW5kb21FbGVtZW50KGVkZ2VzKTtcblx0XHRkbyB7XG5cdFx0XHRlbmQgPSByYW5kb21FbGVtZW50KGVkZ2VzKTtcblx0XHR9IHdoaWxlIChzdGFydC54ID09PSBlbmQueCB8fCBzdGFydC55ID09PSBlbmQueSk7XG5cblx0XHRvcGVuRWRnZShzdGFydCk7XG5cdFx0c2VhcmNoKHN0YXJ0KTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRtZXNoLFxuXHRcdFx0c3RhcnQsXG5cdFx0XHRlbmRcblx0XHR9O1xuXHR9XG5cblx0YnJpZGdlRWRnZShzcXVhcmUsIGNvbG9yKSB7XG5cdFx0aWYgKHNxdWFyZS54ID09PSAwKSB7IC8vIFdlc3Rcblx0XHRcdHRoaXMuZ3JpZC5icmlkZ2Uoc3F1YXJlLnggLSAxLCBzcXVhcmUueSwgc3F1YXJlLngsIHNxdWFyZS55LCBjb2xvcik7XG5cdFx0fSBlbHNlIGlmIChzcXVhcmUueSA9PT0gMCkgeyAvLyBOb3J0aFxuXHRcdFx0dGhpcy5ncmlkLmJyaWRnZShzcXVhcmUueCwgc3F1YXJlLnkgLSAxLCBzcXVhcmUueCwgc3F1YXJlLnksIGNvbG9yKTtcblx0XHR9IGVsc2UgaWYgKHNxdWFyZS54ID09PSAodGhpcy53aWR0aCAtIDEpKSB7IC8vIEVhc3Rcblx0XHRcdHRoaXMuZ3JpZC5icmlkZ2Uoc3F1YXJlLngsIHNxdWFyZS55LCBzcXVhcmUueCArIDEsIHNxdWFyZS55LCBjb2xvcik7XG5cdFx0fSBlbHNlIGlmIChzcXVhcmUueSA9PT0gKHRoaXMuaGVpZ2h0IC0gMSkpIHsgLy8gU291dGhcblx0XHRcdHRoaXMuZ3JpZC5icmlkZ2Uoc3F1YXJlLngsIHNxdWFyZS55LCBzcXVhcmUueCwgc3F1YXJlLnkgKyAxLCBjb2xvcik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignU3F1YXJlIGlzIG5vdCBvbiBlZGdlLicpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRyZW5kZXIoJGNhbnZhcykge1xuXHRcdGNvbnN0IGdyaWQgPSB0aGlzLmdyaWQgPSBuZXcgR3JpZCgkY2FudmFzKTtcblx0XHRjb25zdCBtYXplID0gdGhpcy5tYXplO1xuXHRcdGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gdGhpcztcblxuXHRcdGdyaWQuY2xlYXIoKTtcblx0XHRncmlkLmdyaWRXaWR0aCA9IHdpZHRoO1xuXHRcdGdyaWQuZ3JpZEhlaWdodCA9IGhlaWdodDtcblxuXHRcdGZvciAobGV0IHggPSAwOyB4IDwgd2lkdGg7IHgrKykge1xuXHRcdFx0Zm9yIChsZXQgeSA9IDA7IHkgPCBoZWlnaHQ7IHkrKykge1xuXHRcdFx0XHRpZiAoIW1hemUubWVzaFt4XVt5XS53ZXN0KSB7XG5cdFx0XHRcdFx0Z3JpZC5saW5lKHgsIHksIHgsIHkgKyAxKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIW1hemUubWVzaFt4XVt5XS5ub3J0aCkge1xuXHRcdFx0XHRcdGdyaWQubGluZSh4LCB5LCB4ICsgMSwgeSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBPbmx5IG5lZWQgdG8gZHJhdyBzb3V0aCBhbmQgZWFzdCBvbiBlZGdlc1xuXHRcdFx0XHRpZiAoeCA9PT0gd2lkdGggLSAxICYmICFtYXplLm1lc2hbeF1beV0uZWFzdCkge1xuXHRcdFx0XHRcdGdyaWQubGluZSh4ICsgMSwgeSwgeCArIDEsIHkgKyAxKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoeSA9PT0gaGVpZ2h0IC0gMSAmJiAhbWF6ZS5tZXNoW3hdW3ldLnNvdXRoKSB7XG5cdFx0XHRcdFx0Z3JpZC5saW5lKHgsIHkgKyAxLCB4ICsgMSwgeSArIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Z3JpZC5maWxsKG1hemUuc3RhcnQueCwgbWF6ZS5zdGFydC55LCBHUkVFTik7XG5cdFx0Z3JpZC5maWxsKG1hemUuZW5kLngsIG1hemUuZW5kLnksIFJFRCk7XG5cdFx0dGhpcy5icmlkZ2VFZGdlKG1hemUuc3RhcnQsIEdSRUVOKTtcblx0XHR0aGlzLmJyaWRnZUVkZ2UobWF6ZS5lbmQsIFJFRCk7XG5cdH1cblxuXHQvKipcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0bW92ZShkaXIpIHtcblx0XHRjb25zdCBwYXRoID0gdGhpcy5wYXRoO1xuXHRcdGNvbnN0IHBvcyA9IGxhc3RFbGVtZW50KHBhdGgpO1xuXHRcdGNvbnN0IHByZXZpb3VzID0gcGF0aFtwYXRoLmxlbmd0aCAtIDJdO1xuXHRcdGxldCBuZXh0O1xuXG5cdFx0Ly8gRG9uJ3QgYnJlYWsgZG93biB3YWxsc1xuXHRcdGlmICghdGhpcy5tYXplLm1lc2hbcG9zLnhdW3Bvcy55XVtkaXJdKSByZXR1cm4gZmFsc2U7XG5cblx0XHRuZXh0ID0gdGhpcy5nZXRBZGphY2VudFNxdWFyZShwb3MsIGRpcik7XG5cdFx0aWYgKCFuZXh0KSByZXR1cm4gZmFsc2U7XG5cblx0XHRpZiAocHJldmlvdXMgJiYgbmV4dC54ID09PSBwcmV2aW91cy54ICYmIG5leHQueSA9PT0gcHJldmlvdXMueSkge1xuXHRcdFx0dGhpcy5ncmlkLmJyaWRnZShwb3MueCwgcG9zLnksIG5leHQueCwgbmV4dC55LCBSRUQpO1xuXHRcdFx0dGhpcy5ncmlkLmZpbGwocG9zLngsIHBvcy55LCBSRUQpO1xuXHRcdFx0dGhpcy5wYXRoLnBvcCgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmdyaWQuYnJpZGdlKHBvcy54LCBwb3MueSwgbmV4dC54LCBuZXh0LnksIEdSRUVOKTtcblx0XHRcdHRoaXMuZ3JpZC5maWxsKG5leHQueCwgbmV4dC55LCBHUkVFTik7XG5cdFx0XHR0aGlzLnBhdGgucHVzaChuZXh0KTtcblx0XHR9XG5cblx0XHRpZiAobmV4dC54ID09PSB0aGlzLm1hemUuZW5kLnggJiYgbmV4dC55ID09PSB0aGlzLm1hemUuZW5kLnkpIHtcblx0XHRcdHRoaXMuYnJpZGdlRWRnZShuZXh0LCBHUkVFTik7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRlbnRlclNxdWFyZShzcXVhcmUpIHtcblx0XHRjb25zdCBwb3MgPSBsYXN0RWxlbWVudCh0aGlzLnBhdGgpO1xuXHRcdGNvbnN0IGRpciA9IE1hemUucmVsYXRpdmVEaXJlY3Rpb24ocG9zLCBzcXVhcmUpO1xuXHRcdGlmIChkaXIpIHRoaXMubW92ZShkaXIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdGhvdmVyKHgsIHkpIHtcblx0XHR4ID0gR3JpZC50b1NxdWFyZXMoeCk7XG5cdFx0eSA9IEdyaWQudG9TcXVhcmVzKHkpO1xuXG5cdFx0aWYgKHggPj0gMCAmJiB5ID49IDAgJiYgKHggIT09IHRoaXMuX3ggfHwgeSAhPT0gdGhpcy5feSkpIHtcblx0XHRcdHRoaXMuX3ggPSB4O1xuXHRcdFx0dGhpcy5feSA9IHk7XG5cdFx0XHR0aGlzLmVudGVyU3F1YXJlKHsgeCwgeSB9KTtcblx0XHR9XG5cdH1cbn1cblxuXG5cblxuLy8gdmFyIEdyaWQyID0gcmVxdWlyZSgnLi9ncmlkJyk7XG4vLyAvL3ZhciByYW5kb20yID0gcmVxdWlyZSgnLi9yYW5kb20nKTtcblxuLy8gdmFyIE1hemUyID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQpIHtcblxuLy8gXHR2YXIgRElSRUNUSU9OUyA9IFsnbm9ydGgnLCAnc291dGgnLCAnZWFzdCcsICd3ZXN0J107XG4vLyBcdHZhciBHUkVFTiA9ICcjNGVjZGM0JywgUkVEID0gJyNmZjZiNmInO1xuXG4vLyBcdHZhciBwYXRoID0gW107XG4vLyBcdHZhciBtYXplLCBncmlkO1xuXG4vLyBcdC8qKlxuLy8gXHQgKiBHZXRzIHRoZSBjb29yZGluYXRlcyBvZiBhbiBhZGphY2VudCBzcXVhcmUuXG4vLyBcdCAqIEBwYXJhbSB7b2JqZWN0fSBzdGFydCBTdGFydGluZyBzcXVhcmUncyBjb29yZGluYXRlcy5cbi8vIFx0ICogQHBhcmFtIHtzdHJpbmd9IGRpcmVjdGlvbiBDYXJkaW5hbCBkaXJlY3Rpb24gb2YgYWRqYWNlbnQgc3F1YXJlLlxuLy8gXHQgKiBAcmV0dXJucyB7b2JqZWN0fSBBZGphY2VudCBzcXVhcmUncyBjb29yZGluYXRlcy5cbi8vIFx0ICovXG4vLyBcdGZ1bmN0aW9uIGFkamFjZW50U3F1YXJlKHN0YXJ0LCBkaXJlY3Rpb24pIHtcbi8vIFx0XHRzd2l0Y2ggKGRpcmVjdGlvbikge1xuLy8gXHRcdFx0Y2FzZSAnbm9ydGgnOlxuLy8gXHRcdFx0XHRyZXR1cm4gc3RhcnQueSA+IDBcbi8vIFx0XHRcdFx0XHQ/IHsgeDogc3RhcnQueCwgeTogc3RhcnQueSAtIDEgfVxuLy8gXHRcdFx0XHRcdDogbnVsbDtcbi8vIFx0XHRcdGNhc2UgJ3NvdXRoJzpcbi8vIFx0XHRcdFx0cmV0dXJuIHN0YXJ0LnkgPCBoZWlnaHQgLSAxXG4vLyBcdFx0XHRcdFx0PyB7IHg6IHN0YXJ0LngsIHk6IHN0YXJ0LnkgKyAxIH1cbi8vIFx0XHRcdFx0XHQ6IG51bGw7XG4vLyBcdFx0XHRjYXNlICdlYXN0Jzpcbi8vIFx0XHRcdFx0cmV0dXJuIHN0YXJ0LnggPCB3aWR0aCAtIDFcbi8vIFx0XHRcdFx0XHQ/IHsgeDogc3RhcnQueCArIDEsIHk6IHN0YXJ0LnkgfVxuLy8gXHRcdFx0XHRcdDogbnVsbDtcbi8vIFx0XHRcdGNhc2UgJ3dlc3QnOlxuLy8gXHRcdFx0XHRyZXR1cm4gc3RhcnQueCA+IDBcbi8vIFx0XHRcdFx0XHQ/IHsgeDogc3RhcnQueCAtIDEsIHk6IHN0YXJ0LnkgfVxuLy8gXHRcdFx0XHRcdDogbnVsbDtcbi8vIFx0XHRcdGRlZmF1bHQ6IHRocm93IG5ldyBFeGNlcHRpb24oJ0ludmFsaWQgZGlyZWN0aW9uICcgKyBkaXIpO1xuLy8gXHRcdH1cbi8vIFx0fVxuXG4vLyBcdC8qKlxuLy8gXHQgKiBHZXRzIHRoZSBjb29yZGluYXRlcyBvZiBhbGwgc3F1YXJlcyBhZGphY2VudCB0byBhIGdpdmVuIHNxdWFyZS5cbi8vIFx0ICogQHBhcmFtIHtvYmplY3R9IHN0YXJ0IENvb3JkaW5hdGVzIG9mIHRoZSBzdGFydGluZyBzcXVhcmUuXG4vLyBcdCAqIEByZXR1cm5zIHtvYmplY3R9IENvb3JkaW5hdGVzIG9mIGFkamFjZW50IHNxdWFyZXMgaW4gZWFjaCBkaXJlY3Rpb24uXG4vLyBcdCAqL1xuLy8gXHRmdW5jdGlvbiBhZGphY2VudFNxdWFyZXMoc3RhcnQpIHtcbi8vIFx0XHRyZXR1cm4gRElSRUNUSU9OUy5yZWR1Y2UoKG9iaiwgZGlyKSA9PiB7XG4vLyBcdFx0XHRvYmpbZGlyXSA9IGFkamFjZW50U3F1YXJlKHN0YXJ0LCBkaXIpO1xuLy8gXHRcdFx0cmV0dXJuIG9iajtcbi8vIFx0XHR9LCB7fSk7XG4vLyBcdH1cblxuLy8gXHQvKipcbi8vIFx0ICogR2V0cyB0aGUgcmVsYXRpdmUgZGlyZWN0aW9uIGJldHdlZW4gdHdvIGFkamFjZW50IHNxdWFyZXMuXG4vLyBcdCAqIEBwYXJhbSB7b2JqZWN0fSBzdGFydCBUaGUgc3RhcnRpbmcgc3F1YXJlLlxuLy8gXHQgKiBAcGFyYW0ge29iamVjdH0gZW5kIFRoZSBlbmRpbmcgc3F1YXJlLlxuLy8gXHQgKiBAcmV0dXJucyB7c3RyaWdufSBDYXJkaW5hbCBkaXJlY3Rpb24gZnJvbSBzdGFydCB0byBlbmQuXG4vLyBcdCAqL1xuLy8gXHRmdW5jdGlvbiByZWxhdGl2ZURpcmVjdGlvbihzdGFydCwgZW5kKSB7XG4vLyBcdFx0aWYgKE1hdGguYWJzKGVuZC54IC0gc3RhcnQueCkgKyBNYXRoLmFicyhlbmQueSAtIHN0YXJ0LnkpID4gMSkge1xuLy8gXHRcdFx0Ly8gU3F1YXJlcyBhcmUgbm90IGFkamFjZW50XG4vLyBcdFx0XHRyZXR1cm4gbnVsbDtcbi8vIFx0XHR9XG5cbi8vIFx0XHRpZiAoc3RhcnQueCA8IGVuZC54KSB7XG4vLyBcdFx0XHRyZXR1cm4gJ2Vhc3QnO1xuLy8gXHRcdH0gZWxzZSBpZiAoZW5kLnggPCBzdGFydC54KSB7XG4vLyBcdFx0XHRyZXR1cm4gJ3dlc3QnO1xuLy8gXHRcdH0gZWxzZSBpZiAoc3RhcnQueSA8IGVuZC55KSB7XG4vLyBcdFx0XHRyZXR1cm4gJ3NvdXRoJztcbi8vIFx0XHR9IGVsc2UgaWYgKGVuZC55IDwgc3RhcnQueSkge1xuLy8gXHRcdFx0cmV0dXJuICdub3J0aCc7XG4vLyBcdFx0fVxuLy8gXHR9XG5cbi8vIFx0ZnVuY3Rpb24gZ2VuZXJhdGUoKSB7XG4vLyBcdFx0dmFyIG1lc2ggPSBbXTtcbi8vIFx0XHR2YXIgZWRnZXMgPSBbXTtcbi8vIFx0XHR2YXIgbGVuZ3RoID0gMDtcbi8vIFx0XHR2YXIgeCwgeTtcbi8vIFx0XHR2YXIgc3RhcnQsIGVuZDtcblxuLy8gXHRcdGZ1bmN0aW9uIGdldFNxdWFyZShzcXVhcmUpIHtcbi8vIFx0XHRcdHJldHVybiBtZXNoW3NxdWFyZS54XVtzcXVhcmUueV07XG4vLyBcdFx0fVxuXG4vLyBcdFx0ZnVuY3Rpb24gaXNvbGF0ZWQoc3F1YXJlKSB7XG4vLyBcdFx0XHRzcXVhcmUgPSBnZXRTcXVhcmUoc3F1YXJlKTtcbi8vIFx0XHRcdHJldHVybiBESVJFQ1RJT05TLmV2ZXJ5KGRpciA9PiBzcXVhcmVbZGlyXSAhPT0gdHJ1ZSk7XG4vLyBcdFx0fVxuXG4vLyBcdFx0ZnVuY3Rpb24gY29ubmVjdChhLCBiKSB7XG4vLyBcdFx0XHQvL2NvbnNvbGUubG9nKFsnQ09OTkVDVElORyAoJyxhLngsJywnLGEueSwnKSBhbmQgKCcsYi54LCcsJyxiLnksJykuJ10uam9pbignJykpO1xuLy8gXHRcdFx0bWVzaFthLnhdW2EueV1bcmVsYXRpdmVEaXJlY3Rpb24oYSwgYildID0gdHJ1ZTtcbi8vIFx0XHRcdG1lc2hbYi54XVtiLnldW3JlbGF0aXZlRGlyZWN0aW9uKGIsIGEpXSA9IHRydWU7XG4vLyBcdFx0fVxuXG4vLyBcdFx0ZnVuY3Rpb24gb3BlbkVkZ2Uoc3F1YXJlKSB7XG4vLyBcdFx0XHR2YXIge3gsIHl9ID0gc3F1YXJlO1xuLy8gXHRcdFx0aWYgKHggPT09IDApIHtcbi8vIFx0XHRcdFx0bWVzaFt4XVt5XS53ZXN0ID0gdHJ1ZTtcbi8vIFx0XHRcdH0gZWxzZSBpZiAoeSA9PT0gMCkge1xuLy8gXHRcdFx0XHRtZXNoW3hdW3ldLm5vcnRoID0gdHJ1ZTtcbi8vIFx0XHRcdH0gZWxzZSBpZiAoeCA9PT0gKHdpZHRoIC0gMSkpIHtcbi8vIFx0XHRcdFx0bWVzaFt4XVt5XS5lYXN0ID0gdHJ1ZTtcbi8vIFx0XHRcdH0gZWxzZSBpZiAoeSA9PT0gKGhlaWdodCAtIDEpKSB7XG4vLyBcdFx0XHRcdG1lc2hbeF1beV0uc291dGggPSB0cnVlO1xuLy8gXHRcdFx0fSBlbHNlIHtcbi8vIFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdEZXN0aW5hdGlvbiBub3Qgb24gZWRnZS4nKTtcbi8vIFx0XHRcdH1cbi8vIFx0XHR9XG5cbi8vIFx0XHRmdW5jdGlvbiBzZWFyY2gocG9zKSB7XG4vLyBcdFx0XHR2YXIgYWRqYWNlbmNpZXMsIG9wdGlvbnMsIGhlYWRpbmcsIG5leHQ7XG5cbi8vIFx0XHRcdGlmIChwb3MueCA9PT0gZW5kLnggJiYgcG9zLnkgPT09IGVuZC55KSB7XG4vLyBcdFx0XHRcdG9wZW5FZGdlKHBvcyk7XG4vLyBcdFx0XHRcdGNvbnNvbGUubG9nKCdMRU5HVEgnLCBsZW5ndGgpO1xuLy8gXHRcdFx0XHRyZXR1cm47XG4vLyBcdFx0XHR9XG5cbi8vIFx0XHRcdGFkamFjZW5jaWVzID0gYWRqYWNlbnRTcXVhcmVzKHBvcyk7XG5cbi8vIFx0XHRcdHdoaWxlICgxKSB7XG4vLyBcdFx0XHRcdG9wdGlvbnMgPSBPYmplY3Qua2V5cyhhZGphY2VuY2llcylcbi8vIFx0XHRcdFx0XHQuZmlsdGVyKGRpciA9PiBhZGphY2VuY2llc1tkaXJdKVxuLy8gXHRcdFx0XHRcdC5maWx0ZXIoZGlyID0+IGlzb2xhdGVkKGFkamFjZW50U3F1YXJlKHBvcywgZGlyKSkpO1xuLy8gXHRcdFx0XHRpZiAoIW9wdGlvbnMubGVuZ3RoKSBicmVhaztcblxuLy8gXHRcdFx0XHRoZWFkaW5nID0gcmFuZG9tRWxlbWVudChvcHRpb25zKTtcbi8vIFx0XHRcdFx0bmV4dCA9IGFkamFjZW5jaWVzW2hlYWRpbmddO1xuLy8gXHRcdFx0XHRjb25uZWN0KHBvcywgbmV4dCk7XG4vLyBcdFx0XHRcdGxlbmd0aCsrO1xuLy8gXHRcdFx0XHRzZWFyY2gobmV4dCk7XG4vLyBcdFx0XHRcdGxlbmd0aC0tO1xuLy8gXHRcdFx0fVxuXG4vLyBcdFx0fVxuXG4vLyBcdFx0Zm9yICh4ID0gMDsgeCA8IHdpZHRoOyB4KyspIHtcbi8vIFx0XHRcdG1lc2hbeF0gPSBbXTtcbi8vIFx0XHRcdGZvciAoeSA9IDA7IHkgPCBoZWlnaHQ7IHkrKykge1xuLy8gXHRcdFx0XHRpZiAoeCA9PT0gMCB8fFxuLy8gXHRcdFx0XHRcdHkgPT09IDAgfHxcbi8vIFx0XHRcdFx0XHR4ID09PSAod2lkdGggLSAxKSB8fFxuLy8gXHRcdFx0XHRcdHkgPT09IChoZWlnaHQgLSAxKVxuLy8gXHRcdFx0XHQpIHtcbi8vIFx0XHRcdFx0XHRlZGdlcy5wdXNoKHt4LCB5fSk7XG4vLyBcdFx0XHRcdH1cblxuLy8gXHRcdFx0XHRtZXNoW3hdW3ldID0ge1xuLy8gXHRcdFx0XHRcdG5vcnRoOiAwIDwgeSA/IGZhbHNlIDogbnVsbCxcbi8vIFx0XHRcdFx0XHRzb3V0aDogeSA8IChoZWlnaHQgLSAxKSA/IGZhbHNlIDogbnVsbCxcbi8vIFx0XHRcdFx0XHR3ZXN0OiAwIDwgeCA/IGZhbHNlIDogbnVsbCxcbi8vIFx0XHRcdFx0XHRlYXN0OiB4IDwgKHdpZHRoIC0gMSkgPyBmYWxzZSA6IG51bGxcbi8vIFx0XHRcdFx0fTtcbi8vIFx0XHRcdH1cbi8vIFx0XHR9XG5cbi8vIFx0XHRzdGFydCA9IHJhbmRvbUVsZW1lbnQoZWRnZXMpO1xuLy8gXHRcdHBhdGgucHVzaChzdGFydCk7XG4vLyBcdFx0ZG8ge1xuLy8gXHRcdFx0ZW5kID0gcmFuZG9tRWxlbWVudChlZGdlcyk7XG4vLyBcdFx0fSB3aGlsZSAoc3RhcnQueCA9PT0gZW5kLnggfHwgc3RhcnQueSA9PT0gZW5kLnkpO1xuXG4vLyBcdFx0b3BlbkVkZ2Uoc3RhcnQpO1xuLy8gXHRcdHNlYXJjaChzdGFydCk7XG5cbi8vIFx0XHRyZXR1cm4ge1xuLy8gXHRcdFx0bWVzaCxcbi8vIFx0XHRcdHN0YXJ0LFxuLy8gXHRcdFx0ZW5kXG4vLyBcdFx0fTtcbi8vIFx0fVxuXG4vLyBcdGZ1bmN0aW9uIGJyaWRnZUVkZ2Uoc3F1YXJlLCBjb2xvcikge1xuLy8gXHRcdGlmIChzcXVhcmUueCA9PT0gMCkgeyAvLyBXZXN0XG4vLyBcdFx0XHRncmlkLmJyaWRnZShzcXVhcmUueCAtIDEsIHNxdWFyZS55LCBzcXVhcmUueCwgc3F1YXJlLnksIGNvbG9yKTtcbi8vIFx0XHR9IGVsc2UgaWYgKHNxdWFyZS55ID09PSAwKSB7IC8vIE5vcnRoXG4vLyBcdFx0XHRncmlkLmJyaWRnZShzcXVhcmUueCwgc3F1YXJlLnkgLSAxLCBzcXVhcmUueCwgc3F1YXJlLnksIGNvbG9yKTtcbi8vIFx0XHR9IGVsc2UgaWYgKHNxdWFyZS54ID09PSAod2lkdGggLSAxKSkgeyAvLyBFYXN0XG4vLyBcdFx0XHRncmlkLmJyaWRnZShzcXVhcmUueCwgc3F1YXJlLnksIHNxdWFyZS54ICsgMSwgc3F1YXJlLnksIGNvbG9yKTtcbi8vIFx0XHR9IGVsc2UgaWYgKHNxdWFyZS55ID09PSAoaGVpZ2h0IC0gMSkpIHsgLy8gU291dGhcbi8vIFx0XHRcdGdyaWQuYnJpZGdlKHNxdWFyZS54LCBzcXVhcmUueSwgc3F1YXJlLngsIHNxdWFyZS55ICsgMSwgY29sb3IpO1xuLy8gXHRcdH0gZWxzZSB7XG4vLyBcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1NxdWFyZSBpcyBub3Qgb24gZWRnZS4nKTtcbi8vIFx0XHR9XG4vLyBcdH1cblxuLy8gXHRmdW5jdGlvbiByZW5kZXIoJGVsKSB7XG4vLyBcdFx0dmFyIHgsIHk7XG5cbi8vIFx0XHRncmlkID0gbmV3IEdyaWQoJGVsKTtcbi8vIFx0XHRncmlkLmNsZWFyKCk7XG4vLyBcdFx0Z3JpZC5ncmlkV2lkdGggPSB3aWR0aDtcbi8vIFx0XHRncmlkLmdyaWRIZWlnaHQgPSBoZWlnaHQ7XG5cbi8vIFx0XHRmb3IgKHggPSAwOyB4IDwgd2lkdGg7IHgrKykge1xuLy8gXHRcdFx0Zm9yICh5ID0gMDsgeSA8IGhlaWdodDsgeSsrKSB7XG4vLyBcdFx0XHRcdGlmICghbWF6ZS5tZXNoW3hdW3ldLndlc3QpIHtcbi8vIFx0XHRcdFx0XHRncmlkLmxpbmUoeCwgeSwgeCwgeSArIDEpO1xuLy8gXHRcdFx0XHR9XG4vLyBcdFx0XHRcdGlmICghbWF6ZS5tZXNoW3hdW3ldLm5vcnRoKSB7XG4vLyBcdFx0XHRcdFx0Z3JpZC5saW5lKHgsIHksIHggKyAxLCB5KTtcbi8vIFx0XHRcdFx0fVxuXG4vLyBcdFx0XHRcdC8vIE9ubHkgbmVlZCB0byBkcmF3IHNvdXRoIGFuZCBlYXN0IG9uIGVkZ2VzXG4vLyBcdFx0XHRcdGlmICh4ID09PSB3aWR0aCAtIDEgJiYgIW1hemUubWVzaFt4XVt5XS5lYXN0KSB7XG4vLyBcdFx0XHRcdFx0Z3JpZC5saW5lKHggKyAxLCB5LCB4ICsgMSwgeSArIDEpO1xuLy8gXHRcdFx0XHR9XG4vLyBcdFx0XHRcdGlmICh5ID09PSBoZWlnaHQgLSAxICYmICFtYXplLm1lc2hbeF1beV0uc291dGgpIHtcbi8vIFx0XHRcdFx0XHRncmlkLmxpbmUoeCwgeSArIDEsIHggKyAxLCB5ICsgMSk7XG4vLyBcdFx0XHRcdH1cbi8vIFx0XHRcdH1cbi8vIFx0XHR9XG5cbi8vIFx0XHRncmlkLmZpbGwobWF6ZS5zdGFydC54LCBtYXplLnN0YXJ0LnksIEdSRUVOKTtcbi8vIFx0XHRncmlkLmZpbGwobWF6ZS5lbmQueCwgbWF6ZS5lbmQueSwgUkVEKTtcbi8vIFx0XHRicmlkZ2VFZGdlKG1hemUuc3RhcnQsIEdSRUVOKTtcbi8vIFx0XHRicmlkZ2VFZGdlKG1hemUuZW5kLCBSRUQpO1xuLy8gXHR9XG5cbi8vIFx0ZnVuY3Rpb24gbW92ZShkaXIpIHtcbi8vIFx0XHR2YXIgcG9zID0gbGFzdEVsZW1lbnQocGF0aCk7XG4vLyBcdFx0dmFyIHByZXZpb3VzID0gcGF0aFtwYXRoLmxlbmd0aCAtIDJdO1xuLy8gXHRcdHZhciBuZXh0O1xuXG4vLyBcdFx0Ly8gRG9uJ3QgYnJlYWsgZG93biB3YWxsc1xuLy8gXHRcdGlmICghbWF6ZS5tZXNoW3Bvcy54XVtwb3MueV1bZGlyXSkgcmV0dXJuIGZhbHNlO1xuXG4vLyBcdFx0bmV4dCA9IGFkamFjZW50U3F1YXJlKHBvcywgZGlyKTtcbi8vIFx0XHRpZiAoIW5leHQpIHJldHVybiBmYWxzZTtcblxuLy8gXHRcdGlmIChwcmV2aW91cyAmJiBuZXh0LnggPT09IHByZXZpb3VzLnggJiYgbmV4dC55ID09PSBwcmV2aW91cy55KSB7XG4vLyBcdFx0XHRncmlkLmJyaWRnZShwb3MueCwgcG9zLnksIG5leHQueCwgbmV4dC55LCBSRUQpO1xuLy8gXHRcdFx0Z3JpZC5maWxsKHBvcy54LCBwb3MueSwgUkVEKTtcbi8vIFx0XHRcdHBhdGgucG9wKCk7XG4vLyBcdFx0fSBlbHNlIHtcbi8vIFx0XHRcdGdyaWQuYnJpZGdlKHBvcy54LCBwb3MueSwgbmV4dC54LCBuZXh0LnksIEdSRUVOKTtcbi8vIFx0XHRcdGdyaWQuZmlsbChuZXh0LngsIG5leHQueSwgR1JFRU4pO1xuLy8gXHRcdFx0cGF0aC5wdXNoKG5leHQpO1xuLy8gXHRcdH1cblxuLy8gXHRcdGlmIChuZXh0LnggPT09IG1hemUuZW5kLnggJiYgbmV4dC55ID09PSBtYXplLmVuZC55KSB7XG4vLyBcdFx0XHRicmlkZ2VFZGdlKG5leHQsIEdSRUVOKTtcbi8vIFx0XHRcdHJldHVybiB0cnVlO1xuLy8gXHRcdH1cbi8vIFx0XHRyZXR1cm4gZmFsc2U7XG4vLyBcdH1cblxuLy8gXHRmdW5jdGlvbiBlbnRlclNxdWFyZShzcXVhcmUpIHtcbi8vIFx0XHR2YXIgcG9zID0gbGFzdEVsZW1lbnQocGF0aCk7XG4vLyBcdFx0dmFyIGRpciA9IHJlbGF0aXZlRGlyZWN0aW9uKHBvcywgc3F1YXJlKTtcbi8vIFx0XHRpZiAoZGlyKSBtb3ZlKGRpcik7XG4vLyBcdH1cblxuLy8gXHR2YXIgaG92ZXIgPSAoZnVuY3Rpb24gKCkge1xuLy8gXHRcdHZhciBfeCwgX3k7XG5cbi8vIFx0XHRyZXR1cm4gZnVuY3Rpb24gKHgsIHkpIHtcbi8vIFx0XHRcdHggPSBHcmlkLnRvU3F1YXJlcyh4KTtcbi8vIFx0XHRcdHkgPSBHcmlkLnRvU3F1YXJlcyh5KTtcbi8vIFx0XHRcdGlmICh4ID49IDAgJiYgeSA+PSAwICYmICh4ICE9PSBfeCB8fCB5ICE9PSBfeSkpIHtcbi8vIFx0XHRcdFx0X3ggPSB4O1xuLy8gXHRcdFx0XHRfeSA9IHk7XG4vLyBcdFx0XHRcdGVudGVyU3F1YXJlKHt4LCB5fSk7XG4vLyBcdFx0XHR9XG4vLyBcdFx0fTtcblxuLy8gXHR9KSgpO1xuXG4vLyBcdG1hemUgPSBnZW5lcmF0ZSgpO1xuXG4vLyBcdHJldHVybiB7XG4vLyBcdFx0cmVuZGVyLFxuLy8gXHRcdG1vdmUsXG4vLyBcdFx0aG92ZXJcbi8vIFx0fTtcblxuLy8gfVxuXG4vLyBtb2R1bGUuZXhwb3J0cyA9IE1hemU7XG4iLCJleHBvcnQgZnVuY3Rpb24gbW9kKGEsIGIpIHtcblx0cmV0dXJuICgoYSAlIGIpICsgYikgJSBiO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tKCkge1xuXHRsZXQgeCA9IE1hdGguc2luKHJhbmRvbS5zZWVkKyspICogMTAwMDA7XG5cdHJldHVybiB4IC0gTWF0aC5mbG9vcih4KTtcbn1cblxucmFuZG9tLnNlZWQgPSBNYXRoLnJhbmRvbSgpO1xuXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tSW50KG1heCkge1xuXHRyZXR1cm4gTWF0aC5mbG9vcihyYW5kb20oKSAqIG1heCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByYW5kb21FbGVtZW50KGFycikge1xuXHRyZXR1cm4gYXJyW3JhbmRvbUludChhcnIubGVuZ3RoKV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXN0RWxlbWVudChhcnIpIHtcblx0cmV0dXJuIGFyclthcnIubGVuZ3RoIC0gMV07XG59XG4iXX0=