import {Player} from "player";
import {Controller} from "controller";
import {MovingPoint, Point} from "point";
import {Viewport} from "viewport";
import {Sound} from "sound";
import {Menu} from "menu";
import {Volume} from "volume";
import {Platform} from "platform";
import {Orchestrator} from "entitySystem/orchestrator";
import {LocationComponent, LocationType} from "entitySystem/locationComponent";
import {RenderComponent, RenderLayer, SpriteLayer, TextLayer, RectangleLayer} from "entitySystem/renderComponent";
import {ScoreSystem} from "entitySystem/scoreSystem";
import {GameStateSystem} from "entitySystem/gameStateSystem";
import {Entity} from "entitySystem/entity";
import {InputComponent} from "entitySystem/inputComponent";

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
	private menu: Menu;
	private viewport: Viewport;
	private lastTimestamp: number;
	private lastFps: number;
	private backgroundMusic: Sound;
	private deathSound: Sound;
	private volume: Volume;
	private controller: Controller;

	private orchestrator: Orchestrator;
	private gameStateSystem: GameStateSystem;

	constructor(canvas: HTMLCanvasElement, controller: Controller, orchestrator: Orchestrator) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.controller = controller;
		this.orchestrator = orchestrator;
		this.gameStateSystem = orchestrator.GetSystem("gameState") as GameStateSystem;

		this.volume = new Volume(
			{
				x: this.canvas.width,
				y: this.canvas.height
			},
			controller);

		this.backgroundMusic = this.volume.createSound("snd/music.wav", { isLooping: true });
		this.backgroundMusic.play();

		this.deathSound = this.volume.createSound("snd/death.wav", {});

		let scoreSystem: ScoreSystem = orchestrator.GetSystem("score") as ScoreSystem;

		let backgroundLayerFactory: (scrollRate: number, zIndex: number, spriteUrl: string) => void =
			(scrollRate: number, zIndex: number, spriteUrl: string) => {

			let layerHeight: number = canvas.height * 2;

			let backgroundLayerPosition: LocationComponent = new LocationComponent(
				0,
				0,
				canvas.width,
				layerHeight,
				0,
				0,
				0,
				LocationType.ui
			);

			let spriteLayers: RenderLayer[] = [
				SpriteLayer.FromPath(spriteUrl),
				SpriteLayer.FromPath(spriteUrl)
			];

			let backgroundSpritePainter: RenderComponent = new RenderComponent(
				backgroundLayerPosition,
				() => {
					let layerOffset: number = (this.viewport.offset % layerHeight) * scrollRate;

					spriteLayers[0].offsetY = layerOffset;
					spriteLayers[1].offsetY = layerOffset - (layerHeight);

					return spriteLayers;
				},
				1,
				zIndex
			);

			let entity: Entity = {
				locationComponent: backgroundLayerPosition,
				renderComponent: backgroundSpritePainter
			};
			orchestrator.Add(entity);
		};

		backgroundLayerFactory(0, 0, "img/staticBackground.png");
		backgroundLayerFactory(0.5, 0.1, "img/stars1.png");
		backgroundLayerFactory(1, 0.2, "img/stars2.png");

		this.gameStateSystem.OnGameState = (removables: Entity[]) => {
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
			removables.push(this.player);
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

				let entity: Entity = {
					locationComponent: scoreDisplayPosition,
					renderComponent: new RenderComponent(
						scoreDisplayPosition,
						[
							new TextLayer(text, "ffffff", "Oswald", size),
						],
						0.8,
						0.5)
				};
				removables.push(entity);
				orchestrator.Add(entity);
			};

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

			let upArrowPosition: LocationComponent = new LocationComponent(
				300,
				40,
				120,
				99,
				0,
				0,
				0,
				LocationType.world);

			let upArrowRender: RenderComponent = new RenderComponent(
				upArrowPosition,
				SpriteLayer.FromPath("img/upArrow.png"),
				0.5,
				0.3);

			let upArrowEntity: Entity = {
				locationComponent: upArrowPosition,
				renderComponent: upArrowRender
			};
			removables.push(upArrowEntity);
			orchestrator.Add(upArrowEntity);

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
			removables.push(this.platform);
			orchestrator.Add(this.platform);
			this.platform.viewport = this.viewport;

			let originalOnMove: (amountMoved: Point) => void = this.player.onMove;
			this.player.onMove = (amountMoved: Point) => {
				this.viewport.SlideUpTo(-this.player.locationComponent.yPosition + 50);

				if (this.player.locationComponent.yPosition > -(this.viewport.offset - this.canvas.height)) {
					this.isRunning = false;
					this.deathSound.play();
					this.gameStateSystem.EndGame();
					this.menu.showMenu(scoreSystem.totalScore, this.player.fillColor);
				}

				if (originalOnMove) {
					originalOnMove(amountMoved);
				}
			};
		};

		this.gameStateSystem.OnMenuState = (removables: Entity[]) => {

			let menuOpacity: number = 1;

			let titlePosition: LocationComponent = new LocationComponent(
				(Renderer.gameWidth / 2),
				140,
				0,
				0,
				0,
				0,
				0,
				LocationType.ui
			);

			let titleRender: RenderComponent = new RenderComponent(
				titlePosition,
				new TextLayer(
					"Quadrilactic",
					"#FFFFFF",
					"Oswald",
					90,
					true),
				() => menuOpacity,
				1);

			let titleText: Entity = {
				locationComponent: titlePosition,
				renderComponent: titleRender
			};

			removables.push(titleText);
			orchestrator.Add(titleText);

			let scorePosition: LocationComponent = new LocationComponent(
				(Renderer.gameWidth / 2),
				210,
				0,
				0,
				0,
				0,
				0,
				LocationType.ui);

			let currentScore: number = (orchestrator.GetSystem("score") as ScoreSystem).totalScore;

			let scoreRender: RenderComponent = new RenderComponent(
				scorePosition,
				() => {
					let result: RenderLayer[] = [];

					if (currentScore > 0) {
						result.push(new TextLayer(
							"Score: " + currentScore,
							"#FFFFFF",
							"Oswald",
							50,
							true));
					}

					return result;
				},
				() => menuOpacity,
				1);

			let scoreText: Entity = {
				locationComponent: scorePosition,
				renderComponent: scoreRender
			};

			removables.push(scoreText);
			orchestrator.Add(scoreText);

			let instructionsPosition: LocationComponent = new LocationComponent(
				45,
				300,
				390,
				237,
				0,
				0,
				0,
				LocationType.ui);

			let instructionsRender: RenderComponent = new RenderComponent(
				instructionsPosition,
				SpriteLayer.FromPath("img/controls.png"),
				() => menuOpacity,
				1);

			let instructionsImage: Entity = {
				locationComponent: instructionsPosition,
				renderComponent: instructionsRender
			};

			removables.push(instructionsImage);
			orchestrator.Add(instructionsImage);

			let playButtonWidth: number = 225;
			let playButtonHeight: number = 100;
			let playButtonLeft: number = (Renderer.gameWidth / 2) - (playButtonWidth / 2);
			let playButtonTop: number = 600;
			let playButtonTextSize: number = 50;

			let playButtonForegroundColor: string = "#000000";
			let playButtonBackgroundColor: string = "#FFFFFF";

			let playBackgroundPosition: LocationComponent = new LocationComponent(
				playButtonLeft,
				playButtonTop,
				playButtonWidth,
				playButtonHeight,
				0,
				0,
				0,
				LocationType.ui);

			let playBackgroundRender: RenderComponent = new RenderComponent(
				playBackgroundPosition,
				[
					new RectangleLayer(() => playButtonBackgroundColor)
				],
				() => menuOpacity,
				1);

			let playBackgroundInput: InputComponent = new InputComponent();
			playBackgroundInput.onMouseOver.push(() => {
				playButtonBackgroundColor = "#FF0000";
			});
			playBackgroundInput.onMouseOut.push(() => {
				playButtonBackgroundColor = "#FFFFFF";
			});

			let playBackground: Entity = {
				inputComponent: playBackgroundInput,
				locationComponent: playBackgroundPosition,
				renderComponent: playBackgroundRender
			};

			removables.push(playBackground);
			orchestrator.Add(playBackground);

			let playTextPosition: LocationComponent = new LocationComponent(
				Renderer.gameWidth / 2,
				playButtonTop + 70,
				playButtonWidth,
				playButtonHeight,
				0,
				0,
				0,
				LocationType.ui);

			let playTextRender: RenderComponent = new RenderComponent(
				playTextPosition,
				[
					new TextLayer(
						"Play",
						() => playButtonForegroundColor,
						"Oswald",
						playButtonTextSize,
						true)
				],
				() => menuOpacity,
				1);

			let playText: Entity = {
				locationComponent: playTextPosition,
				renderComponent: playTextRender
			};

			removables.push(playText);
			orchestrator.Add(playText);
		};

		this.menu = new Menu(
			{
				x: this.canvas.width,
				y: this.canvas.height
			},
			controller,
			() => {
				this.viewport.Reset();
				this.isRunning = true;

				this.gameStateSystem.StartGame();
				scoreSystem.ResetScore();
			},
			this.volume
		);

		this.viewport = new Viewport(
			this.context,
			this.orchestrator
		);
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
		}

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
