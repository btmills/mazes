import mod from './mod';

const SIZE = 20; // Width of a square in pixels
const WEIGHT = 2; // Width of the line between squares in pixels

export default class Grid {

	get pixelHeight() {
		return this.ctx.canvas.height;
	}

	set pixelHeight(pixels) {
		this.ctx.canvas.height = pixels;
	}

	get pixelWidth() {
		return this.ctx.canvas.width;
	}

	set pixelWidth(pixels) {
		this.ctx.canvas.width = pixels;
	}

	get gridHeight() {
		return (this.pixelHeight - WEIGHT) / (SIZE + WEIGHT);
	}

	set gridHeight(squares) {
		this.pixelHeight = squares * SIZE + (squares + 1) * WEIGHT;
	}

	get gridWidth() {
		return (this.pixelWidth - WEIGHT) / (SIZE + WEIGHT);
	}

	set gridWidth(squares) {
		this.pixelWidth = squares * SIZE + (squares + 1) * WEIGHT;
	}

	/**
	 * Converts from square units to pixel units.
	 * @param {int} squares Zero-based square coordinate.
	 * @returns {int} The coordinate of the pixel closest to the origin in the square.
	 * @public
	 */
	static toPixels(squares) {
		return (WEIGHT / 2) + squares * (WEIGHT + SIZE);
	}

	/**
	 * Converts from pixel units to square units.
	 * @param {int} pixels Zero-based coordinate of a pixel.
	 * @returns {int} The zero-based coordinate of the square containing the pixel, or -1 if the
	 *                pixel is on a boundary between squares.
	 * @public
	 */
	static toSquares(pixels) {
		if (mod(pixels - WEIGHT, SIZE + WEIGHT) >= (SIZE - WEIGHT)) {
			// On a line
			return -1;
		}

		return Math.floor((pixels - WEIGHT) / (SIZE + WEIGHT));
	}

	/**
	 * Creates a new Grid instance given a drawing canvas.
	 * @param {HTMLCanvasElement} $canvas The <canvas> element on which to draw.
	 */
	constructor($canvas) {
		this.ctx = $canvas.getContext('2d');
	}

	/**
	 * Clears the entire drawing surface.
	 * @returns {void}
	 * @public
	 */
	clear() {
		this.ctx.clearRect(0, 0, this.pixelWidth, this.pixelHeight);
	}

	/**
	 * Fills the interior of a grid square with a color.
	 * @param {int} x Zero-based x-coordinate of the square in units of squares.
	 * @param {int} y Zero-based y-coordinate of the square in units of squares.
	 * @param {string} color A CSS color value.
	 * @returns {void}
	 * @public
	 */
	fill(x, y, color) {
		const ctx = this.ctx;
		const _fillStyle = ctx.fillStyle;
		ctx.fillStyle = color;

		ctx.fillRect(
			Grid.toPixels(x) + (WEIGHT / 2),
			Grid.toPixels(y) + (WEIGHT / 2),
			SIZE,
			SIZE
		);

		ctx.fillStyle = _fillStyle;
	}

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
	bridge(x1, y1, x2, y2, color) {
		if (Math.abs(x2 - x1) + Math.abs(y2 - y1) !== 1) {
			throw new Error('Squares are not adjacent.');
		}

		const x = Math.max(x1, x2);
		const y = Math.max(y1, y2);

		const ctx          = this.ctx;
		const _lineCap     = ctx.lineCap;
		const _lineWidth   = ctx.lineWidth;
		const _strokeStyle = ctx.strokeStyle;
		ctx.lineCap        = 'square';
		ctx.lineWidth      = WEIGHT;
		ctx.strokeStyle    = color;

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

		ctx.lineCap     = _lineCap;
		ctx.lineWidth   = _lineWidth;
		ctx.strokeStyle = _strokeStyle;
	}

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
	line(x1, y1, x2, y2, color = '#16191d') {
		const ctx          = this.ctx;
		const _lineCap     = ctx.lineCap;
		const _lineWidth   = ctx.lineWidth;
		const _strokeStyle = ctx.strokeStyle;
		ctx.lineCap        = 'square';
		ctx.lineWidth      = WEIGHT;
		ctx.strokeStyle    = color;

		ctx.beginPath();
		ctx.moveTo(Grid.toPixels(x1), Grid.toPixels(y1));
		ctx.lineTo(Grid.toPixels(x2), Grid.toPixels(y2));
		ctx.stroke();

		ctx.lineCap     = _lineCap;
		ctx.lineWidth   = _lineWidth;
		ctx.strokeStyle = _strokeStyle;
	}

}
