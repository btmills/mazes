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

		document.querySelector('#generate').addEventListener('click', this.onGenerate.bind(this));
		document.body.addEventListener('keydown', this.onKeyDown.bind(this));
		this.$canvas.addEventListener('mousemove', this.onMouseMove.bind(this));

		// Attempt to read maze parameters from URL hash
		const [, width, height, seed] = /#(\d+)x(\d+)(?:s(\d+.\d+))?|.*/.exec(window.location.hash);

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
		const hash = `#${this.width}x${this.height}s${random.seed}`;
		const href = window.location.href.split('#')[0] + hash;
		window.location.hash = hash;
		this.$permalink.setAttribute('href', href);
	}

	onGenerate(event) {
		event.preventDefault();
		this.generate();
	}

	onKeyDown(event) {
		const direction = ['west', 'north', 'east', 'south'][event.keyCode - 37];
		if (!direction) return;

		event.preventDefault();
		this.maze.move(direction);
	}

	onMouseMove(event) {
		const clientRect = this.$canvas.getBoundingClientRect();
		this.maze.hover(event.clientX - clientRect.left, event.clientY - clientRect.top);
	}
}

new App();
