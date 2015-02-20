import Grid from './grid';
import { lastElement, random, randomElement } from './util';
import { GREEN, RED } from './colors';

const DIRECTIONS = ['north', 'south', 'east', 'west'];

export default class Maze {

	/**
	 * Gets the relative direction between two adjacent squares.
	 * @param {object} start The starting square.
	 * @param {object} end The ending square.
	 * @returns {strign} Cardinal direction from start to end.
	 */
	static relativeDirection(start, end) {
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

	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.maze = this.generate();
		this.path = [this.maze.start];
	}

	/**
	 * Gets the coordinates of an adjacent square.
	 * @param {object} start Starting square's coordinates.
	 * @param {string} direction Cardinal direction of adjacent square.
	 * @returns {object} Adjacent square's coordinates.
	 */
	getAdjacentSquare(start, direction) {
		switch (direction) {
			case 'north':
				return start.y > 0
					? { x: start.x, y: start.y - 1 }
					: null;
			case 'south':
				return start.y < this.height - 1
					? { x: start.x, y: start.y + 1 }
					: null;
			case 'east':
				return start.x < this.width - 1
					? { x: start.x + 1, y: start.y }
					: null;
			case 'west':
				return start.x > 0
					? { x: start.x - 1, y: start.y }
					: null;
			default:
				throw new Error('Invalid direction ' + dir);
		}
	}

	/**
	 * Gets the coordinates of all squares adjacent to a given square.
	 * @param {object} start Coordinates of the starting square.
	 * @returns {object} Coordinates of adjacent squares in each direction.
	 */
	getAdjacentSquares(start) {
		return DIRECTIONS.reduce((obj, dir) => {
			obj[dir] = this.getAdjacentSquare(start, dir);
			return obj;
		}, {});
	}

	generate() {
		const { width, height } = this;
		const mesh = [];
		const edges = [];
		let length = 0;
		let start, end;

		function getSquare({ x, y }) {
			return mesh[x][y];
		}

		function isIsolated(square) {
			square = getSquare(square);
			return DIRECTIONS.every(dir => square[dir] !== true);
		}

		function connect(a, b) {
			getSquare(a)[Maze.relativeDirection(a, b)] = true;
			getSquare(b)[Maze.relativeDirection(b, a)] = true;
		}

		function openEdge(square) {
			const { x, y } = square;
			let direction;

			if (x === 0) {
				direction = 'west';
			} else if (y === 0) {
				direction = 'north';
			} else if (x === (width - 1)) {
				direction = 'east';
			} else if (y === (height - 1)) {
				direction = 'south';
			} else {
				throw new Error('Destination not an edge.');
			}

			getSquare({ x, y })[direction] = true;
		}

		const search = (pos) => {
			let adjacencies, options, heading, next;

			if (pos.x === end.x && pos.y == end.y) {
				openEdge(end);
				return;
			}

			adjacencies = this.getAdjacentSquares(pos);

			while (1) {
				options = Object.keys(adjacencies)
					.filter(dir => adjacencies[dir])
					.filter(dir => isIsolated(this.getAdjacentSquare(pos, dir)));
				if (!options.length) break;

				heading = randomElement(options);
				next = adjacencies[heading];
				connect(pos, next);
				length++;
				search(next);
				length--;
			}
		}

		for (let x = 0; x < width; x++) {
			mesh[x] = [];
			for (let y = 0; y < height; y++) {
				if (x === 0 ||
				    y === 0 ||
				    x === (width - 1) ||
				    y === (height - 1)
				) {
					edges.push({ x, y });
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

		return {
			mesh,
			start,
			end
		};
	}

	bridgeEdge(square, color) {
		if (square.x === 0) { // West
			this.grid.bridge(square.x - 1, square.y, square.x, square.y, color);
		} else if (square.y === 0) { // North
			this.grid.bridge(square.x, square.y - 1, square.x, square.y, color);
		} else if (square.x === (this.width - 1)) { // East
			this.grid.bridge(square.x, square.y, square.x + 1, square.y, color);
		} else if (square.y === (this.height - 1)) { // South
			this.grid.bridge(square.x, square.y, square.x, square.y + 1, color);
		} else {
			throw new Error('Square is not on edge.');
		}
	}

	/**
	 * @public
	 */
	render($canvas) {
		const grid = this.grid = new Grid($canvas);
		const maze = this.maze;
		const { width, height } = this;

		grid.clear();
		grid.gridWidth = width;
		grid.gridHeight = height;

		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
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
	}

	/**
	 * @public
	 */
	move(dir) {
		const path = this.path;
		const pos = lastElement(path);
		const previous = path[path.length - 2];
		let next;

		// Don't break down walls
		if (!this.maze.mesh[pos.x][pos.y][dir]) return false;

		next = this.getAdjacentSquare(pos, dir);
		if (!next) return false;

		if (previous && next.x === previous.x && next.y === previous.y) {
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
	}

	enterSquare(square) {
		const pos = lastElement(this.path);
		const dir = Maze.relativeDirection(pos, square);
		if (dir) this.move(dir);
	}

	/**
	 * @public
	 */
	hover(x, y) {
		x = Grid.toSquares(x);
		y = Grid.toSquares(y);

		if (x >= 0 && y >= 0 && (x !== this._x || y !== this._y)) {
			this._x = x;
			this._y = y;
			this.enterSquare({ x, y });
		}
	}
}




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
