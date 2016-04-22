import {LocationComponent} from "entitySystem/LocationComponent";
import {CallbackArray} from "entitySystem/callbackArray";

export class CollisionComponent {
	// Data members.
	private _position: LocationComponent;
	private _onCollide: CallbackArray = new CallbackArray();

	get position(): LocationComponent {
		return this._position;
	}
	set position(newValue: LocationComponent) {
		this._position = newValue;
	}

	get onCollide(): CallbackArray {
		return this._onCollide;
	}

	constructor(position: LocationComponent) {
		this._position = position;
	}
}
