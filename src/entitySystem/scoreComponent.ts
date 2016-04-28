export class ScoreComponent {
	private _points: number | Function;
	private _multiplier: number | Function;

	public get points(): number | Function {
		return this._points;
	}
	public set points(newPoints: number | Function) {
		this._points = newPoints;
	}

	public get pointsValue(): number {
		if (typeof this._points === "function") {
			return (this._points as Function)() as number;
		} else {
			return this._points as number;
		}
	}

	public get multiplier(): number | Function {
		return this._multiplier;
	}
	public set multiplier(newMultiplier: number | Function) {
		this._multiplier = newMultiplier;
	}

	public get multiplierValue(): number {
		if (typeof this._multiplier === "function") {
			return (this._multiplier as Function)() as number;
		} else {
			return this._multiplier as number;
		}
	}

	constructor(points: number | Function, multiplier: number | Function) {
		this._points = points;
		this._multiplier = multiplier;
	}
}
