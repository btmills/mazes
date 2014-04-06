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

var [, width, height, seed] = /#(\d+)x(\d+)(?:s(\d+.\d+))?|.*/
	.exec(window.location.hash);
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
