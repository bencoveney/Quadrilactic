export class LocationComponent {
	// Data members
	private _x: number;
	private _y: number;
	private _xSpeed: number;
	private _ySpeed: number;
	private _xSize: number;
	private _ySize: number;

	// Position properties.
	get xPosition(): number {
		return this._x;
	}
	set xPosition(newValue: number) {
		this._x = newValue;
	}
	get yPosition(): number {
		return this._y;
	}
	set yPosition(newValue: number) {
		this._y = newValue;
	}

	// Size properties
	get width(): number {
		return this._xSize;
	}
	get height(): number {
		return this._ySize;
	}

	// Position helper properties
	get left(): number {
		return this._x;
	}
	get right(): number {
		return this._x + this.width;
	}
	get top(): number {
		return this._y;
	}
	get bottom(): number {
		return this._y + this.height;
	}
	get centerXPosition(): number {
		return this._x + (this.width / 2);
	}
	get centerYPosition(): number {
		return this._y + (this.height / 2);
	}

	// Velocity properties
	get xSpeed(): number {
		return this._xSpeed;
	}
	set xSpeed(newValue: number) {
		this._xSpeed = newValue;
	}
	get ySpeed(): number {
		return this._ySpeed;
	}
	set ySpeed(newValue: number) {
		this._ySpeed = newValue;
	}

	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		xSpeed: number,
		ySpeed: number,
		gravity: number
	) {
		this._x = x;
		this._y = y;
		this._xSize = width;
		this._ySize = height;
		this._xSpeed = xSpeed;
		this._ySpeed = ySpeed;
	}
}
