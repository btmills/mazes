var Maze = function (width, height) {

	var DIRECTIONS = ['north', 'south', 'east', 'west'];

	function randomInt(max) {
		return Math.floor(Math.random() * max);
	}

	function randomElement(arr) {
		return arr[randomInt(arr.length)];
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
		return DIRECTIONS.reduce((obj, dir) => {
			obj[dir] = adjacentSquare(start, dir);
			return obj;
		}, {});
	}

	/**
	 * Gets the relative direction from start to end.
	 * @param {object} start The starting square.
	 * @param {object} end The ending square.
	 * @returns {strign} Cardinal direction from start to end.
	 */
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
		var x, y;
		var start, end;

		function getSquare(square) {
			return mesh[square.x][square.y];
		}

		function isolated(square) {
			square = getSquare(square);
			return DIRECTIONS.every(dir => square[dir] !== true);
		}

		function connect(a, b) {
			//console.log(['CONNECTING (',a.x,',',a.y,') and (',b.x,',',b.y,').'].join(''));
			mesh[a.x][a.y][relativeDirection(a, b)] = true;
			mesh[b.x][b.y][relativeDirection(b, a)] = true;
		}

		function openEdge(square) {
			var {x, y} = square;
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
					.filter(dir => adjacencies[dir])
					.filter(dir => isolated(adjacentSquare(pos, dir)));
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
					edges.push({x, y});
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

	function render(maze) {
		var grid = new Grid(document.getElementById('canvas'));
		var x, y;

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

		grid.fill(maze.start.x, maze.start.y, '#4ecdc4');
		grid.fill(maze.end.x, maze.end.y, '#ff6b6b');
		bridgeEdge(maze.start, '#4ecdc4');
		bridgeEdge(maze.end, '#ff6b6b');
	}

	return {
		generate,
		render
	};

}

function generate() {
	var width = +document.getElementById('width').value;
	var height = +document.getElementById('height').value;

	var m = new Maze(width, height);
	m.render(m.generate());
}

document.getElementById('generate')
	.addEventListener('click', function (event) {
		event.preventDefault();
		generate();
	});
generate();
