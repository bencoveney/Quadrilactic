import {LocationComponent} from "entitySystem/LocationComponent";

export class RenderComponent {
	// Data members.
	private _fillColor: string;
	private _opacity: number;
	private _position: LocationComponent;

	get fillColor(): string {
		return this._fillColor;
	}
	set fillColor(newValue: string) {
		this._fillColor = newValue;
	}

	get opacity(): number {
		return this._opacity;
	}
	set opacity(newValue: number) {
		this._opacity = newValue;
	}

	get position(): LocationComponent {
		return this._position;
	}
	set position(newValue: LocationComponent) {
		this._position = newValue;
	}

	constructor(fillColor: string, opacity: number, position: LocationComponent) {
		this._fillColor = fillColor;
		this._opacity = opacity;
		this._position = position;
	}
}
