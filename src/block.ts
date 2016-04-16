import {MovingPoint, Point, Rectangle} from "point";
import {Renderable} from "renderable";
import {Particle} from "particle";
import {Entity} from "entitySystem/entity";
import {LocationComponent} from "entitySystem/locationComponent";

export class Block implements Renderable, Entity {
	// Constants
	private static verticalSpeedLimit: number = 10;
	private static verticalSpeedLimitDelta: number = 0.01;
	private static skewScale: number = 0.07;
	private static skewReduction: number= 0.3;

	public isAlive: boolean = true;

	protected skew: number;

	// Private members
	public locationComponent: LocationComponent;

	private internalColor: string;
	private onMoveCallback: (amountMoved: Point) => void;
	private initialWorldPosition: MovingPoint;
	private verticalSpeedLimit: number;
	private horizontalSpeedLimit: number;

	get fillColor(): string {
		return this.internalColor;
	}
	set fillColor(newValue: string) {
		this.internalColor = newValue;
	}

	get onMove(): (amountMoved: Point) => void {
		return this.onMoveCallback;
	}
	set onMove(newValue: (amountMoved: Point) => void) {
		this.onMoveCallback = newValue;
	}

	get skewedPosition(): Rectangle
	{
		let skewAdjustment: number = this.skew === 0 ? 0 : Math.sin(this.skew);
		skewAdjustment = skewAdjustment * this.skew;

		let widthAdjustment: number = (skewAdjustment * this.locationComponent.width * Block.skewScale);
		let heightAdjustment: number = (skewAdjustment * this.locationComponent.height * Block.skewScale);

		return {
			height: this.locationComponent.height + heightAdjustment,
			width: this.locationComponent.width - widthAdjustment,
			x: this.locationComponent.xPosition + (widthAdjustment / 2),
			y: this.locationComponent.yPosition - (heightAdjustment / 2)
		};
	}

	// Direction properties
	get direction(): string {
		return this.locationComponent.xSpeed >= 0 ? "right" : "left";
	}

	public constructor(worldPosition: MovingPoint, dimensions: Point, color: string, xSpeedLimit: number) {

		this.locationComponent = new LocationComponent(
			worldPosition.x,
			worldPosition.y,
			dimensions.x,
			dimensions.y,
			worldPosition.dX,
			worldPosition.dY);

		this.internalColor = color;
		this.horizontalSpeedLimit = xSpeedLimit;

		this.verticalSpeedLimit = Block.verticalSpeedLimit;

		this.initialWorldPosition = {
			dX: worldPosition.dX,
			dY: worldPosition.dY,
			x: worldPosition.x,
			y: worldPosition.y
		};

		this.skew = 0;
	}

	public Tick(deltaTime: number): void {
		// Move "forward".
		this.locationComponent.xPosition += (this.locationComponent.xSpeed * deltaTime);
		this.locationComponent.yPosition += (this.locationComponent.ySpeed * deltaTime);

		if (this.onMoveCallback) {
			// The amount moved this tick is the same as the speed.
			this.onMoveCallback({ x: this.locationComponent.xSpeed, y: this.locationComponent.ySpeed });
		}

		this.skew = Math.max(0, this.skew - (Block.skewReduction * deltaTime));

		this.verticalSpeedLimit += Block.verticalSpeedLimitDelta * deltaTime;

		// Clamp the speed to the speed limit.
		this.locationComponent.ySpeed = Math.min(this.locationComponent.ySpeed, this.verticalSpeedLimit);
		this.locationComponent.ySpeed = Math.max(this.locationComponent.ySpeed, -this.verticalSpeedLimit);
		this.locationComponent.xSpeed = Math.min(this.locationComponent.xSpeed, this.horizontalSpeedLimit );
		this.locationComponent.xSpeed = Math.max(this.locationComponent.xSpeed, -this.horizontalSpeedLimit );
	}

	public Render(renderContext: CanvasRenderingContext2D): Renderable[] {

		renderContext.beginPath();

		let skewedPosition: Rectangle = this.skewedPosition;

		renderContext.rect(
			skewedPosition.x,
			skewedPosition.y,
			skewedPosition.width,
			skewedPosition.height);

		renderContext.fillStyle = this.fillColor;
		renderContext.fill();

		renderContext.closePath();

		let particle: Particle = new Particle(
			skewedPosition.x,
			skewedPosition.y,
			skewedPosition.width,
			skewedPosition.height,
			0,
			this.fillColor,
			0.1);

		return [particle] as Renderable[];
	}

	public Reset(): void {
		this.locationComponent.xPosition = this.initialWorldPosition.x;
		this.locationComponent.yPosition = this.initialWorldPosition.y;
		this.locationComponent.xSpeed = this.initialWorldPosition.dX;
		this.locationComponent.ySpeed = this.initialWorldPosition.dY;

		this.verticalSpeedLimit = Block.verticalSpeedLimit;
	}
}
