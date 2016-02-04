/// <reference path="controller.ts" />
/// <reference path="point.ts" />

class Block {
	// Constants
	private static gravity = 0.2;
	private static verticalSpeedLimit = 12;
	private static horizontalSpeedLimit = 5;
	private static horizontalSpeedSlowDown = 0.1;

	// Private members
	private worldPosition: MovingPoint;
	private dimensions: Point;
	private internalColor: string;
	private onBounceCallback: () => void;

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
	
	get onBounce() : () => void {
		return this.onBounceCallback;
	}
	set onBounce(newValue: () => void) {
		this.onBounceCallback = newValue;
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
	
	public Tick(worldDimensions: Point){
		// Move "forward"
		this.xPosition += this.xSpeed;
		this.yPosition += this.ySpeed;
		
		// If off the bottom, bounce up
		if(this.bottom > worldDimensions.y)
		{
			// Clamp on screen, invert vertical speed.
			// Prevent loss of height on bounce.
			// This is less important for horizontals.
			let distanceOffBottom = this.bottom - worldDimensions.y;
			this.yPosition = worldDimensions.y - this.height - distanceOffBottom;
			this.ySpeed = -Math.abs(this.ySpeed);
			
			// Allow insertion of bouncing code
			this.onBounceCallback();
		}
		
		// If off the right, bounce left
		if(this.right > worldDimensions.x)
		{
			// Clamp on screen, invert horizontal speed
			this.xPosition = worldDimensions.x - this.width;
			this.xSpeed = -Math.abs(this.xSpeed);
		}
		
		// If off the left, bounce right
		if(this.left < 0)
		{
			// Clamp on screen, invert horizontal speed
			this.xPosition = 0;
			this.xSpeed = Math.abs(this.xSpeed); 
		}
		
		// Clamp the speed to the speed limit
		this.ySpeed = Math.min(this.ySpeed, Block.verticalSpeedLimit);
		this.ySpeed = Math.max(this.ySpeed, -Block.verticalSpeedLimit);
		this.xSpeed = Math.min(this.xSpeed, Block.horizontalSpeedLimit);
		this.xSpeed = Math.max(this.xSpeed, -Block.horizontalSpeedLimit);
		
		// Apply acceleration due to gravity
		this.ySpeed += Block.gravity;
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