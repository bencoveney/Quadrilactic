interface Point {
	x: number;
	y: number;
}

interface MovingPoint extends Point {
	dX: number;
	dY: number;
}

interface Rectangle extends Point {
	width: number;
	height: number;
}
