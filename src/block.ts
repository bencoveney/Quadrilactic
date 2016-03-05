/// <reference path="controller.ts" />
/// <reference path="point.ts" />
/// <reference path="IRenderable.ts" />
/// <reference path="particle.ts"" />

class Block implements IRenderable {
	// Constants
	private static verticalSpeedLimit = 12;
	private static horizontalSpeedLimit = 5;
	private static horizontalSpeedSlowDown = 0.1;

	// Private members
	private worldPosition: MovingPoint;
	private dimensions: Point;
	private internalColor: string;
	private onMoveCallback: (amountMoved: Point) => void;
	private initialWorldPosition: MovingPoint;
	
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
	
	// Direction properties
	get direction(): string {
		return this.xSpeed >= 0 ? "right" : "left";
	}

	// Constants
	private static strokeColor: string = "#000000";

	public constructor(worldPosition: MovingPoint, dimensions: Point, color: string) {
		this.worldPosition = worldPosition;
		this.dimensions = dimensions;
		this.internalColor = color;

		this.initialWorldPosition = {
			x: worldPosition.x,
			y: worldPosition.y,
			dX: worldPosition.dX,
			dY: worldPosition.dY
		};
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
		
		// Clamp the speed to the speed limit.
		this.ySpeed = Math.min(this.ySpeed, Block.verticalSpeedLimit);
		this.ySpeed = Math.max(this.ySpeed, -Block.verticalSpeedLimit);
		this.xSpeed = Math.min(this.xSpeed, Block.horizontalSpeedLimit);
		this.xSpeed = Math.max(this.xSpeed, -Block.horizontalSpeedLimit);
	}

	public Render(renderContext: CanvasRenderingContext2D): IRenderable[] {
		
		renderContext.beginPath();

		renderContext.rect(this.xPosition, this.yPosition, this.width, this.height);

		renderContext.fillStyle = this.fillColor;
		renderContext.fill();

		renderContext.closePath();
		
		let particle = new Particle(
			this.xPosition,
			this.yPosition,
			this.width,
			this.height,
			0,
			this.fillColor,
			0.1);
		
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
	}
}