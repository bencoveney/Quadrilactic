/// <reference path="player.ts" />
/// <reference path="controller.ts" />
/// <reference path="point.ts" />

class Renderer {
	private static millisecondsPerTick = 13;
	private static floorHeight = 0;
	
	// Rendering references
	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;

	// State
	private isRunning: boolean;
	private player: Player;
	private platform: PhysicsBlock;
	private intervalId: number;

	constructor(canvas: HTMLCanvasElement, controller: Controller) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		
		let blockPosition: MovingPoint = {
			x: 30,
			y: 300,
			dX: -2,
			dY: -2
		};
		let blockDimensions: Point = {
			x: 30,
			y: 30
		};
		this.player = new Player(blockPosition, blockDimensions, "#FF0000", controller, undefined, {
			x: this.canvas.width,
			y: this.canvas.height - Renderer.floorHeight
		});
		
		let platformPosition: MovingPoint = {
			x: 30,
			y: 500,
			dX: -2,
			dY: -2
		};
		let platformDimensions: Point = {
			x: 60,
			y: 20
		}
		this.platform = new PhysicsBlock(platformPosition, platformDimensions, "#00FF00", -0.2, {
			x: this.canvas.width,
			y: this.canvas.height
		});
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

		this.player.Tick();
		
		this.platform.Tick();
	}
	
	private Clear() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	
	private Draw() {
		this.player.Render(this.context);
		this.platform.Render(this.context);
	}
}