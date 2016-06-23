import {CallbackArray} from "entitySystem/callbackArray";

interface KeyHandlers {
	[key: string]: CallbackArray;
}

export class InputComponent {
	private _keyHandlers: KeyHandlers = {};

	private _onMouseOver: CallbackArray = new CallbackArray();
	private _onMouseOut: CallbackArray = new CallbackArray();
	private _onMouseClick: CallbackArray = new CallbackArray();

	private _isMouseOver: boolean;
	private _isMouseDown: boolean;

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

	public get onMouseOver(): CallbackArray
	{
		return this._onMouseOver;
	}
	public get onMouseOut(): CallbackArray
	{
		return this._onMouseOut;
	}
	public get onMouseClick(): CallbackArray
	{
		return this._onMouseClick;
	}

	public get isMouseOver(): boolean {
		return this._isMouseOver;
	}
	public set isMouseOver(newValue: boolean) {
		this._isMouseOver = newValue;
	}

	public get isMouseDown(): boolean {
		return this._isMouseDown;
	}
	public set isMouseDown(newValue: boolean) {
		this._isMouseDown = newValue;
	}
}
