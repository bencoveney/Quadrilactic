import {PhysicsBlock} from "physicsBlock";
import {MovingPoint, Point} from "point";
import {Renderable} from "renderable";
import {Viewport} from "viewport";
import {Volume} from "volume";
import {Orchestrator} from "entitySystem/orchestrator";

export class Platform extends PhysicsBlock {
	private static platformSpeedIncrease: number = 1000;

	public viewport: Viewport;

	private get bottomOfScreen(): number {
		return this.viewport.renderDimensions.y - this.viewport.offset;
	}

	private get offscreenAmount(): number {
		return Math.max(this.locationComponent.top - this.bottomOfScreen, 0);
	}

	public constructor(
		worldPosition: MovingPoint,
		dimensions: Point,
		color: string,
		gravity: number,
		volume: Volume,
		worldWidth: number
	) {
		super(worldPosition, dimensions, color, gravity, volume, 10, worldWidth);
	}

	public Tick(deltaTime: number): void {
		this.locationComponent.xSpeed =
			this.locationComponent.xSpeed * (
				(Platform.platformSpeedIncrease + deltaTime) / Platform.platformSpeedIncrease);

		super.Tick(deltaTime);
	}

	public Render(renderContext: CanvasRenderingContext2D, orchestrator: Orchestrator): Renderable[] {
		if (this.offscreenAmount <= 0) {
			return super.Render(renderContext, orchestrator);
		} else {
			renderContext.save();

			renderContext.fillStyle = this.fillColor;

			renderContext.globalAlpha = 0.2;
			renderContext.fillRect(
				this.locationComponent.left,
				this.bottomOfScreen - this.locationComponent.height,
				this.locationComponent.width,
				this.locationComponent.height
			);

			renderContext.globalAlpha = 1;
			renderContext.fillRect(
				this.locationComponent.left,
				this.bottomOfScreen - this.locationComponent.height,
				((this.offscreenAmount / 10) % this.locationComponent.width),
				this.locationComponent.height
			);

			renderContext.restore();

			return [];
		}
	}
}
