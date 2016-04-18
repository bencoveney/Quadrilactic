import {LocationComponent} from "entitySystem/LocationComponent";

export class CollisionComponent {
	// Data members.
	private _position: LocationComponent;
	private _collisionCallback: Function;

	get position(): LocationComponent {
		return this._position;
	}
	set position(newValue: LocationComponent) {
		this._position = newValue;
	}

	get collisionCallback(): Function {
		return this._collisionCallback;
	}
	set collisionCallback(newValue: Function) {
		this._collisionCallback = newValue;
	}

	constructor(position: LocationComponent, collisionCallback?: Function) {
		this._position = position;
		this._collisionCallback = collisionCallback;
	}
}
