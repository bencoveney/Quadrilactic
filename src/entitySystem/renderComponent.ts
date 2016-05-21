import {LocationComponent} from "entitySystem/locationComponent";

export class RenderComponent {
	private static skewScale: number = 0.07;

	private _position: LocationComponent;
	private _layers: RenderLayer | RenderLayer[] | Function;
	private _opacity: number | Function;
	private _zIndex: number;
	private _skew: number;

	get position(): LocationComponent {
		return this._position;
	}
	set position(newValue: LocationComponent) {
		this._position = newValue;
	}
	get skewedPosition(): LocationComponent
	{
		let skewAdjustment: number = this.skew === 0 ? 0 : Math.sin(this.skew);
		skewAdjustment = skewAdjustment * this.skew;

		let widthAdjustment: number = (skewAdjustment * this._position.width * RenderComponent.skewScale);
		let heightAdjustment: number = (skewAdjustment * this._position.height * RenderComponent.skewScale);

		return new LocationComponent(
			this._position.xPositionValue + (widthAdjustment / 2),
			this._position.yPositionValue - (heightAdjustment / 2),
			this._position.width - widthAdjustment,
			this._position.height + heightAdjustment,
			this._position.xSpeed,
			this._position.ySpeed,
			this._position.rotation);
	}

	get opacity(): number | Function {
		return this._opacity;
	}
	set opacity(newValue: number | Function) {
		this._opacity = newValue;
	}

	get opacityValue(): number {
		if (typeof this._opacity === "function") {
			return (this._opacity as Function)() as number;
		} else {
			return this._opacity as number;
		}
	}

	get zIndex(): number {
		return this._zIndex;
	}
	set zIndex(newValue: number) {
		this._zIndex = newValue;
	}

	get skew(): number {
		return this._skew;
	}
	set skew(newValue: number) {
		this._skew = newValue;
	}

	get layers(): RenderLayer[] {
		if (typeof this._layers === "function") {
			return (this._layers as Function)() as RenderLayer[];
		} else {
			return [].concat(this._layers) as RenderLayer[];
		}
	}

	constructor(position: LocationComponent, layers: RenderLayer | RenderLayer[] | Function, opacity: number | Function, zIndex: number) {
		this._position = position;
		this._layers = layers;
		this._opacity = opacity;
		this._zIndex = zIndex;
		this._skew = 0;
	}
}

export abstract class RenderLayer {
	private _offsetX: number;
	private _offsetY: number;

	public get offsetX(): number {
		return this._offsetX;
	}
	public set offsetX(newValue: number) {
		this._offsetX = newValue;
	}
	public get offsetY(): number {
		return this._offsetY;
	}
	public set offsetY(newValue: number) {
		this._offsetY = newValue;
	}

	constructor() {
		this._offsetX = 0;
		this._offsetY = 0;
	}
}

export class RectangleLayer extends RenderLayer {
	private _fillColor: string | Function;

	get fillColor(): string | Function {
		return this._fillColor;
	}
	set fillColor(newValue: string | Function) {
		this._fillColor = newValue;
	}

	get fillColorValue(): string {
		if (typeof this._fillColor === "function") {
			return (this._fillColor as Function)() as string;
		} else {
			return this._fillColor as string;
		}
	}

	constructor(fillColor: string | Function) {
		super();

		this._fillColor = fillColor;
	}
}

export class SpriteLayer extends RenderLayer {
	private _image: HTMLImageElement;

	get image(): HTMLImageElement {
		return this._image;
	}

	constructor(image: HTMLImageElement) {
		super();

		this._image = image;
	}

	public static FromPath(imagePath: string): SpriteLayer {
		let image: HTMLImageElement = new Image();
		image.src = imagePath;

		return new SpriteLayer(image);
	}
}

export class TextLayer extends RenderLayer {
	private _text: string | Function;
	private _fillColor: string | Function;
	private _font: string;
	private _sizeInPixels: number;

	get text(): string | Function {
		return this._text;
	}

	get textValue(): string {
		if (typeof this._text === "function") {
			return (this._text as Function)() as string;
		} else {
			return this._text as string;
		}
	}

	get fillColor(): string | Function {
		return this._fillColor;
	}
	set fillColor(newValue: string | Function) {
		this._fillColor = newValue;
	}

	get fillColorValue(): string {
		if (typeof this._fillColor === "function") {
			return (this._fillColor as Function)() as string;
		} else {
			return this._fillColor as string;
		}
	}

	get font(): string {
		return this._font;
	}

	get sizeInPixels(): number {
		return this._sizeInPixels;
	}

	constructor(text: string | Function, fillColor: string | Function, font: string, sizeInPixels: number) {
		super();

		this._text = text;
		this._fillColor = fillColor;
		this._font = font;
		this._sizeInPixels = sizeInPixels;
	}
}
