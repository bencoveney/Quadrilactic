/// <reference path="block.ts" />
/// <reference path="controller.ts" />

class Renderer {
	private static millisecondsPerTick = 13;
	
	// Rendering references
	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;

	private controller: Controller;

	// State
	private isRunning: boolean;
	private block: Block;
	private intervalId: number;

	constructor(canvas: HTMLCanvasElement, controller: Controller) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");

		this.controller = controller;

		this.block = new Block(30, 300, -2, -2, 30, 30, "#FF0000");
	}

	public Start() {
		if(this.intervalId)
		{
			this.Stop();
		}

		this.intervalId = setInterval(() => {
			this.Tick();
		}, Renderer.millisecondsPerTick);
	}
	
	public Stop() {
		clearInterval(this.intervalId);
		this.intervalId = null;
	}
	
	private Tick() {
		this.Clear();
		this.Draw();

		this.block.Tick(this.canvas.height, this.canvas.width, this.controller);
	}
	
	private Clear() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	
	private Draw() {
		this.block.Render(this.context);
	}
}