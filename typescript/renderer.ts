class Renderer {
	// Rendering references
	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;

	// State
	private isRunning: boolean;
	private x: number = 50;
	private y: number = 120;
	private intervalId: number;

	// Constants
	private static dx = 1;
	private static dy = 1;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
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

		this.x += Renderer.dx;
		this.y += Renderer.dy;
	}
	
	private Clear() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	
	private Draw() {
		// Filled Rectangle
		this.context.beginPath();
		this.context.rect(10, 20, 30, 40);
		this.context.fillStyle = "#FF0000";
		this.context.fill();
		this.context.closePath();

		// Filled Circle
		this.context.beginPath();
		this.context.arc(110, 120, 30, 0, Math.PI * 2, false);
		this.context.fillStyle = "#00FF00";
		this.context.fill();
		this.context.closePath();

		// Stroked Rectangle
		this.context.beginPath();
		this.context.rect(100, 20, 30, 40);
		this.context.strokeStyle = "rgba(0,0,255, 0.5)";
		this.context.stroke();
		this.context.closePath();

		// Stroked Circle (Positioned)
		this.context.beginPath();
		this.context.arc(this.x, this.y, 30, 0, Math.PI * 2, false);
		this.context.strokeStyle = "black";
		this.context.stroke();
		this.context.closePath();
	}
}