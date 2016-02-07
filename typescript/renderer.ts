/// <reference path="player.ts" />
/// <reference path="controller.ts" />
/// <reference path="point.ts" />
/// <reference path="collider.ts" />
/// <reference path="IRenderable.ts" />

class Renderer {
	// Constants
	private static defaultGravity: number = 0.2;
	private static millisecondsPerTick = 13;
	private static gameWidth = 480;
	private static gameHeight = 800;
	
	// Rendering references
	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;

	// State
	private isRunning: boolean;
	private player: Player;
	private platform: PhysicsBlock;
	private intervalId: number;
	private renderables: IRenderable[];

	constructor(canvas: HTMLCanvasElement, controller: Controller) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");

		let gameLeft = (this.canvas.width - Renderer.gameWidth) / 2;
		
		let playerPosition: MovingPoint = {
			x: 30,
			y: 100,
			dX: 2,
			dY: -2
		};
		let playerDimensions: Point = {
			x: 30,
			y: 30
		};
		this.player = new Player(
			playerPosition,
			playerDimensions,
			"#FF0000",
			controller,
			Renderer.defaultGravity,
			{
				x: Renderer.gameWidth,
				y: Renderer.gameHeight
			});
		
		let platformPosition: MovingPoint = {
			x: 30,
			y: 700,
			dX: 2,
			dY: 2
		};
		let platformDimensions: Point = {
			x: 60,
			y: 20
		}
		this.platform = new PhysicsBlock(
			platformPosition,
			platformDimensions,
			"#00FF00",
			-Renderer.defaultGravity,
			{
				x: Renderer.gameWidth,
				y: Renderer.gameHeight
			});
			
		this.renderables = [];
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
		this.Draw();
		this.player.Tick();
		this.platform.Tick();
		Collider.processCollisions([this.player, this.platform]);
	}
	
	private Clear() {
	}
	
	private Draw() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		let newRenderables: IRenderable[] = [];
		
		this.renderables.forEach((renderable: IRenderable) => {
			newRenderables = newRenderables.concat(renderable.Render(this.context));
		});
		
		newRenderables = newRenderables.concat(
			this.player.Render(this.context),
			this.platform.Render(this.context));
		
		this.renderables = this.renderables.concat(newRenderables).filter((renderable: IRenderable) => {
			return renderable.isAlive;
		});
	}
}