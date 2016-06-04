import {Controller} from "controller";
import {PhysicsBlock} from "physicsBlock";
import {MovingPoint, Point} from "point";
import {Sound} from "sound";
import {Volume} from "volume";
import {Orchestrator} from "entitySystem/orchestrator";
import {Entity} from "entitySystem/entity";
import {RenderComponent, RenderLayer, RectangleLayer, SpriteLayer} from "entitySystem/renderComponent";
import {ScoreComponent} from "entitySystem/scoreComponent";

export class Player extends PhysicsBlock {
	private static jumpSpeedIncrease: number = -8;
	private static jumpRotationSlowDown: number = 0.1;
	private static initialJumpRotationSpeed: number = 15;
	private static horizontalSpeedIncrease: number = 0.5;
	private static faceSwapThreshold: number = 3.5;

	private isJumping: boolean;
	private jumpRotationSpeed: number;

	private jump: Sound;
	private bounce: Sound;

	private bounceCount: number;

	public constructor(
		worldPosition: MovingPoint,
		dimensions: Point,
		color: string,
		controller: Controller,
		gravity: number,
		worldWidth: number,
		volume: Volume
	) {
		super(worldPosition, dimensions, color, gravity, volume, 7, worldWidth);

		this.bounceCount = 0;

		this.collisionComponent.onCollide.push(() => {
			// If we were jumping, thats over now
			this.isJumping = false;
			this.locationComponent.rotation = 0;
			this.jumpRotationSpeed = 0;
			this.bounce.play();
			this.bounceCount++;
		});

		let backgroundLayer: RectangleLayer = new RectangleLayer(() => {
			let xHexidecimal: string = Math.max(Math.round(15 - Math.abs(this.locationComponent.xSpeed)), 0).toString(16);
			let yHexidecimal: string = Math.max(Math.round(15 - Math.abs(this.locationComponent.ySpeed)), 0).toString(16);

			return "#" + yHexidecimal + yHexidecimal + "ff" + xHexidecimal + xHexidecimal;
		});
		let upSprite: SpriteLayer = SpriteLayer.FromPath("img/faceHappy.png");
		let downSprite: SpriteLayer = SpriteLayer.FromPath("img/faceWorried.png");
		let hoverSprite: SpriteLayer = SpriteLayer.FromPath("img/faceChill.png");

		let layerComposer: () => RenderLayer[] = () => {
			let layers: RenderLayer[] = [backgroundLayer];

			if (this.locationComponent.ySpeed > Player.faceSwapThreshold) {
				layers.push(downSprite);
			} else if (this.locationComponent.ySpeed < -Player.faceSwapThreshold) {
				layers.push(upSprite);
			} else {
				layers.push(hoverSprite);
			}

			return layers;
		};

		this.renderComponent = new RenderComponent(this.locationComponent, layerComposer, 1, 1);

		let jump: Function = (entity: Entity, orchestrator: Orchestrator, deltaTime: number) => {
			if (this.isJumping) {
				return;
			}

			this.jump.play();
			this.locationComponent.ySpeed = Player.jumpSpeedIncrease * deltaTime;
			this.isJumping = true;
			this.jumpRotationSpeed = this.direction === "right" ? Player.initialJumpRotationSpeed : -Player.initialJumpRotationSpeed;
		};
		let moveLeft: Function = (entity: Entity, orchestrator: Orchestrator, deltaTime: number) => {
			this.locationComponent.xSpeed -= (Player.horizontalSpeedIncrease * deltaTime);
		};
		let moveRight: Function = (entity: Entity, orchestrator: Orchestrator, deltaTime: number) => {
			this.locationComponent.xSpeed += (Player.horizontalSpeedIncrease * deltaTime);
		};

		this.inputComponent.getKeyHandler("up").push(jump);
		this.inputComponent.getKeyHandler("space").push(jump);
		this.inputComponent.getKeyHandler("w").push(jump);

		this.inputComponent.getKeyHandler("left").push(moveLeft);
		this.inputComponent.getKeyHandler("a").push(moveLeft);

		this.inputComponent.getKeyHandler("right").push(moveRight);
		this.inputComponent.getKeyHandler("d").push(moveRight);

		this.scoreComponent = new ScoreComponent(
			() => {
				return -this.locationComponent.top / 1000;
			},
			() => {
				return this.bounceCount;
			}
		);

		this.isJumping = false;

		this.jump = volume.createSound("snd/jump.wav", {});
		this.bounce = volume.createSound("snd/blip3.wav", {});
	}

	public Tick(deltaTime: number): void {
		super.Tick(deltaTime);

		// Apply jump rotation
		this.locationComponent.rotation += (this.jumpRotationSpeed * deltaTime);
		if (this.jumpRotationSpeed > 0) {
			this.jumpRotationSpeed = Math.max(0, this.jumpRotationSpeed - Player.jumpRotationSlowDown);
		} else if (this.jumpRotationSpeed < 0) {
			this.jumpRotationSpeed = Math.min(0, this.jumpRotationSpeed + Player.jumpRotationSlowDown);
		}

		this.locationComponent.rotation += this.locationComponent.xSpeed / 2;
	}

	public Reset(): void {
		super.Reset();

		this.isJumping = false;
		this.locationComponent.rotation = 0;
		this.jumpRotationSpeed = 0;
		this.bounceCount = 0;
	}
}
