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

	function toPixels(coord) {
		return (WEIGHT / 2) + coord * (WEIGHT + SIZE);
	}

	function clear() {
		ctx.clearRect(0, 0, pixelWidth(), pixelHeight());
	}

	function fill(x, y, color) {
		console.log('Filling (' + x + ',' + y + ')');
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
			ctx.moveTo(toPixels(x1) + WEIGHT, toPixels(y2));
			ctx.lineTo(toPixels(x1 + 1) - WEIGHT, toPixels(y2));
		} else {
			// Bridge east/west squares
			// Narrower y dimensions
			ctx.moveTo(toPixels(x2), toPixels(y1) + WEIGHT);
			ctx.lineTo(toPixels(x2), toPixels(y1 + 1) - WEIGHT);
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
		pixelHeight,
		pixelWidth,
		clear,
		fill,
		bridge,
		line
	};

};
