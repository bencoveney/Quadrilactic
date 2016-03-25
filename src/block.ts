/// <reference path="controller.ts" />
/// <reference path="point.ts" />
/// <reference path="IRenderable.ts" />
/// <reference path="particle.ts"" />

class Block implements IRenderable {
	// Constants
	private static verticalSpeedLimit = 10;
	private static verticalSpeedLimitDelta = 0.01;
	private static horizontalSpeedSlowDown = 0.1;
	private static skewScale = 0.07;
	private static skewReduction = 0.3;

	// Private members
	private worldPosition: MovingPoint;
	private dimensions: Point;
	private internalColor: string;
	private onMoveCallback: (amountMoved: Point) => void;
	private initialWorldPosition: MovingPoint;
	private verticalSpeedLimit: number;
	protected skew: number;
	private horizontalSpeedLimit: number;

	public isAlive = true;

	// Position properties
	get xPosition(): number {
		return this.worldPosition.x;
	}
	set xPosition(newValue: number) {
		this.worldPosition.x = newValue;
	}
	get yPosition(): number {
		return this.worldPosition.y;
	}
	set yPosition(newValue: number) {
		this.worldPosition.y = newValue;
	}

	get xSpeed(): number {
		return this.worldPosition.dX;
	}
	set xSpeed(newValue: number) {
		this.worldPosition.dX = newValue;
	}
	get ySpeed(): number {
		return this.worldPosition.dY;
	}
	set ySpeed(newValue: number) {
		this.worldPosition.dY = newValue;
	}

	get width(): number {
		return this.dimensions.x;
	}
	get height(): number {
		return this.dimensions.y;
	}

	get fillColor(): string {
		return this.internalColor;
	}
	set fillColor(newValue: string) {
		this.internalColor = newValue;
	}

	get left(): number {
		return this.worldPosition.x;
	}
	get right(): number {
		return this.worldPosition.x + this.dimensions.x;
	}
	get top(): number {
		return this.worldPosition.y;
	}
	get bottom(): number {
		return this.worldPosition.y + this.dimensions.y;
	}
	get centerXPosition(): number {
		return this.left + (this.width / 2);
	}
	get centerYPosition(): number {
		return this.top + (this.height / 2);
	}

	get onMove(): (amountMoved: Point) => void {
		return this.onMoveCallback;
	}
	set onMove(newValue: (amountMoved: Point) => void) {
		this.onMoveCallback = newValue;
	}
	
	get skewedPosition(): {
		x: number,
		y: number,
		width: number,
		height: number
	}
	{
		let skewAdjustment = this.skew == 0 ? 0 : Math.sin(this.skew);
		skewAdjustment = skewAdjustment * this.skew;

		let widthAdjustment = (skewAdjustment * this.width * Block.skewScale);
		let heightAdjustment = (skewAdjustment * this.height * Block.skewScale);

		return {
			x: this.xPosition + (widthAdjustment / 2),
			y: this.yPosition - (heightAdjustment / 2),
			width: this.width - widthAdjustment,
			height: this.height + heightAdjustment
		};
	}

	// Direction properties
	get direction(): string {
		return this.xSpeed >= 0 ? "right" : "left";
	}

	// Constants
	private static strokeColor: string = "#000000";

	public constructor(worldPosition: MovingPoint, dimensions: Point, color: string, xSpeedLimit: number) {
		this.worldPosition = worldPosition;
		this.dimensions = dimensions;
		this.internalColor = color;
		this.horizontalSpeedLimit = xSpeedLimit;

		this.verticalSpeedLimit = Block.verticalSpeedLimit;

		this.initialWorldPosition = {
			x: worldPosition.x,
			y: worldPosition.y,
			dX: worldPosition.dX,
			dY: worldPosition.dY
		};
		
		this.skew = 0;
	}

	public Tick(deltaTime: number){
		// Move "forward".
		this.xPosition += (this.xSpeed * deltaTime);
		this.yPosition += (this.ySpeed * deltaTime);

		if(this.onMoveCallback)
		{
			// The amount moved this tick is the same as the speed.
			this.onMoveCallback({ x: this.xSpeed, y: this.ySpeed });
		}
		
		this.skew = Math.max(0, this.skew - (Block.skewReduction * deltaTime))
		
		this.verticalSpeedLimit += Block.verticalSpeedLimitDelta * deltaTime;

		// Clamp the speed to the speed limit.
		this.ySpeed = Math.min(this.ySpeed, this.verticalSpeedLimit);
		this.ySpeed = Math.max(this.ySpeed, -this.verticalSpeedLimit);
		this.xSpeed = Math.min(this.xSpeed, this.horizontalSpeedLimit );
		this.xSpeed = Math.max(this.xSpeed, -this.horizontalSpeedLimit );
	}

	public Render(renderContext: CanvasRenderingContext2D): IRenderable[] {

		renderContext.beginPath();
		
		let skewedPosition = this.skewedPosition;

		renderContext.rect(
			skewedPosition.x,
			skewedPosition.y,
			skewedPosition.width,
			skewedPosition.height);

		renderContext.fillStyle = this.fillColor;
		renderContext.fill();

		renderContext.closePath();

		let particle = new Particle(
			skewedPosition.x,
			skewedPosition.y,
			skewedPosition.width,
			skewedPosition.height,
			0,
			this.fillColor,
			0.15);

		return [particle] as IRenderable[];
	}

	public Reset()
	{
		this.worldPosition = {
			x: this.initialWorldPosition.x,
			y: this.initialWorldPosition.y,
			dX: this.initialWorldPosition.dX,
			dY: this.initialWorldPosition.dY
		};

		this.verticalSpeedLimit = Block.verticalSpeedLimit;
	}
}