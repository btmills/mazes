export default function random() {
	let x = Math.sin(random.seed++) * 10000;
	return x - Math.floor(x);
}

random.seed = Math.random();
