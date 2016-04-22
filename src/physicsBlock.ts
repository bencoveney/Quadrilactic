import {Block} from "block";
import {MovingPoint, Point} from "point";
import {Renderable} from "renderable";
import {Sound} from "sound";
import {Volume} from "volume";
import {Orchestrator} from "entitySystem/orchestrator";

export class PhysicsBlock extends Block {

	private internalGravity: number;
	private worldWidth: number;

	private rebound: Sound;

	public get gravity(): number {
		return this.internalGravity;
	}
	public set gravity(newValue: number) {
		this.internalGravity = newValue;
	}

	public constructor(
		worldPosition: MovingPoint,
		dimensions: Point,
		color: string,
		gravity: number,
		volume: Volume,
		xSpeedLimit: number,
		worldWidth?: number
	) {
		super(worldPosition, dimensions, color, xSpeedLimit);

		this.internalGravity = gravity;
		this.worldWidth = worldWidth;

		this.rebound = volume.createSound("snd/blip.wav", {});

		this.collisionComponent.collisionCallback = () => {
			this.skew += 10;
		};
	}

	public Tick(deltaTime: number): void {
		super.Tick(deltaTime);

		// If off the right, bounce left
		if (this.locationComponent.right > this.worldWidth) {
			this.rebound.play();

			// Clamp on screen, invert horizontal speed
			this.skew += 3;
			this.locationComponent.xPosition = this.worldWidth - this.locationComponent.width;
			this.locationComponent.xSpeed = -Math.abs(this.locationComponent.xSpeed);
		}

		// If off the left, bounce right
		if (this.locationComponent.left < 0) {
			this.rebound.play();

			// Clamp on screen, invert horizontal speed
			this.locationComponent.xPosition = 0;
			this.skew += 3;
			this.locationComponent.xSpeed = Math.abs(this.locationComponent.xSpeed);
		}

		// Apply acceleration due to gravity
		this.locationComponent.ySpeed += (this.internalGravity * deltaTime);
	}

	public Render(renderContext: CanvasRenderingContext2D, orchestrator: Orchestrator): Renderable[] {
		return super.Render(renderContext, orchestrator);
	}

	public Reset(): void {
		super.Reset();
	}
}
