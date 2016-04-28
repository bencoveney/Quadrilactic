export enum LocationType {
	unknown = 0,
	world = 1,
	ui = 2
}

export class LocationComponent {
	private static degrees: number = Math.PI / 180;

	// Data members.
	private _x: number;
	private _y: number;
	private _xSpeed: number;
	private _ySpeed: number;
	private _xSize: number;
	private _ySize: number;
	private _rotation: number;
	private _type: LocationType;

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

	// Size properties.
	get width(): number {
		return this._xSize;
	}
	get height(): number {
		return this._ySize;
	}

	// Velocity properties.
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

	// Rotation properties.
	get rotation(): number {
		return this._rotation;
	}
	set rotation(newValue: number) {
		this._rotation = newValue;
	}

	// Helper properties.
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
	get rotationInDegrees(): number {
		return this.rotation * LocationComponent.degrees;
	}

	get type(): LocationType {
		return this._type;
	}

	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		xSpeed: number,
		ySpeed: number,
		rotation: number,
		type: LocationType = LocationType.world
	) {
		this._x = x;
		this._y = y;
		this._xSize = width;
		this._ySize = height;
		this._xSpeed = xSpeed;
		this._ySpeed = ySpeed;
		this._rotation = rotation;
		this._type = type;
	}

	public Duplicate(): LocationComponent {
		return new LocationComponent(
			this._x,
			this._y,
			this._xSize,
			this._ySize,
			this._xSpeed,
			this._ySpeed,
			this._rotation,
			this._type
		);
	}
}
