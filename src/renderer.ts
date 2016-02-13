/// <reference path="player.ts" />
/// <reference path="controller.ts" />
/// <reference path="point.ts" />
/// <reference path="collider.ts" />
/// <reference path="IRenderable.ts" />
/// <reference path="scoreboard.ts" />
/// <reference path="background.ts" />
/// <reference path="viewport.ts" />

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
	private scoreboard: Scoreboard;
	private intervalId: number;
	private background: Background;
	private viewport: Viewport;

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
			Renderer.gameWidth);
		
		this.background = new Background(
			{ x: 0, y: 0 },
			{ x: this.canvas.width, y: this.canvas.height },
			"#222222",
			this.player
		);
		
		let platformPosition: MovingPoint = {
			x: 30,
			y: 700,
			dX: 2,
			dY: 2
		};
		let platformDimensions: Point = {
			x: 90,
			y: 20
		}
		this.platform = new PhysicsBlock(
			platformPosition,
			platformDimensions,
			"#FFFFFF",
			-Renderer.defaultGravity,
			Renderer.gameWidth);
		
		let scoreboardPosition: MovingPoint = {
			x: 150,
			y: 20,
			dX: 0,
			dY: 0
		};
		let scoreboardDimensions: Point = {
			x: 0,
			y: 0
		}
		this.scoreboard = new Scoreboard(
			this.player,
			scoreboardPosition,
			scoreboardDimensions,
			"#333333"
		)
		
		this.viewport = new Viewport(
			this.context,
			[this.background, this.scoreboard],
			[],
			[this.player, this.platform]
		)
		
		this.player.onMove = (amountMoved: Point) => {
			if(this.player.yPosition < - (this.viewport.offset - 100))
			{
				this.viewport.SlideUp(amountMoved.y);
				this.background.SlideUp(amountMoved.y);
			}
		}
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
	
	private Draw() {
		this.context.fillStyle = "#111111";
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		
		this.viewport.Render();
	}
}