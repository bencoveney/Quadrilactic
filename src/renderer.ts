/// <reference path="player.ts" />
/// <reference path="controller.ts" />
/// <reference path="point.ts" />
/// <reference path="collider.ts" />
/// <reference path="IRenderable.ts" />
/// <reference path="scoreboard.ts" />
/// <reference path="background.ts" />
/// <reference path="viewport.ts" />
/// <reference path="sound.ts" />

class Renderer {
	// Constants
	private static defaultGravity: number = 0.2;
	private static millisecondsPerTick = 13;
	private static gameWidth = 480;
	private static gameHeight = 800;
	private static minimumPlatformReboundSpeed = 10;
	private static timescale = 16;
	
	// Rendering references
	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;

	// State
	private isRunning: boolean = false;
	private player: Player;
	private platform: PhysicsBlock;
	private scoreboard: Scoreboard;
	private background: Background;
	private viewport: Viewport;
	private lastTimestamp: number;
	private lastFps: number;
	private backgroundMusic: Sound;

	constructor(canvas: HTMLCanvasElement, controller: Controller) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		
		this.backgroundMusic = new Sound("snd/music.wav", { isLooping: true });
		this.backgroundMusic.play();

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
		this.platform.onBounce = () => {
			if(this.platform.ySpeed < Renderer.minimumPlatformReboundSpeed)
			{
				this.platform.ySpeed = Renderer.minimumPlatformReboundSpeed;
			}
		};

		let scoreboardPosition: MovingPoint = {
			x: 20,
			y: 370,
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
			"rgba(255,255,255, 0.1)"
		)

		this.viewport = new Viewport(
			this.context,
			[this.background, this.scoreboard],
			[],
			[this.player, this.platform]
		)

		let originalOnMove = this.player.onMove
		this.player.onMove = (amountMoved: Point) => {
			if(this.player.yPosition < - (this.viewport.offset - 100))
			{
				this.viewport.SlideUp(amountMoved.y);
				this.background.SlideUp(amountMoved.y);
			}

			if(originalOnMove)
			{
				originalOnMove(amountMoved);
			}
		}
	}

	public Start() {
		if(this.isRunning)
		{
			return;
		}

		this.isRunning = true;
		requestAnimationFrame((time: number) => { this.Tick(time); });
	}

	public Stop() {
		this.isRunning = false;
	}

	private Tick(timestamp: number) {
		let deltaTime = this.lastTimestamp ? (timestamp - this.lastTimestamp) : 0;
		let scaledTime = deltaTime / Renderer.timescale
		this.lastTimestamp = timestamp;
		this.lastFps = Math.round(1000 / deltaTime);
		
		this.Draw();
		this.player.Tick(scaledTime);
		this.platform.Tick(scaledTime);
		Collider.processCollisions([this.player, this.platform]);

		if(this.isRunning)
		{
			requestAnimationFrame((time: number) => { this.Tick(time); });
		}
	}

	private Draw() {
		this.context.fillStyle = "#111111";
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.viewport.Render();
		
		this.context.fillStyle = '#FFFFFF';
		this.context.fillText("FPS: " + this.lastFps.toString(), 0, 10);
	}
}