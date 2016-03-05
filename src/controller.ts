/// <reference path="point.ts" />

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
	
	private mousePosition: Point;
	
	private clickLocation: Point;
	
	private canvas: HTMLCanvasElement;
	
	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		
		window.addEventListener("keyup", (event: KeyboardEvent) => {
			this.handleKeyUp(event);
		});
		
		window.addEventListener("keydown", (event: KeyboardEvent) => {
			this.handleKeyDown(event);
		});
		
		canvas.addEventListener("mousemove", (event: MouseEvent) => {
			this.handleMouseMove(event);
		});
		
		canvas.addEventListener("mousedown", (event: MouseEvent) => {
			this.handleMouseDown(event);
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
	
	private handleMouseMove(event: MouseEvent){
		let canvasElementPosition = this.canvas.getBoundingClientRect();
		this.mousePosition  = {
			x: event.clientX - canvasElementPosition.left,
			y: event.clientY - canvasElementPosition.top,
		};
	}
	
	private handleMouseDown(event: MouseEvent){
		let canvasElementPosition = this.canvas.getBoundingClientRect();
		this.clickLocation = {
			x: event.clientX - canvasElementPosition.left,
			y: event.clientY - canvasElementPosition.top,
		};
		
		event.preventDefault();
	}
	
	public isKeyPressed(key: string | string[]): boolean
	{
		let keys: string[] = [].concat(key);
		return keys.some((value: string) => {
			return this.isKeyPressedState[value]
		});
	}
	
	public getMousePosition(): Point
	{
		return this.mousePosition;
	}
	
	public getClickPosition(): Point
	{
		let clickLocation = this.clickLocation;
		this.clickLocation = undefined;
		return clickLocation;
	}
}