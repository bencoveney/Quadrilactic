import {CallbackArray} from "entitySystem/callbackArray";

interface KeyHandlers {
	[key: string]: CallbackArray;
}

export class InputComponent {
	private _keyHandlers: KeyHandlers = {};

	public get definedKeyHandlers(): KeyHandlers{
		return this._keyHandlers;
	}

	public getKeyHandler(key: string): CallbackArray {
		let foundHandler: CallbackArray = this._keyHandlers[key];

		// If one wasn't found, create it.
		if (!foundHandler) {
			foundHandler = new CallbackArray();
			this._keyHandlers[key] = foundHandler;
		}

		return foundHandler;
	}
}
