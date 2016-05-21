export enum LocationType {
	unknown = 0,
	world = 1,
	ui = 2
}

export class LocationComponent {
	private static degrees: number = Math.PI / 180;

	// Data members.
	private _x: number | Function;
	private _y: number | Function;
	private _xSpeed: number;
	private _ySpeed: number;
	private _xSize: number;
	private _ySize: number;
	private _rotation: number;
	private _type: LocationType;

	// Position properties.
	get xPosition(): number | Function {
		return this._x;
	}
	set xPosition(newValue: number | Function) {
		this._x = newValue;
	}
	get yPosition(): number | Function {
		return this._y;
	}
	set yPosition(newValue: number | Function) {
		this._y = newValue;
	}
	get xPositionValue(): number {
		if (typeof this._x === "function") {
			return (this._x as Function)() as number;
		} else {
			return this._x as number;
		}
	}
	get yPositionValue(): number {
		if (typeof this._y === "function") {
			return (this._y as Function)() as number;
		} else {
			return this._y as number;
		}
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
		return this.xPositionValue;
	}
	get right(): number {
		return this.xPositionValue + this.width;
	}
	get top(): number {
		return this.yPositionValue;
	}
	get bottom(): number {
		return this.yPositionValue + this.height;
	}
	get centerXPosition(): number {
		return this.xPositionValue + (this.width / 2);
	}
	get centerYPosition(): number {
		return this.yPositionValue + (this.height / 2);
	}
	get rotationInDegrees(): number {
		return this.rotation * LocationComponent.degrees;
	}

	get type(): LocationType {
		return this._type;
	}

	constructor(
		x: number | Function,
		y: number | Function,
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
