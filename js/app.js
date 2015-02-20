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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2NvbG9ycy5qcyIsInNyYy9ncmlkLmpzIiwic3JjL21hemUuanMiLCJzcmMvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7SUNBTyxJQUFJLDJCQUFNLFFBQVE7O0lBQ2hCLE1BQU0sV0FBUSxRQUFRLEVBQXRCLE1BQU07SUFFVCxHQUFHO0FBT0csVUFQTixHQUFHO3dCQUFILEdBQUc7O0FBUVAsTUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9DLE1BQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqRCxNQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdkQsTUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUVqRCxVQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzFGLFVBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDckUsTUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7O3FCQUd4QyxnQ0FBZ0MsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7Ozs7TUFBbEYsS0FBSztNQUFFLE1BQU07TUFBRSxJQUFJOzs7QUFFNUIsTUFBSSxLQUFLLElBQUksTUFBTSxFQUFFO0FBQ3BCLE9BQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLE9BQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0dBQ3JCOztBQUVELE1BQUksSUFBSSxFQUFFO0FBQ1QsU0FBTSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDL0I7O0FBRUQsTUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0VBQ2hCOztzQkE5QkksR0FBRztBQUVKLE9BQUs7UUFEQSxZQUFHO0FBQUUsV0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQUU7UUFDakMsVUFBQyxLQUFLLEVBQUU7QUFBRSxRQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFBRTs7O0FBRzNDLFFBQU07UUFEQSxZQUFHO0FBQUUsV0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQUU7UUFDbEMsVUFBQyxLQUFLLEVBQUU7QUFBRSxRQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFBRTs7O0FBMkJqRCxVQUFRO1VBQUEsb0JBQUc7QUFDVixRQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7O0FBRXBCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUMsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9COzs7O0FBRUQsY0FBWTtVQUFBLHdCQUFHO0FBQ2QsUUFBTSxJQUFJLFNBQU8sSUFBSSxDQUFDLEtBQUssU0FBSSxJQUFJLENBQUMsTUFBTSxTQUFJLE1BQU0sQ0FBQyxJQUFJLEFBQUUsQ0FBQztBQUM1RCxRQUFNLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3ZELFVBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUM1QixRQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDM0M7Ozs7QUFFRCxZQUFVO1VBQUEsb0JBQUMsS0FBSyxFQUFFO0FBQ2pCLFNBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUN2QixRQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDaEI7Ozs7QUFFRCxXQUFTO1VBQUEsbUJBQUMsS0FBSyxFQUFFO0FBQ2hCLFFBQU0sU0FBUyxHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsQ0FBQztBQUN6RSxRQUFJLENBQUMsU0FBUztBQUFFLFlBQU87S0FBQSxBQUV2QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDdkIsUUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDMUI7Ozs7QUFFRCxhQUFXO1VBQUEscUJBQUMsS0FBSyxFQUFFO0FBQ2xCLFFBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUN4RCxRQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakY7Ozs7OztRQTlESSxHQUFHOzs7QUFpRVQsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7Ozs7QUNwRUgsSUFBTSxTQUFTLFdBQVQsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUM1QixJQUFNLEtBQUssV0FBTCxLQUFLLEdBQUcsU0FBUyxDQUFDO0FBQ3hCLElBQU0sR0FBRyxXQUFILEdBQUcsR0FBRyxTQUFTLENBQUM7Ozs7Ozs7Ozs7OztJQ0ZwQixHQUFHLFdBQVEsUUFBUSxFQUFuQixHQUFHO0lBQ0gsU0FBUyxXQUFRLFVBQVUsRUFBM0IsU0FBUzs7O0FBRWxCLElBQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNoQixJQUFNLE1BQU0sR0FBRyxDQUFDLENBQUM7O0lBRUksSUFBSTs7Ozs7QUFnRWIsVUFoRVMsSUFBSSxDQWdFWixPQUFPO3dCQWhFQyxJQUFJOztBQWlFdkIsTUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ3BDOztzQkFsRW1CLElBQUk7QUF3Q2pCLFVBQVE7Ozs7Ozs7O1VBQUEsa0JBQUMsT0FBTyxFQUFFO0FBQ3hCLFdBQU8sQUFBQyxNQUFNLEdBQUcsQ0FBQyxHQUFJLE9BQU8sSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQztJQUNoRDs7OztBQVNNLFdBQVM7Ozs7Ozs7OztVQUFBLG1CQUFDLE1BQU0sRUFBRTtBQUN4QixRQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxFQUFFLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSyxJQUFJLEdBQUcsTUFBTSxBQUFDLEVBQUU7O0FBRTNELFlBQU8sQ0FBQyxDQUFDLENBQUM7S0FDVjs7QUFFRCxXQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBLElBQUssSUFBSSxHQUFHLE1BQU0sQ0FBQSxBQUFDLENBQUMsQ0FBQztJQUN2RDs7Ozs7QUFwREcsYUFBVztRQUpBLFlBQUc7QUFDakIsV0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDOUI7UUFFYyxVQUFDLE1BQU0sRUFBRTtBQUN2QixRQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ2hDOzs7QUFNRyxZQUFVO1FBSkEsWUFBRztBQUNoQixXQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUM3QjtRQUVhLFVBQUMsTUFBTSxFQUFFO0FBQ3RCLFFBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7SUFDL0I7OztBQU1HLFlBQVU7UUFKQSxZQUFHO0FBQ2hCLFdBQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQSxJQUFLLElBQUksR0FBRyxNQUFNLENBQUEsQUFBQyxDQUFDO0lBQ3JEO1FBRWEsVUFBQyxPQUFPLEVBQUU7QUFDdkIsUUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQSxHQUFJLE1BQU0sQ0FBQztJQUMzRDs7O0FBTUcsV0FBUztRQUpBLFlBQUc7QUFDZixXQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUEsSUFBSyxJQUFJLEdBQUcsTUFBTSxDQUFBLEFBQUMsQ0FBQztJQUNwRDtRQUVZLFVBQUMsT0FBTyxFQUFFO0FBQ3RCLFFBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUEsR0FBSSxNQUFNLENBQUM7SUFDMUQ7OztBQXlDRCxPQUFLOzs7Ozs7O1VBQUEsaUJBQUc7QUFDUCxRQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzVEOzs7O0FBVUQsTUFBSTs7Ozs7Ozs7OztVQUFBLGNBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUU7QUFDakIsUUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNyQixRQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDO0FBQ2pDLE9BQUcsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDOztBQUV0QixPQUFHLENBQUMsUUFBUSxDQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUksTUFBTSxHQUFHLENBQUMsQUFBQyxFQUMvQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFJLE1BQU0sR0FBRyxDQUFDLEFBQUMsRUFDL0IsSUFBSSxFQUNKLElBQUksQ0FDSixDQUFDOztBQUVGLE9BQUcsQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDO0lBQzNCOzs7O0FBWUQsUUFBTTs7Ozs7Ozs7Ozs7O1VBQUEsZ0JBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRTtBQUM3QixRQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNoRCxXQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7S0FDN0M7O0FBRUQsUUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDM0IsUUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRTNCLFFBQU0sR0FBRyxHQUFZLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDOUIsUUFBTSxRQUFRLEdBQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQztBQUNqQyxRQUFNLFVBQVUsR0FBSyxHQUFHLENBQUMsU0FBUyxDQUFDO0FBQ25DLFFBQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7QUFDckMsT0FBRyxDQUFDLE9BQU8sR0FBVSxRQUFRLENBQUM7QUFDOUIsT0FBRyxDQUFDLFNBQVMsR0FBUSxNQUFNLENBQUM7QUFDNUIsT0FBRyxDQUFDLFdBQVcsR0FBTSxLQUFLLENBQUM7O0FBRTNCLE9BQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNoQixRQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7OztBQUdkLFFBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pELFFBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM3RCxNQUFNOzs7QUFHTixRQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQztBQUN6RCxRQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUM7S0FDN0Q7QUFDRCxPQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7O0FBRWIsT0FBRyxDQUFDLE9BQU8sR0FBTyxRQUFRLENBQUM7QUFDM0IsT0FBRyxDQUFDLFNBQVMsR0FBSyxVQUFVLENBQUM7QUFDN0IsT0FBRyxDQUFDLFdBQVcsR0FBRyxZQUFZLENBQUM7SUFDL0I7Ozs7QUFZRCxNQUFJOzs7Ozs7Ozs7Ozs7VUFBQSxjQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBcUI7UUFBbkIsS0FBSyxnQ0FBRyxTQUFTO0FBQ3JDLFFBQU0sR0FBRyxHQUFZLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDOUIsUUFBTSxRQUFRLEdBQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQztBQUNqQyxRQUFNLFVBQVUsR0FBSyxHQUFHLENBQUMsU0FBUyxDQUFDO0FBQ25DLFFBQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7QUFDckMsT0FBRyxDQUFDLE9BQU8sR0FBVSxRQUFRLENBQUM7QUFDOUIsT0FBRyxDQUFDLFNBQVMsR0FBUSxNQUFNLENBQUM7QUFDNUIsT0FBRyxDQUFDLFdBQVcsR0FBTSxLQUFLLENBQUM7O0FBRTNCLE9BQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNoQixPQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pELE9BQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakQsT0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDOztBQUViLE9BQUcsQ0FBQyxPQUFPLEdBQU8sUUFBUSxDQUFDO0FBQzNCLE9BQUcsQ0FBQyxTQUFTLEdBQUssVUFBVSxDQUFDO0FBQzdCLE9BQUcsQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDO0lBQy9COzs7Ozs7UUE1S21CLElBQUk7OztpQkFBSixJQUFJOzs7Ozs7Ozs7OztJQ05sQixJQUFJLDJCQUFNLFFBQVE7O29CQUMwQixRQUFROztJQUFsRCxXQUFXLFNBQVgsV0FBVztJQUFFLE1BQU0sU0FBTixNQUFNO0lBQUUsYUFBYSxTQUFiLGFBQWE7c0JBQ2hCLFVBQVU7O0lBQTVCLEtBQUssV0FBTCxLQUFLO0lBQUUsR0FBRyxXQUFILEdBQUc7OztBQUVuQixJQUFNLFVBQVUsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDOztJQUVqQyxJQUFJO0FBeUJiLFVBekJTLElBQUksQ0F5QlosS0FBSyxFQUFFLE1BQU07d0JBekJMLElBQUk7O0FBMEJ2QixNQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixNQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixNQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUM1QixNQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUM5Qjs7c0JBOUJtQixJQUFJO0FBUWpCLG1CQUFpQjs7Ozs7Ozs7VUFBQSwyQkFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO0FBQ3BDLFFBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTs7QUFFOUQsWUFBTyxJQUFJLENBQUM7S0FDWjs7QUFFRCxRQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUNwQixZQUFPLE1BQU0sQ0FBQztLQUNkLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDM0IsWUFBTyxNQUFNLENBQUM7S0FDZCxNQUFNLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQzNCLFlBQU8sT0FBTyxDQUFDO0tBQ2YsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUMzQixZQUFPLE9BQU8sQ0FBQztLQUNmO0lBQ0Q7Ozs7O0FBZUQsbUJBQWlCOzs7Ozs7OztVQUFBLDJCQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7QUFDbkMsWUFBUSxTQUFTO0FBQ2hCLFVBQUssT0FBTztBQUNYLGFBQU8sS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQ2YsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FDOUIsSUFBSSxDQUFDO0FBQUEsQUFDVCxVQUFLLE9BQU87QUFDWCxhQUFPLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQzdCLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQzlCLElBQUksQ0FBQztBQUFBLEFBQ1QsVUFBSyxNQUFNO0FBQ1YsYUFBTyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUM1QixFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxHQUM5QixJQUFJLENBQUM7QUFBQSxBQUNULFVBQUssTUFBTTtBQUNWLGFBQU8sS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQ2YsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsR0FDOUIsSUFBSSxDQUFDO0FBQUEsQUFDVDtBQUNDLFlBQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFBQSxLQUM3QztJQUNEOzs7O0FBT0Qsb0JBQWtCOzs7Ozs7O1VBQUEsNEJBQUMsS0FBSyxFQUFFOztBQUN6QixXQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFLO0FBQ3RDLFFBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFLLGlCQUFpQixDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztBQUM5QyxZQUFPLEdBQUcsQ0FBQztLQUNYLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDUDs7OztBQUVELFVBQVE7VUFBQSxvQkFBRzs7ZUFDZ0IsSUFBSTtRQUF0QixLQUFLLFFBQUwsS0FBSztRQUFFLE1BQU0sUUFBTixNQUFNO0FBQ3JCLFFBQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNoQixRQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDakIsUUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsUUFBSSxLQUFLLFlBQUE7UUFBRSxHQUFHLFlBQUEsQ0FBQzs7QUFFZixhQUFTLFNBQVMsUUFBVztTQUFSLENBQUMsU0FBRCxDQUFDO1NBQUUsQ0FBQyxTQUFELENBQUM7QUFDeEIsWUFBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEI7O0FBRUQsYUFBUyxVQUFVLENBQUMsTUFBTSxFQUFFO0FBQzNCLFdBQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsWUFBTyxVQUFVLENBQUMsS0FBSyxDQUFDLFVBQUEsR0FBRzthQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJO01BQUEsQ0FBQyxDQUFDO0tBQ3JEOztBQUVELGFBQVMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDdEIsY0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDbEQsY0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7S0FDbEQ7O0FBRUQsYUFBUyxRQUFRLENBQUMsTUFBTSxFQUFFO1NBQ2pCLENBQUMsR0FBUSxNQUFNLENBQWYsQ0FBQztTQUFFLENBQUMsR0FBSyxNQUFNLENBQVosQ0FBQztBQUNaLFNBQUksU0FBUyxZQUFBLENBQUM7O0FBRWQsU0FBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ1osZUFBUyxHQUFHLE1BQU0sQ0FBQztNQUNuQixNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNuQixlQUFTLEdBQUcsT0FBTyxDQUFDO01BQ3BCLE1BQU0sSUFBSSxDQUFDLEtBQU0sS0FBSyxHQUFHLENBQUMsQUFBQyxFQUFFO0FBQzdCLGVBQVMsR0FBRyxNQUFNLENBQUM7TUFDbkIsTUFBTSxJQUFJLENBQUMsS0FBTSxNQUFNLEdBQUcsQ0FBQyxBQUFDLEVBQUU7QUFDOUIsZUFBUyxHQUFHLE9BQU8sQ0FBQztNQUNwQixNQUFNO0FBQ04sWUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO01BQzVDOztBQUVELGNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRCxDQUFDLEVBQUUsQ0FBQyxFQUFELENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDO0tBQ3RDOztBQUVELFFBQU0sTUFBTSxHQUFHLFVBQUMsR0FBRyxFQUFLO0FBQ3ZCLFNBQUksV0FBVyxZQUFBO1NBQUUsT0FBTyxZQUFBO1NBQUUsT0FBTyxZQUFBO1NBQUUsSUFBSSxZQUFBLENBQUM7O0FBRXhDLFNBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRTtBQUN0QyxjQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDZCxhQUFPO01BQ1A7O0FBRUQsZ0JBQVcsR0FBRyxNQUFLLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUUzQyxZQUFPLENBQUMsRUFBRTtBQUNULGFBQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUNoQyxNQUFNLENBQUMsVUFBQSxHQUFHO2NBQUksV0FBVyxDQUFDLEdBQUcsQ0FBQztPQUFBLENBQUMsQ0FDL0IsTUFBTSxDQUFDLFVBQUEsR0FBRztjQUFJLFVBQVUsQ0FBQyxNQUFLLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztPQUFBLENBQUMsQ0FBQztBQUM5RCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNOztBQUUzQixhQUFPLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLFVBQUksR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDNUIsYUFBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuQixZQUFNLEVBQUUsQ0FBQztBQUNULFlBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNiLFlBQU0sRUFBRSxDQUFDO01BQ1Q7S0FDRCxDQUFBOztBQUVELFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDL0IsU0FBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNiLFVBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDaEMsVUFBSSxDQUFDLEtBQUssQ0FBQyxJQUNQLENBQUMsS0FBSyxDQUFDLElBQ1AsQ0FBQyxLQUFNLEtBQUssR0FBRyxDQUFDLEFBQUMsSUFDakIsQ0FBQyxLQUFNLE1BQU0sR0FBRyxDQUFDLEFBQUMsRUFDcEI7QUFDRCxZQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFELENBQUMsRUFBRSxDQUFDLEVBQUQsQ0FBQyxFQUFFLENBQUMsQ0FBQztPQUNyQjs7QUFFRCxVQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUc7QUFDWixZQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSTtBQUMzQixZQUFLLEVBQUUsQ0FBQyxHQUFJLE1BQU0sR0FBRyxDQUFDLEFBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSTtBQUN0QyxXQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSTtBQUMxQixXQUFJLEVBQUUsQ0FBQyxHQUFJLEtBQUssR0FBRyxDQUFDLEFBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSTtPQUNwQyxDQUFDO01BQ0Y7S0FDRDs7QUFFRCxTQUFLLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdCLE9BQUc7QUFDRixRQUFHLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzNCLFFBQVEsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRTs7QUFFakQsWUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hCLFVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFZCxXQUFPO0FBQ04sU0FBSSxFQUFKLElBQUk7QUFDSixVQUFLLEVBQUwsS0FBSztBQUNMLFFBQUcsRUFBSCxHQUFHO0tBQ0gsQ0FBQztJQUNGOzs7O0FBRUQsWUFBVTtVQUFBLG9CQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDekIsUUFBSSxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTs7QUFDbkIsU0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDcEUsTUFBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFOztBQUMxQixTQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNwRSxNQUFNLElBQUksTUFBTSxDQUFDLENBQUMsS0FBTSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQUFBQyxFQUFFOztBQUN6QyxTQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNwRSxNQUFNLElBQUksTUFBTSxDQUFDLENBQUMsS0FBTSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQUFBQyxFQUFFOztBQUMxQyxTQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNwRSxNQUFNO0FBQ04sV0FBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0tBQzFDO0lBQ0Q7Ozs7QUFLRCxRQUFNOzs7OztVQUFBLGdCQUFDLE9BQU8sRUFBRTtBQUNmLFFBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDM0MsUUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztlQUNHLElBQUk7UUFBdEIsS0FBSyxRQUFMLEtBQUs7UUFBRSxNQUFNLFFBQU4sTUFBTTs7O0FBRXJCLFFBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNiLFFBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDOztBQUV6QixTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQy9CLFVBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDaEMsVUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO0FBQzFCLFdBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO09BQzFCO0FBQ0QsVUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFO0FBQzNCLFdBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO09BQzFCOzs7QUFHRCxVQUFJLENBQUMsS0FBSyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7QUFDN0MsV0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztPQUNsQztBQUNELFVBQUksQ0FBQyxLQUFLLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRTtBQUMvQyxXQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO09BQ2xDO01BQ0Q7S0FDRDs7QUFFRCxRQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzdDLFFBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdkMsUUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ25DLFFBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJ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TyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztDQUMzQiIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VSb290IjoiL2pzeCIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IE1hemUgZnJvbSAnLi9tYXplJztcbmltcG9ydCB7IHJhbmRvbSB9IGZyb20gJy4vdXRpbCc7XG5cbmNsYXNzIEFwcCB7XG5cdGdldCB3aWR0aCgpIHsgcmV0dXJuICt0aGlzLiR3aWR0aC52YWx1ZTsgfVxuXHRzZXQgd2lkdGgodmFsdWUpIHsgdGhpcy4kd2lkdGgudmFsdWUgPSB2YWx1ZTsgfVxuXG5cdGdldCBoZWlnaHQoKSB7IHJldHVybiArdGhpcy4kaGVpZ2h0LnZhbHVlOyB9XG5cdHNldCBoZWlnaHQodmFsdWUpIHsgdGhpcy4kaGVpZ2h0LnZhbHVlID0gdmFsdWU7IH1cblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLiR3aWR0aCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3aWR0aCcpO1xuXHRcdHRoaXMuJGhlaWdodCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNoZWlnaHQnKTtcblx0XHR0aGlzLiRwZXJtYWxpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGVybWFsaW5rJyk7XG5cdFx0dGhpcy4kY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NhbnZhcycpO1xuXG5cdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dlbmVyYXRlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uR2VuZXJhdGUuYmluZCh0aGlzKSk7XG5cdFx0ZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5vbktleURvd24uYmluZCh0aGlzKSk7XG5cdFx0dGhpcy4kY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3VzZU1vdmUuYmluZCh0aGlzKSk7XG5cblx0XHQvLyBBdHRlbXB0IHRvIHJlYWQgbWF6ZSBwYXJhbWV0ZXJzIGZyb20gVVJMIGhhc2hcblx0XHRjb25zdCBbLCB3aWR0aCwgaGVpZ2h0LCBzZWVkXSA9IC8jKFxcZCspeChcXGQrKSg/OnMoXFxkKy5cXGQrKSk/fC4qLy5leGVjKHdpbmRvdy5sb2NhdGlvbi5oYXNoKTtcblxuXHRcdGlmICh3aWR0aCAmJiBoZWlnaHQpIHtcblx0XHRcdHRoaXMud2lkdGggPSB3aWR0aDtcblx0XHRcdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdH1cblxuXHRcdGlmIChzZWVkKSB7XG5cdFx0XHRyYW5kb20uc2VlZCA9IHBhcnNlRmxvYXQoc2VlZCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5nZW5lcmF0ZSgpO1xuXHR9XG5cblx0Z2VuZXJhdGUoKSB7XG5cdFx0dGhpcy5zZXRQZXJtYWxpbmsoKTtcblxuXHRcdHRoaXMubWF6ZSA9IG5ldyBNYXplKHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblx0XHR0aGlzLm1hemUucmVuZGVyKHRoaXMuJGNhbnZhcyk7XG5cdH1cblxuXHRzZXRQZXJtYWxpbmsoKSB7XG5cdFx0Y29uc3QgaGFzaCA9IGAjJHt0aGlzLndpZHRofXgke3RoaXMuaGVpZ2h0fXMke3JhbmRvbS5zZWVkfWA7XG5cdFx0Y29uc3QgaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KCcjJylbMF0gKyBoYXNoO1xuXHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gaGFzaDtcblx0XHR0aGlzLiRwZXJtYWxpbmsuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG5cdH1cblxuXHRvbkdlbmVyYXRlKGV2ZW50KSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR0aGlzLmdlbmVyYXRlKCk7XG5cdH1cblxuXHRvbktleURvd24oZXZlbnQpIHtcblx0XHRjb25zdCBkaXJlY3Rpb24gPSBbJ3dlc3QnLCAnbm9ydGgnLCAnZWFzdCcsICdzb3V0aCddW2V2ZW50LmtleUNvZGUgLSAzN107XG5cdFx0aWYgKCFkaXJlY3Rpb24pIHJldHVybjtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dGhpcy5tYXplLm1vdmUoZGlyZWN0aW9uKTtcblx0fVxuXG5cdG9uTW91c2VNb3ZlKGV2ZW50KSB7XG5cdFx0Y29uc3QgY2xpZW50UmVjdCA9IHRoaXMuJGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHR0aGlzLm1hemUuaG92ZXIoZXZlbnQuY2xpZW50WCAtIGNsaWVudFJlY3QubGVmdCwgZXZlbnQuY2xpZW50WSAtIGNsaWVudFJlY3QudG9wKTtcblx0fVxufVxuXG5uZXcgQXBwKCk7XG4iLCJleHBvcnQgY29uc3QgREFSS19HUkFZID0gJyMxNjE5MWQnO1xyXG5leHBvcnQgY29uc3QgR1JFRU4gPSAnIzRlY2RjNCc7XHJcbmV4cG9ydCBjb25zdCBSRUQgPSAnI2ZmN2I3Yic7XHJcbiIsImltcG9ydCB7IG1vZCB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyBEQVJLX0dSQVkgfSBmcm9tICcuL2NvbG9ycyc7XG5cbmNvbnN0IFNJWkUgPSAyMDsgLy8gV2lkdGggb2YgYSBzcXVhcmUgaW4gcGl4ZWxzXG5jb25zdCBXRUlHSFQgPSAyOyAvLyBXaWR0aCBvZiB0aGUgbGluZSBiZXR3ZWVuIHNxdWFyZXMgaW4gcGl4ZWxzXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyaWQge1xuXG5cdGdldCBwaXhlbEhlaWdodCgpIHtcblx0XHRyZXR1cm4gdGhpcy5jdHguY2FudmFzLmhlaWdodDtcblx0fVxuXG5cdHNldCBwaXhlbEhlaWdodChwaXhlbHMpIHtcblx0XHR0aGlzLmN0eC5jYW52YXMuaGVpZ2h0ID0gcGl4ZWxzO1xuXHR9XG5cblx0Z2V0IHBpeGVsV2lkdGgoKSB7XG5cdFx0cmV0dXJuIHRoaXMuY3R4LmNhbnZhcy53aWR0aDtcblx0fVxuXG5cdHNldCBwaXhlbFdpZHRoKHBpeGVscykge1xuXHRcdHRoaXMuY3R4LmNhbnZhcy53aWR0aCA9IHBpeGVscztcblx0fVxuXG5cdGdldCBncmlkSGVpZ2h0KCkge1xuXHRcdHJldHVybiAodGhpcy5waXhlbEhlaWdodCAtIFdFSUdIVCkgLyAoU0laRSArIFdFSUdIVCk7XG5cdH1cblxuXHRzZXQgZ3JpZEhlaWdodChzcXVhcmVzKSB7XG5cdFx0dGhpcy5waXhlbEhlaWdodCA9IHNxdWFyZXMgKiBTSVpFICsgKHNxdWFyZXMgKyAxKSAqIFdFSUdIVDtcblx0fVxuXG5cdGdldCBncmlkV2lkdGgoKSB7XG5cdFx0cmV0dXJuICh0aGlzLnBpeGVsV2lkdGggLSBXRUlHSFQpIC8gKFNJWkUgKyBXRUlHSFQpO1xuXHR9XG5cblx0c2V0IGdyaWRXaWR0aChzcXVhcmVzKSB7XG5cdFx0dGhpcy5waXhlbFdpZHRoID0gc3F1YXJlcyAqIFNJWkUgKyAoc3F1YXJlcyArIDEpICogV0VJR0hUO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGZyb20gc3F1YXJlIHVuaXRzIHRvIHBpeGVsIHVuaXRzLlxuXHQgKiBAcGFyYW0ge2ludH0gc3F1YXJlcyBaZXJvLWJhc2VkIHNxdWFyZSBjb29yZGluYXRlLlxuXHQgKiBAcmV0dXJucyB7aW50fSBUaGUgY29vcmRpbmF0ZSBvZiB0aGUgcGl4ZWwgY2xvc2VzdCB0byB0aGUgb3JpZ2luIGluIHRoZSBzcXVhcmUuXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdHN0YXRpYyB0b1BpeGVscyhzcXVhcmVzKSB7XG5cdFx0cmV0dXJuIChXRUlHSFQgLyAyKSArIHNxdWFyZXMgKiAoV0VJR0hUICsgU0laRSk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgZnJvbSBwaXhlbCB1bml0cyB0byBzcXVhcmUgdW5pdHMuXG5cdCAqIEBwYXJhbSB7aW50fSBwaXhlbHMgWmVyby1iYXNlZCBjb29yZGluYXRlIG9mIGEgcGl4ZWwuXG5cdCAqIEByZXR1cm5zIHtpbnR9IFRoZSB6ZXJvLWJhc2VkIGNvb3JkaW5hdGUgb2YgdGhlIHNxdWFyZSBjb250YWluaW5nIHRoZSBwaXhlbCwgb3IgLTEgaWYgdGhlXG5cdCAqICAgICAgICAgICAgICAgIHBpeGVsIGlzIG9uIGEgYm91bmRhcnkgYmV0d2VlbiBzcXVhcmVzLlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRzdGF0aWMgdG9TcXVhcmVzKHBpeGVscykge1xuXHRcdGlmIChtb2QocGl4ZWxzIC0gV0VJR0hULCBTSVpFICsgV0VJR0hUKSA+PSAoU0laRSAtIFdFSUdIVCkpIHtcblx0XHRcdC8vIE9uIGEgbGluZVxuXHRcdFx0cmV0dXJuIC0xO1xuXHRcdH1cblxuXHRcdHJldHVybiBNYXRoLmZsb29yKChwaXhlbHMgLSBXRUlHSFQpIC8gKFNJWkUgKyBXRUlHSFQpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IEdyaWQgaW5zdGFuY2UgZ2l2ZW4gYSBkcmF3aW5nIGNhbnZhcy5cblx0ICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudH0gJGNhbnZhcyBUaGUgPGNhbnZhcz4gZWxlbWVudCBvbiB3aGljaCB0byBkcmF3LlxuXHQgKi9cblx0Y29uc3RydWN0b3IoJGNhbnZhcykge1xuXHRcdHRoaXMuY3R4ID0gJGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENsZWFycyB0aGUgZW50aXJlIGRyYXdpbmcgc3VyZmFjZS5cblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdGNsZWFyKCkge1xuXHRcdHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLnBpeGVsV2lkdGgsIHRoaXMucGl4ZWxIZWlnaHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEZpbGxzIHRoZSBpbnRlcmlvciBvZiBhIGdyaWQgc3F1YXJlIHdpdGggYSBjb2xvci5cblx0ICogQHBhcmFtIHtpbnR9IHggWmVyby1iYXNlZCB4LWNvb3JkaW5hdGUgb2YgdGhlIHNxdWFyZSBpbiB1bml0cyBvZiBzcXVhcmVzLlxuXHQgKiBAcGFyYW0ge2ludH0geSBaZXJvLWJhc2VkIHktY29vcmRpbmF0ZSBvZiB0aGUgc3F1YXJlIGluIHVuaXRzIG9mIHNxdWFyZXMuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjb2xvciBBIENTUyBjb2xvciB2YWx1ZS5cblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdGZpbGwoeCwgeSwgY29sb3IpIHtcblx0XHRjb25zdCBjdHggPSB0aGlzLmN0eDtcblx0XHRjb25zdCBfZmlsbFN0eWxlID0gY3R4LmZpbGxTdHlsZTtcblx0XHRjdHguZmlsbFN0eWxlID0gY29sb3I7XG5cblx0XHRjdHguZmlsbFJlY3QoXG5cdFx0XHRHcmlkLnRvUGl4ZWxzKHgpICsgKFdFSUdIVCAvIDIpLFxuXHRcdFx0R3JpZC50b1BpeGVscyh5KSArIChXRUlHSFQgLyAyKSxcblx0XHRcdFNJWkUsXG5cdFx0XHRTSVpFXG5cdFx0KTtcblxuXHRcdGN0eC5maWxsU3R5bGUgPSBfZmlsbFN0eWxlO1xuXHR9XG5cblx0LyoqXG5cdCAqIERyYXdzIHRoZSBib3JkZXIgc2hhcmVkIGJ5IHR3byBzcXVhcmVzLlxuXHQgKiBAcGFyYW0ge2ludH0geDEgWmVyby1iYXNlZCB4LWNvb3JkaW5hdGUgb2YgdGhlIGZpcnN0IHNxdWFyZSBpbiB1bml0cyBvZiBzcXVhcmVzLlxuXHQgKiBAcGFyYW0ge2ludH0geTEgWmVyby1iYXNlZCB5LWNvb3JkaW5hdGUgb2YgdGhlIGZpcnN0IHNxdWFyZSBpbiB1bml0cyBvZiBzcXVhcmVzLlxuXHQgKiBAcGFyYW0ge2ludH0geDIgWmVyby1iYXNlZCB4LWNvb3JkaW5hdGUgb2YgdGhlIHNlY29uZCBzcXVhcmUgaW4gdW5pdHMgb2Ygc3F1YXJlcy5cblx0ICogQHBhcmFtIHtpbnR9IHkyIFplcm8tYmFzZWQgeS1jb29yZGluYXRlIG9mIHRoZSBzZWNvbmQgc3F1YXJlIGluIHVuaXRzIG9mIHNxdWFyZXMuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjb2xvciBBIENTUyBjb2xvciB2YWx1ZS5cblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdGJyaWRnZSh4MSwgeTEsIHgyLCB5MiwgY29sb3IpIHtcblx0XHRpZiAoTWF0aC5hYnMoeDIgLSB4MSkgKyBNYXRoLmFicyh5MiAtIHkxKSAhPT0gMSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdTcXVhcmVzIGFyZSBub3QgYWRqYWNlbnQuJyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgeCA9IE1hdGgubWF4KHgxLCB4Mik7XG5cdFx0Y29uc3QgeSA9IE1hdGgubWF4KHkxLCB5Mik7XG5cblx0XHRjb25zdCBjdHggICAgICAgICAgPSB0aGlzLmN0eDtcblx0XHRjb25zdCBfbGluZUNhcCAgICAgPSBjdHgubGluZUNhcDtcblx0XHRjb25zdCBfbGluZVdpZHRoICAgPSBjdHgubGluZVdpZHRoO1xuXHRcdGNvbnN0IF9zdHJva2VTdHlsZSA9IGN0eC5zdHJva2VTdHlsZTtcblx0XHRjdHgubGluZUNhcCAgICAgICAgPSAnc3F1YXJlJztcblx0XHRjdHgubGluZVdpZHRoICAgICAgPSBXRUlHSFQ7XG5cdFx0Y3R4LnN0cm9rZVN0eWxlICAgID0gY29sb3I7XG5cblx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0aWYgKHgxID09PSB4Mikge1xuXHRcdFx0Ly8gQnJpZGdlIG5vcnRoL3NvdXRoIHNxdWFyZXNcblx0XHRcdC8vIE5hcnJvd2VyIHggZGltZW5zaW9uc1xuXHRcdFx0Y3R4Lm1vdmVUbyhHcmlkLnRvUGl4ZWxzKHgxKSArIFdFSUdIVCwgR3JpZC50b1BpeGVscyh5KSk7XG5cdFx0XHRjdHgubGluZVRvKEdyaWQudG9QaXhlbHMoeDEgKyAxKSAtIFdFSUdIVCwgR3JpZC50b1BpeGVscyh5KSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIEJyaWRnZSBlYXN0L3dlc3Qgc3F1YXJlc1xuXHRcdFx0Ly8gTmFycm93ZXIgeSBkaW1lbnNpb25zXG5cdFx0XHRjdHgubW92ZVRvKEdyaWQudG9QaXhlbHMoeCksIEdyaWQudG9QaXhlbHMoeTEpICsgV0VJR0hUKTtcblx0XHRcdGN0eC5saW5lVG8oR3JpZC50b1BpeGVscyh4KSwgR3JpZC50b1BpeGVscyh5MSArIDEpIC0gV0VJR0hUKTtcblx0XHR9XG5cdFx0Y3R4LnN0cm9rZSgpO1xuXG5cdFx0Y3R4LmxpbmVDYXAgICAgID0gX2xpbmVDYXA7XG5cdFx0Y3R4LmxpbmVXaWR0aCAgID0gX2xpbmVXaWR0aDtcblx0XHRjdHguc3Ryb2tlU3R5bGUgPSBfc3Ryb2tlU3R5bGU7XG5cdH1cblxuXHQvKipcblx0ICogRHJhd3MgYSBsaW5lIGJldHdlZW4gdGhlIHVwcGVyIGxlZnQgY29ybmVycyBvZiB0d28gZ3JpZCBzcXVhcmVzLlxuXHQgKiBAcGFyYW0ge2ludH0geDEgWmVyby1iYXNlZCB4LWNvb3JkaW5hdGUgb2YgdGhlIGZpcnN0IHNxdWFyZSByZWxhdGl2ZSB0byB0aGUgb3JpZ2luLlxuXHQgKiBAcGFyYW0ge2ludH0geTEgWmVyby1iYXNlZCB5LWNvb3JkaW5hdGUgb2YgdGhlIGZpcnN0IHNxdWFyZSByZWxhdGl2ZSB0byB0aGUgb3JpZ2luLlxuXHQgKiBAcGFyYW0ge2ludH0geDIgWmVyby1iYXNlZCB4LWNvb3JkaW5hdGUgb2YgdGhlIHNlY29uZCBzcXVhcmUgcmVsYXRpdmUgdG8gdGhlIG9yaWdpbi5cblx0ICogQHBhcmFtIHtpbnR9IHkyIFplcm8tYmFzZWQgeS1jb29yZGluYXRlIG9mIHRoZSBzZWNvbmQgc3F1YXJlIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW4uXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBbY29sb3JdIEEgQ1NTIGNvbG9yIHZhbHVlLiBEZWZhdWx0cyB0byBkYXJrIGdyYXkuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRsaW5lKHgxLCB5MSwgeDIsIHkyLCBjb2xvciA9IERBUktfR1JBWSkge1xuXHRcdGNvbnN0IGN0eCAgICAgICAgICA9IHRoaXMuY3R4O1xuXHRcdGNvbnN0IF9saW5lQ2FwICAgICA9IGN0eC5saW5lQ2FwO1xuXHRcdGNvbnN0IF9saW5lV2lkdGggICA9IGN0eC5saW5lV2lkdGg7XG5cdFx0Y29uc3QgX3N0cm9rZVN0eWxlID0gY3R4LnN0cm9rZVN0eWxlO1xuXHRcdGN0eC5saW5lQ2FwICAgICAgICA9ICdzcXVhcmUnO1xuXHRcdGN0eC5saW5lV2lkdGggICAgICA9IFdFSUdIVDtcblx0XHRjdHguc3Ryb2tlU3R5bGUgICAgPSBjb2xvcjtcblxuXHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRjdHgubW92ZVRvKEdyaWQudG9QaXhlbHMoeDEpLCBHcmlkLnRvUGl4ZWxzKHkxKSk7XG5cdFx0Y3R4LmxpbmVUbyhHcmlkLnRvUGl4ZWxzKHgyKSwgR3JpZC50b1BpeGVscyh5MikpO1xuXHRcdGN0eC5zdHJva2UoKTtcblxuXHRcdGN0eC5saW5lQ2FwICAgICA9IF9saW5lQ2FwO1xuXHRcdGN0eC5saW5lV2lkdGggICA9IF9saW5lV2lkdGg7XG5cdFx0Y3R4LnN0cm9rZVN0eWxlID0gX3N0cm9rZVN0eWxlO1xuXHR9XG5cbn1cbiIsImltcG9ydCBHcmlkIGZyb20gJy4vZ3JpZCc7XG5pbXBvcnQgeyBsYXN0RWxlbWVudCwgcmFuZG9tLCByYW5kb21FbGVtZW50IH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IEdSRUVOLCBSRUQgfSBmcm9tICcuL2NvbG9ycyc7XG5cbmNvbnN0IERJUkVDVElPTlMgPSBbJ25vcnRoJywgJ3NvdXRoJywgJ2Vhc3QnLCAnd2VzdCddO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXplIHtcblxuXHQvKipcblx0ICogR2V0cyB0aGUgcmVsYXRpdmUgZGlyZWN0aW9uIGJldHdlZW4gdHdvIGFkamFjZW50IHNxdWFyZXMuXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBzdGFydCBUaGUgc3RhcnRpbmcgc3F1YXJlLlxuXHQgKiBAcGFyYW0ge29iamVjdH0gZW5kIFRoZSBlbmRpbmcgc3F1YXJlLlxuXHQgKiBAcmV0dXJucyB7c3RyaWdufSBDYXJkaW5hbCBkaXJlY3Rpb24gZnJvbSBzdGFydCB0byBlbmQuXG5cdCAqL1xuXHRzdGF0aWMgcmVsYXRpdmVEaXJlY3Rpb24oc3RhcnQsIGVuZCkge1xuXHRcdGlmIChNYXRoLmFicyhlbmQueCAtIHN0YXJ0LngpICsgTWF0aC5hYnMoZW5kLnkgLSBzdGFydC55KSA+IDEpIHtcblx0XHRcdC8vIFNxdWFyZXMgYXJlIG5vdCBhZGphY2VudFxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0aWYgKHN0YXJ0LnggPCBlbmQueCkge1xuXHRcdFx0cmV0dXJuICdlYXN0Jztcblx0XHR9IGVsc2UgaWYgKGVuZC54IDwgc3RhcnQueCkge1xuXHRcdFx0cmV0dXJuICd3ZXN0Jztcblx0XHR9IGVsc2UgaWYgKHN0YXJ0LnkgPCBlbmQueSkge1xuXHRcdFx0cmV0dXJuICdzb3V0aCc7XG5cdFx0fSBlbHNlIGlmIChlbmQueSA8IHN0YXJ0LnkpIHtcblx0XHRcdHJldHVybiAnbm9ydGgnO1xuXHRcdH1cblx0fVxuXG5cdGNvbnN0cnVjdG9yKHdpZHRoLCBoZWlnaHQpIHtcblx0XHR0aGlzLndpZHRoID0gd2lkdGg7XG5cdFx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cdFx0dGhpcy5tYXplID0gdGhpcy5nZW5lcmF0ZSgpO1xuXHRcdHRoaXMucGF0aCA9IFt0aGlzLm1hemUuc3RhcnRdO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIGNvb3JkaW5hdGVzIG9mIGFuIGFkamFjZW50IHNxdWFyZS5cblx0ICogQHBhcmFtIHtvYmplY3R9IHN0YXJ0IFN0YXJ0aW5nIHNxdWFyZSdzIGNvb3JkaW5hdGVzLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZGlyZWN0aW9uIENhcmRpbmFsIGRpcmVjdGlvbiBvZiBhZGphY2VudCBzcXVhcmUuXG5cdCAqIEByZXR1cm5zIHtvYmplY3R9IEFkamFjZW50IHNxdWFyZSdzIGNvb3JkaW5hdGVzLlxuXHQgKi9cblx0Z2V0QWRqYWNlbnRTcXVhcmUoc3RhcnQsIGRpcmVjdGlvbikge1xuXHRcdHN3aXRjaCAoZGlyZWN0aW9uKSB7XG5cdFx0XHRjYXNlICdub3J0aCc6XG5cdFx0XHRcdHJldHVybiBzdGFydC55ID4gMFxuXHRcdFx0XHRcdD8geyB4OiBzdGFydC54LCB5OiBzdGFydC55IC0gMSB9XG5cdFx0XHRcdFx0OiBudWxsO1xuXHRcdFx0Y2FzZSAnc291dGgnOlxuXHRcdFx0XHRyZXR1cm4gc3RhcnQueSA8IHRoaXMuaGVpZ2h0IC0gMVxuXHRcdFx0XHRcdD8geyB4OiBzdGFydC54LCB5OiBzdGFydC55ICsgMSB9XG5cdFx0XHRcdFx0OiBudWxsO1xuXHRcdFx0Y2FzZSAnZWFzdCc6XG5cdFx0XHRcdHJldHVybiBzdGFydC54IDwgdGhpcy53aWR0aCAtIDFcblx0XHRcdFx0XHQ/IHsgeDogc3RhcnQueCArIDEsIHk6IHN0YXJ0LnkgfVxuXHRcdFx0XHRcdDogbnVsbDtcblx0XHRcdGNhc2UgJ3dlc3QnOlxuXHRcdFx0XHRyZXR1cm4gc3RhcnQueCA+IDBcblx0XHRcdFx0XHQ/IHsgeDogc3RhcnQueCAtIDEsIHk6IHN0YXJ0LnkgfVxuXHRcdFx0XHRcdDogbnVsbDtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBkaXJlY3Rpb24gJyArIGRpcik7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIGNvb3JkaW5hdGVzIG9mIGFsbCBzcXVhcmVzIGFkamFjZW50IHRvIGEgZ2l2ZW4gc3F1YXJlLlxuXHQgKiBAcGFyYW0ge29iamVjdH0gc3RhcnQgQ29vcmRpbmF0ZXMgb2YgdGhlIHN0YXJ0aW5nIHNxdWFyZS5cblx0ICogQHJldHVybnMge29iamVjdH0gQ29vcmRpbmF0ZXMgb2YgYWRqYWNlbnQgc3F1YXJlcyBpbiBlYWNoIGRpcmVjdGlvbi5cblx0ICovXG5cdGdldEFkamFjZW50U3F1YXJlcyhzdGFydCkge1xuXHRcdHJldHVybiBESVJFQ1RJT05TLnJlZHVjZSgob2JqLCBkaXIpID0+IHtcblx0XHRcdG9ialtkaXJdID0gdGhpcy5nZXRBZGphY2VudFNxdWFyZShzdGFydCwgZGlyKTtcblx0XHRcdHJldHVybiBvYmo7XG5cdFx0fSwge30pO1xuXHR9XG5cblx0Z2VuZXJhdGUoKSB7XG5cdFx0Y29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzO1xuXHRcdGNvbnN0IG1lc2ggPSBbXTtcblx0XHRjb25zdCBlZGdlcyA9IFtdO1xuXHRcdGxldCBsZW5ndGggPSAwO1xuXHRcdGxldCBzdGFydCwgZW5kO1xuXG5cdFx0ZnVuY3Rpb24gZ2V0U3F1YXJlKHsgeCwgeSB9KSB7XG5cdFx0XHRyZXR1cm4gbWVzaFt4XVt5XTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBpc0lzb2xhdGVkKHNxdWFyZSkge1xuXHRcdFx0c3F1YXJlID0gZ2V0U3F1YXJlKHNxdWFyZSk7XG5cdFx0XHRyZXR1cm4gRElSRUNUSU9OUy5ldmVyeShkaXIgPT4gc3F1YXJlW2Rpcl0gIT09IHRydWUpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNvbm5lY3QoYSwgYikge1xuXHRcdFx0Z2V0U3F1YXJlKGEpW01hemUucmVsYXRpdmVEaXJlY3Rpb24oYSwgYildID0gdHJ1ZTtcblx0XHRcdGdldFNxdWFyZShiKVtNYXplLnJlbGF0aXZlRGlyZWN0aW9uKGIsIGEpXSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gb3BlbkVkZ2Uoc3F1YXJlKSB7XG5cdFx0XHRjb25zdCB7IHgsIHkgfSA9IHNxdWFyZTtcblx0XHRcdGxldCBkaXJlY3Rpb247XG5cblx0XHRcdGlmICh4ID09PSAwKSB7XG5cdFx0XHRcdGRpcmVjdGlvbiA9ICd3ZXN0Jztcblx0XHRcdH0gZWxzZSBpZiAoeSA9PT0gMCkge1xuXHRcdFx0XHRkaXJlY3Rpb24gPSAnbm9ydGgnO1xuXHRcdFx0fSBlbHNlIGlmICh4ID09PSAod2lkdGggLSAxKSkge1xuXHRcdFx0XHRkaXJlY3Rpb24gPSAnZWFzdCc7XG5cdFx0XHR9IGVsc2UgaWYgKHkgPT09IChoZWlnaHQgLSAxKSkge1xuXHRcdFx0XHRkaXJlY3Rpb24gPSAnc291dGgnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdEZXN0aW5hdGlvbiBub3QgYW4gZWRnZS4nKTtcblx0XHRcdH1cblxuXHRcdFx0Z2V0U3F1YXJlKHsgeCwgeSB9KVtkaXJlY3Rpb25dID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRjb25zdCBzZWFyY2ggPSAocG9zKSA9PiB7XG5cdFx0XHRsZXQgYWRqYWNlbmNpZXMsIG9wdGlvbnMsIGhlYWRpbmcsIG5leHQ7XG5cblx0XHRcdGlmIChwb3MueCA9PT0gZW5kLnggJiYgcG9zLnkgPT0gZW5kLnkpIHtcblx0XHRcdFx0b3BlbkVkZ2UoZW5kKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRhZGphY2VuY2llcyA9IHRoaXMuZ2V0QWRqYWNlbnRTcXVhcmVzKHBvcyk7XG5cblx0XHRcdHdoaWxlICgxKSB7XG5cdFx0XHRcdG9wdGlvbnMgPSBPYmplY3Qua2V5cyhhZGphY2VuY2llcylcblx0XHRcdFx0XHQuZmlsdGVyKGRpciA9PiBhZGphY2VuY2llc1tkaXJdKVxuXHRcdFx0XHRcdC5maWx0ZXIoZGlyID0+IGlzSXNvbGF0ZWQodGhpcy5nZXRBZGphY2VudFNxdWFyZShwb3MsIGRpcikpKTtcblx0XHRcdFx0aWYgKCFvcHRpb25zLmxlbmd0aCkgYnJlYWs7XG5cblx0XHRcdFx0aGVhZGluZyA9IHJhbmRvbUVsZW1lbnQob3B0aW9ucyk7XG5cdFx0XHRcdG5leHQgPSBhZGphY2VuY2llc1toZWFkaW5nXTtcblx0XHRcdFx0Y29ubmVjdChwb3MsIG5leHQpO1xuXHRcdFx0XHRsZW5ndGgrKztcblx0XHRcdFx0c2VhcmNoKG5leHQpO1xuXHRcdFx0XHRsZW5ndGgtLTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmb3IgKGxldCB4ID0gMDsgeCA8IHdpZHRoOyB4KyspIHtcblx0XHRcdG1lc2hbeF0gPSBbXTtcblx0XHRcdGZvciAobGV0IHkgPSAwOyB5IDwgaGVpZ2h0OyB5KyspIHtcblx0XHRcdFx0aWYgKHggPT09IDAgfHxcblx0XHRcdFx0ICAgIHkgPT09IDAgfHxcblx0XHRcdFx0ICAgIHggPT09ICh3aWR0aCAtIDEpIHx8XG5cdFx0XHRcdCAgICB5ID09PSAoaGVpZ2h0IC0gMSlcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0ZWRnZXMucHVzaCh7IHgsIHkgfSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRtZXNoW3hdW3ldID0ge1xuXHRcdFx0XHRcdG5vcnRoOiAwIDwgeSA/IGZhbHNlIDogbnVsbCxcblx0XHRcdFx0XHRzb3V0aDogeSA8IChoZWlnaHQgLSAxKSA/IGZhbHNlIDogbnVsbCxcblx0XHRcdFx0XHR3ZXN0OiAwIDwgeCA/IGZhbHNlIDogbnVsbCxcblx0XHRcdFx0XHRlYXN0OiB4IDwgKHdpZHRoIC0gMSkgPyBmYWxzZSA6IG51bGxcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRzdGFydCA9IHJhbmRvbUVsZW1lbnQoZWRnZXMpO1xuXHRcdGRvIHtcblx0XHRcdGVuZCA9IHJhbmRvbUVsZW1lbnQoZWRnZXMpO1xuXHRcdH0gd2hpbGUgKHN0YXJ0LnggPT09IGVuZC54IHx8IHN0YXJ0LnkgPT09IGVuZC55KTtcblxuXHRcdG9wZW5FZGdlKHN0YXJ0KTtcblx0XHRzZWFyY2goc3RhcnQpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdG1lc2gsXG5cdFx0XHRzdGFydCxcblx0XHRcdGVuZFxuXHRcdH07XG5cdH1cblxuXHRicmlkZ2VFZGdlKHNxdWFyZSwgY29sb3IpIHtcblx0XHRpZiAoc3F1YXJlLnggPT09IDApIHsgLy8gV2VzdFxuXHRcdFx0dGhpcy5ncmlkLmJyaWRnZShzcXVhcmUueCAtIDEsIHNxdWFyZS55LCBzcXVhcmUueCwgc3F1YXJlLnksIGNvbG9yKTtcblx0XHR9IGVsc2UgaWYgKHNxdWFyZS55ID09PSAwKSB7IC8vIE5vcnRoXG5cdFx0XHR0aGlzLmdyaWQuYnJpZGdlKHNxdWFyZS54LCBzcXVhcmUueSAtIDEsIHNxdWFyZS54LCBzcXVhcmUueSwgY29sb3IpO1xuXHRcdH0gZWxzZSBpZiAoc3F1YXJlLnggPT09ICh0aGlzLndpZHRoIC0gMSkpIHsgLy8gRWFzdFxuXHRcdFx0dGhpcy5ncmlkLmJyaWRnZShzcXVhcmUueCwgc3F1YXJlLnksIHNxdWFyZS54ICsgMSwgc3F1YXJlLnksIGNvbG9yKTtcblx0XHR9IGVsc2UgaWYgKHNxdWFyZS55ID09PSAodGhpcy5oZWlnaHQgLSAxKSkgeyAvLyBTb3V0aFxuXHRcdFx0dGhpcy5ncmlkLmJyaWRnZShzcXVhcmUueCwgc3F1YXJlLnksIHNxdWFyZS54LCBzcXVhcmUueSArIDEsIGNvbG9yKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdTcXVhcmUgaXMgbm90IG9uIGVkZ2UuJyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdHJlbmRlcigkY2FudmFzKSB7XG5cdFx0Y29uc3QgZ3JpZCA9IHRoaXMuZ3JpZCA9IG5ldyBHcmlkKCRjYW52YXMpO1xuXHRcdGNvbnN0IG1hemUgPSB0aGlzLm1hemU7XG5cdFx0Y29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzO1xuXG5cdFx0Z3JpZC5jbGVhcigpO1xuXHRcdGdyaWQuZ3JpZFdpZHRoID0gd2lkdGg7XG5cdFx0Z3JpZC5ncmlkSGVpZ2h0ID0gaGVpZ2h0O1xuXG5cdFx0Zm9yIChsZXQgeCA9IDA7IHggPCB3aWR0aDsgeCsrKSB7XG5cdFx0XHRmb3IgKGxldCB5ID0gMDsgeSA8IGhlaWdodDsgeSsrKSB7XG5cdFx0XHRcdGlmICghbWF6ZS5tZXNoW3hdW3ldLndlc3QpIHtcblx0XHRcdFx0XHRncmlkLmxpbmUoeCwgeSwgeCwgeSArIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghbWF6ZS5tZXNoW3hdW3ldLm5vcnRoKSB7XG5cdFx0XHRcdFx0Z3JpZC5saW5lKHgsIHksIHggKyAxLCB5KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIE9ubHkgbmVlZCB0byBkcmF3IHNvdXRoIGFuZCBlYXN0IG9uIGVkZ2VzXG5cdFx0XHRcdGlmICh4ID09PSB3aWR0aCAtIDEgJiYgIW1hemUubWVzaFt4XVt5XS5lYXN0KSB7XG5cdFx0XHRcdFx0Z3JpZC5saW5lKHggKyAxLCB5LCB4ICsgMSwgeSArIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh5ID09PSBoZWlnaHQgLSAxICYmICFtYXplLm1lc2hbeF1beV0uc291dGgpIHtcblx0XHRcdFx0XHRncmlkLmxpbmUoeCwgeSArIDEsIHggKyAxLCB5ICsgMSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRncmlkLmZpbGwobWF6ZS5zdGFydC54LCBtYXplLnN0YXJ0LnksIEdSRUVOKTtcblx0XHRncmlkLmZpbGwobWF6ZS5lbmQueCwgbWF6ZS5lbmQueSwgUkVEKTtcblx0XHR0aGlzLmJyaWRnZUVkZ2UobWF6ZS5zdGFydCwgR1JFRU4pO1xuXHRcdHRoaXMuYnJpZGdlRWRnZShtYXplLmVuZCwgUkVEKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRtb3ZlKGRpcikge1xuXHRcdGNvbnN0IHBhdGggPSB0aGlzLnBhdGg7XG5cdFx0Y29uc3QgcG9zID0gbGFzdEVsZW1lbnQocGF0aCk7XG5cdFx0Y29uc3QgcHJldmlvdXMgPSBwYXRoW3BhdGgubGVuZ3RoIC0gMl07XG5cdFx0bGV0IG5leHQ7XG5cblx0XHQvLyBEb24ndCBicmVhayBkb3duIHdhbGxzXG5cdFx0aWYgKCF0aGlzLm1hemUubWVzaFtwb3MueF1bcG9zLnldW2Rpcl0pIHJldHVybiBmYWxzZTtcblxuXHRcdG5leHQgPSB0aGlzLmdldEFkamFjZW50U3F1YXJlKHBvcywgZGlyKTtcblx0XHRpZiAoIW5leHQpIHJldHVybiBmYWxzZTtcblxuXHRcdGlmIChwcmV2aW91cyAmJiBuZXh0LnggPT09IHByZXZpb3VzLnggJiYgbmV4dC55ID09PSBwcmV2aW91cy55KSB7XG5cdFx0XHR0aGlzLmdyaWQuYnJpZGdlKHBvcy54LCBwb3MueSwgbmV4dC54LCBuZXh0LnksIFJFRCk7XG5cdFx0XHR0aGlzLmdyaWQuZmlsbChwb3MueCwgcG9zLnksIFJFRCk7XG5cdFx0XHR0aGlzLnBhdGgucG9wKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuZ3JpZC5icmlkZ2UocG9zLngsIHBvcy55LCBuZXh0LngsIG5leHQueSwgR1JFRU4pO1xuXHRcdFx0dGhpcy5ncmlkLmZpbGwobmV4dC54LCBuZXh0LnksIEdSRUVOKTtcblx0XHRcdHRoaXMucGF0aC5wdXNoKG5leHQpO1xuXHRcdH1cblxuXHRcdGlmIChuZXh0LnggPT09IHRoaXMubWF6ZS5lbmQueCAmJiBuZXh0LnkgPT09IHRoaXMubWF6ZS5lbmQueSkge1xuXHRcdFx0dGhpcy5icmlkZ2VFZGdlKG5leHQsIEdSRUVOKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGVudGVyU3F1YXJlKHNxdWFyZSkge1xuXHRcdGNvbnN0IHBvcyA9IGxhc3RFbGVtZW50KHRoaXMucGF0aCk7XG5cdFx0Y29uc3QgZGlyID0gTWF6ZS5yZWxhdGl2ZURpcmVjdGlvbihwb3MsIHNxdWFyZSk7XG5cdFx0aWYgKGRpcikgdGhpcy5tb3ZlKGRpcik7XG5cdH1cblxuXHQvKipcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0aG92ZXIoeCwgeSkge1xuXHRcdHggPSBHcmlkLnRvU3F1YXJlcyh4KTtcblx0XHR5ID0gR3JpZC50b1NxdWFyZXMoeSk7XG5cblx0XHRpZiAoeCA+PSAwICYmIHkgPj0gMCAmJiAoeCAhPT0gdGhpcy5feCB8fCB5ICE9PSB0aGlzLl95KSkge1xuXHRcdFx0dGhpcy5feCA9IHg7XG5cdFx0XHR0aGlzLl95ID0geTtcblx0XHRcdHRoaXMuZW50ZXJTcXVhcmUoeyB4LCB5IH0pO1xuXHRcdH1cblx0fVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIG1vZChhLCBiKSB7XG5cdHJldHVybiAoKGEgJSBiKSArIGIpICUgYjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbSgpIHtcblx0bGV0IHggPSBNYXRoLnNpbihyYW5kb20uc2VlZCsrKSAqIDEwMDAwO1xuXHRyZXR1cm4geCAtIE1hdGguZmxvb3IoeCk7XG59XG5cbnJhbmRvbS5zZWVkID0gTWF0aC5yYW5kb20oKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbUludChtYXgpIHtcblx0cmV0dXJuIE1hdGguZmxvb3IocmFuZG9tKCkgKiBtYXgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tRWxlbWVudChhcnIpIHtcblx0cmV0dXJuIGFycltyYW5kb21JbnQoYXJyLmxlbmd0aCldO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGFzdEVsZW1lbnQoYXJyKSB7XG5cdHJldHVybiBhcnJbYXJyLmxlbmd0aCAtIDFdO1xufVxuIl19