import {Player} from "player";
import {Controller} from "controller";
import {MovingPoint, Point} from "point";
import {Background} from "background";
import {Viewport} from "viewport";
import {Sound} from "sound";
import {Menu} from "menu";
import {Volume} from "volume";
import {Platform} from "platform";
import {Orchestrator} from "entitySystem/orchestrator";
import {LocationComponent, LocationType} from "entitySystem/locationComponent";
import {RenderComponent, TextLayer} from "entitySystem/renderComponent";
import {ScoreSystem} from "entitySystem/scoreSystem";

export class Renderer {
	// Constants
	private static defaultGravity: number = 0.2;
	private static gameWidth: number = 480;
	private static timescale: number = 16;

	// Rendering references
	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;

	// State
	private isRunning: boolean = false;
	private player: Player;
	private platform: Platform;
	private background: Background;
	private menu: Menu;
	private viewport: Viewport;
	private lastTimestamp: number;
	private lastFps: number;
	private backgroundMusic: Sound;
	private deathSound: Sound;
	private volume: Volume;
	private controller: Controller;

	private orchestrator: Orchestrator;

	constructor(canvas: HTMLCanvasElement, controller: Controller, orchestrator: Orchestrator) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.controller = controller;
		this.orchestrator = orchestrator;

		this.volume = new Volume(
			{
				x: this.canvas.width,
				y: this.canvas.height
			},
			controller);

		this.backgroundMusic = this.volume.createSound("snd/music.wav", { isLooping: true });
		this.backgroundMusic.play();

		this.deathSound = this.volume.createSound("snd/death.wav", {});

		let playerPosition: MovingPoint = {
			dX: 2,
			dY: -2,
			x: 30,
			y: 110
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
			Renderer.gameWidth,
			this.volume);
		orchestrator.Add(this.player);

		let scoreDisplayFactory: (text: () => string, size: number,
			verticalOffset: number) => void = (text: () => string,
			size: number, verticalOffset: number) => {

			let scoreDisplayPosition: LocationComponent = new LocationComponent(
				20,
				canvas.height - verticalOffset - 20,
				0,
				0,
				0,
				0,
				0,
				LocationType.ui);

			orchestrator.Add({
				locationComponent: scoreDisplayPosition,
				renderComponent: new RenderComponent(
					scoreDisplayPosition,
					[
						new TextLayer(text, "ffffff", "Oswald", size),
					],
					0.8)
			});
		};

		let scoreSystem: ScoreSystem = orchestrator.GetSystem("score") as ScoreSystem;
		scoreDisplayFactory(
			() => {
				return scoreSystem.multiplier.toString();
			},
			200,
			200);
		scoreDisplayFactory(
			() => {
				return "x " + scoreSystem.points.toString();
			},
			100,
			100);
		scoreDisplayFactory(
			() => {
				return "~ " + scoreSystem.totalScore.toString();
			},
			100,
			0);

		this.background = new Background(
			{ x: 0, y: 0 },
			{ x: this.canvas.width, y: this.canvas.height },
			"#222222",
			this.player
		);

		let platformPosition: MovingPoint = {
			dX: 2,
			dY: 2,
			x: 30,
			y: 690
		};
		let platformDimensions: Point = {
			x: 90,
			y: 20
		};
		this.platform = new Platform(
			platformPosition,
			platformDimensions,
			"#FFFFFF",
			-Renderer.defaultGravity,
			this.volume,
			Renderer.gameWidth);
		orchestrator.Add(this.platform);

		this.menu = new Menu(
			{
				x: this.canvas.width,
				y: this.canvas.height
			},
			controller,
			this.background,
			() => {
				this.player.Reset();
				this.platform.Reset();
				this.viewport.Reset();
				this.background.Reset();
				this.isRunning = true;

				scoreSystem.ResetScore();
			},
			this.volume
		);

		this.viewport = new Viewport(
			this.context,
			[this.background],
			[],
			[this.player, this.platform],
			this.orchestrator
		);

		this.platform.viewport = this.viewport;

		let originalOnMove: (amountMoved: Point) => void = this.player.onMove;
		this.player.onMove = (amountMoved: Point) => {
			this.viewport.SlideUpTo(-this.player.locationComponent.yPosition + 50);
			this.background.SlideUpTo(-this.player.locationComponent.yPosition);

			if (this.player.locationComponent.yPosition > -(this.viewport.offset - this.canvas.height)) {
				this.isRunning = false;
				this.deathSound.play();
				this.menu.showMenu(scoreSystem.totalScore, this.player.fillColor);
			}

			if (originalOnMove) {
				originalOnMove(amountMoved);
			}
		};
	}

	public Start(): void {
		requestAnimationFrame((time: number) => { this.Tick(time); });
	}

	private Tick(timestamp: number): void {
		let deltaTime: number = this.lastTimestamp ? (timestamp - this.lastTimestamp) : 0;
		let scaledTime: number = deltaTime / Renderer.timescale;
		this.lastTimestamp = timestamp;
		this.lastFps = Math.round(1000 / deltaTime);

		this.Draw();

		this.orchestrator.Tick(1);

		if (this.isRunning === true) {
			this.player.Tick(scaledTime);
			this.platform.Tick(scaledTime);
			// Collider.processCollisions([this.player, this.platform]);
		}

		this.controller.clearClick();

		requestAnimationFrame((time: number) => { this.Tick(time); });
	}

	private Draw(): void {
		if (this.isRunning) {
			this.viewport.Render(this.lastFps);
		} else {
			this.menu.Render(this.context, this.orchestrator);
		}

		this.volume.Render(this.context, this.orchestrator);
	}
}
