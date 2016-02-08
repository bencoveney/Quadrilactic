/// <reference path="controller.ts" />
/// <reference path="point.ts" />

class Block {
	// Constants
	private static verticalSpeedLimit = 12;
	private static horizontalSpeedLimit = 5;
	private static horizontalSpeedSlowDown = 0.1;

	// Private members
	private worldPosition: MovingPoint;
	private dimensions: Point;
	private internalColor: string;

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
	}
	
	public Tick(){
		// Move "forward"
		this.xPosition += this.xSpeed;
		this.yPosition += this.ySpeed;
		
		// Clamp the speed to the speed limit
		this.ySpeed = Math.min(this.ySpeed, Block.verticalSpeedLimit);
		this.ySpeed = Math.max(this.ySpeed, -Block.verticalSpeedLimit);
		this.xSpeed = Math.min(this.xSpeed, Block.horizontalSpeedLimit);
		this.xSpeed = Math.max(this.xSpeed, -Block.horizontalSpeedLimit);
	}

	public Render(renderContext: CanvasRenderingContext2D) {
		
		renderContext.beginPath();

		renderContext.rect(this.xPosition, this.yPosition, this.width, this.height);

		renderContext.strokeStyle = Block.strokeColor;
		renderContext.stroke();

		renderContext.fillStyle = this.direction == "right" ? this.internalColor : "#00FFFF";
		renderContext.fill();

		renderContext.closePath();
	}
}