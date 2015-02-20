import Maze from './maze';
import { random } from './util';

class App {
	get width() { return +this.$width.value; }
	set width(value) { this.$width.value = value; }

	get height() { return +this.$height.value; }
	set height(value) { this.$height.value = value; }

	constructor() {
		this.$width = document.querySelector('#width');
		this.$height = document.querySelector('#height');
		this.$permalink = document.querySelector('#permalink');
		this.$canvas = document.querySelector('#canvas');

		document.querySelector('#generate').addEventListener('click', (event) => {
			event.preventDefault();
			this.generate();
		});

		document.body.addEventListener('keyup', (event) => {
			let key = event.key || event.charCode || event.keyCode;
			let direction = ['west', 'north', 'east', 'south'][key - 37];
			if (!direction) return;

			event.preventDefault();
			this.maze.move(direction);
		});

		this.$canvas.addEventListener('mousemove', (event) => {
			this.maze.hover(event.layerX, event.layerY);
		});

		// Attempt to read maze parameters from URL hash
		let [, width, height, seed] = /#(\d+)x(\d+)(?:s(\d+.\d+))?|.*/.exec(window.location.hash);

		if (width && height) {
			this.width = width;
			this.height = height;
		}

		if (seed) {
			random.seed = parseFloat(seed);
		}

		this.generate();
	}

	generate() {
		this.setPermalink();

		this.maze = new Maze(this.width, this.height);
		this.maze.render(this.$canvas);
	}

	setPermalink() {
		let hash = `#${this.width}x${this.height}s${random.seed}`;
		let href = window.location.href.split('#')[0] + hash;
		window.location.hash = hash;
		this.$permalink.setAttribute('href', href);
	}
}

new App();
