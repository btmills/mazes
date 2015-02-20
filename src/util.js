export function mod(a, b) {
	return ((a % b) + b) % b;
}

export function random() {
	let x = Math.sin(random.seed++) * 10000;
	return x - Math.floor(x);
}

random.seed = Math.random();

export function randomInt(max) {
	return Math.floor(random() * max);
}

export function randomElement(arr) {
	return arr[randomInt(arr.length)];
}

export function lastElement(arr) {
	return arr[arr.length - 1];
}
