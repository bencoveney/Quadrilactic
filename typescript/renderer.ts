/// <reference path="block.ts" />

class Renderer {
	// Rendering references
	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;

	// State
	private isRunning: boolean;
	private block: Block;
	private intervalId: number;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.block = new Block(30, 300, -2, -2, 30, 30, "#FF0000");
	}

	public Start() {
		if(this.intervalId)
		{
			this.Stop();
		}

		this.intervalId = setInterval(() => {
			this.Tick();
		}, 10);
	}
	
	public Stop() {
		clearInterval(this.intervalId);
		this.intervalId = null;
	}
	
	private Tick() {
		this.Clear();
		this.Draw();

		this.block.Tick(this.canvas.height, this.canvas.width);
	}
	
	private Clear() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	
	private Draw() {
		this.block.Render(this.context);
	}
}