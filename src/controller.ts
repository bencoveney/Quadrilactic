class Controller {
	private static keyCodes = {
		32: "space",
		37: "left",
		38: "up",
		39: "right",
		65: "a",
		68: "d",
		87: "w"
	}
	
	private isKeyPressedState = {
		space: false,
		left: false,
		up: false,
		right: false,
		a: false,
		d: false,
		w: false
	};
	
	constructor() {
		window.addEventListener("keyup", (event: KeyboardEvent) => {
			this.handleKeyUp(event)
		});
		
		window.addEventListener("keydown", (event: KeyboardEvent) => {
			this.handleKeyDown(event)
		});
	}

	private handleKeyUp(event: KeyboardEvent){
		let key = Controller.keyCodes[event.keyCode];
		this.isKeyPressedState[key] = false;
	}

	private handleKeyDown(event: KeyboardEvent){
		let key = Controller.keyCodes[event.keyCode];
		this.isKeyPressedState[key] = true;
	}
	
	public isKeyPressed(key: string | string[]): boolean
	{
		let keys: string[] = [].concat(key);
		return keys.some((value: string) => {
			return this.isKeyPressedState[value]
		});
	}
}