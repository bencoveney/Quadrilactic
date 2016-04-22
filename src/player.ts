import {Controller} from "controller";
import {PhysicsBlock} from "physicsBlock";
import {MovingPoint, Point, Rectangle} from "point";
import {Renderable} from "renderable";
import {Sprite} from "sprite";
import {Sound} from "sound";
import {Volume} from "volume";
import {Particle} from "particle";
import {Orchestrator} from "entitySystem/orchestrator";

export class Player extends PhysicsBlock {
	private static jumpSpeedIncrease: number = -8;
	private static degrees: number = Math.PI / 180;
	private static jumpRotationSlowDown: number = 0.1;
	private static initialJumpRotationSpeed: number = 15;
	private static horizontalSpeedIncrease: number = 0.5;
	private static faceSwapThreshold: number = 3.5;

	private isJumping: boolean;
	private jumpRotationSpeed: number;
	private controller: Controller;

	private jump: Sound;
	private bounce: Sound;
	private faceUp: Sprite;
	private faceDown: Sprite;
	private faceHover: Sprite;

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

		let originalCollisionHandler: Function = this.collisionComponent.collisionCallback;
		this.collisionComponent.collisionCallback = () => {
			originalCollisionHandler();

			// If we were jumping, thats over now
			this.isJumping = false;
			this.locationComponent.rotation = 0;
			this.jumpRotationSpeed = 0;
			this.bounce.play();
		};

		this.controller = controller;
		this.isJumping = false;

		this.faceUp = new Sprite("img/faceHappy.png", dimensions);
		this.faceDown = new Sprite("img/faceWorried.png", dimensions);
		this.faceHover = new Sprite("img/faceChill.png", dimensions);

		this.jump = volume.createSound("snd/jump.wav", {});
		this.bounce = volume.createSound("snd/blip3.wav", {});
	}

	public Tick(deltaTime: number): void {
		super.Tick(deltaTime);

		// Perform the jump
		if (!this.isJumping && this.controller.isKeyPressed(["up", "space", "w"])) {
			this.jump.play();
			this.locationComponent.ySpeed = Player.jumpSpeedIncrease * deltaTime;
			this.isJumping = true;
			this.jumpRotationSpeed = this.direction === "right" ? Player.initialJumpRotationSpeed : -Player.initialJumpRotationSpeed;
		}

		// Allow influence over horizontal direction
		if (this.controller.isKeyPressed(["left", "a"])) {
			this.locationComponent.xSpeed -= (Player.horizontalSpeedIncrease * deltaTime);
		}
		if (this.controller.isKeyPressed(["right", "d"])) {
			this.locationComponent.xSpeed += (Player.horizontalSpeedIncrease * deltaTime);
		}

		// Apply jump rotation
		this.locationComponent.rotation += (this.jumpRotationSpeed * deltaTime);
		if (this.jumpRotationSpeed > 0) {
			this.jumpRotationSpeed = Math.max(0, this.jumpRotationSpeed - Player.jumpRotationSlowDown);
		} else if (this.jumpRotationSpeed < 0) {
			this.jumpRotationSpeed = Math.min(0, this.jumpRotationSpeed + Player.jumpRotationSlowDown);
		}

		this.locationComponent.rotation += this.locationComponent.xSpeed / 2;
	}

	public Render(renderContext: CanvasRenderingContext2D, orchestrator: Orchestrator): Renderable[] {
		renderContext.save();

		renderContext.translate(this.locationComponent.centerXPosition, this.locationComponent.centerYPosition);
		renderContext.rotate(this.locationComponent.rotation * Player.degrees);
		renderContext.translate(-this.locationComponent.centerXPosition, -this.locationComponent.centerYPosition);

		let faceSprite: Sprite;

		if (this.locationComponent.ySpeed > Player.faceSwapThreshold) {
			faceSprite = this.faceDown;
		} else if (this.locationComponent.ySpeed < -Player.faceSwapThreshold) {
			faceSprite = this.faceUp;
		} else {
			faceSprite = this.faceHover;
		}

		let xHexidecimal: string = Math.max(Math.round(15 - Math.abs(this.locationComponent.xSpeed)), 0).toString(16);
		let yHexidecimal: string = Math.max(Math.round(15 - Math.abs(this.locationComponent.ySpeed)), 0).toString(16);

		this.fillColor = "#" + yHexidecimal + yHexidecimal + "ff" + xHexidecimal + xHexidecimal;

		let newRenderables: Renderable[] = super.Render(renderContext, orchestrator);

		newRenderables.forEach((renderable: Renderable) => {
			(renderable as Particle).rotation = this.locationComponent.rotation;
		});

		renderContext.restore();

		renderContext.save();
		renderContext.translate(this.locationComponent.centerXPosition, this.locationComponent.centerYPosition);
		renderContext.rotate(this.locationComponent.rotation * Player.degrees);
		renderContext.translate(-this.locationComponent.centerXPosition, -this.locationComponent.centerYPosition);

		let skewedPosition: Rectangle = this.skewedPosition;

		renderContext.translate(skewedPosition.x, skewedPosition.y);

		faceSprite.dimensions = {
			x: skewedPosition.width,
			y: skewedPosition.height
		};

		newRenderables = newRenderables.concat(faceSprite.Render(renderContext, orchestrator));

		renderContext.restore();

		return newRenderables;
	}

	public Reset(): void {
		super.Reset();

		this.isJumping = false;
		this.locationComponent.rotation = 0;
		this.jumpRotationSpeed = 0;
	}
}
