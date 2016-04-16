export class RenderComponent {
	// Data members.
	private _fillColor: string;
	private _opacity: number;

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

	constructor(fillColor: string, opacity: number) {
		this._fillColor = fillColor;
		this._opacity = opacity;
	}
}
