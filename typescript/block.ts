/// <reference path="controller.ts" />

class Block {
	// Constants
	private static gravity = 0.2;
	private static verticalSpeedLimit = 12;
	private static horizontalSpeedLimit = 5;
	private static jumpSpeedIncrease = -8;
	private static degrees = Math.PI / 180;
	private static jumpRotationSlowDown = 0.25;
	private static initialJumpRotationSpeed = 15;
	private static horizontalSpeedIncrease = 0.5;
	private static horizontalSpeedSlowDown = 0.1;
	
	private internalXPosition: number;
	get xPosition(): number {
		return this.internalXPosition;
	}
	set xPosition(newValue: number) {
		this.internalXPosition = newValue;
	}

	private internalYPosition: number;
	get yPosition(): number {
		return this.internalYPosition;
	}
	set yPosition(newValue: number) {
		this.internalYPosition = newValue;
	}
	
	private internalXSpeed: number;
	get xSpeed(): number {
		return this.internalXSpeed;
	}
	set xSpeed(newValue: number) {
		this.internalXSpeed = newValue;
	}
	
	private internalYSpeed: number;
	get ySpeed(): number {
		return this.internalYSpeed;
	}
	set ySpeed(newValue: number) {
		this.internalYSpeed = newValue;
	}
	
	private internalWidth: number;
	get width(): number {
		return this.internalWidth;
	}

	private internalHeight: number;
	get height(): number {
		return this.internalHeight;
	}
	
	private internalColor: string;
	get color(): string {
		return this.internalColor;
	}
	set color(newValue: string) {
		this.internalColor = newValue;
	}
	
	get top(): number {
		return this.internalYPosition;
	}
	get bottom(): number {
		return this.internalYPosition + this.internalHeight;
	}
	get left(): number {
		return this.internalXPosition;
	}
	get right(): number {
		return this.internalXPosition + this.internalWidth;
	}
	
	get centerXPosition(): number {
		return this.left + (this.width / 2);
	}
	get centerYPosition(): number {
		return this.top + (this.height / 2);
	}
	
	get direction(): string {
		return this.xSpeed >= 0 ? "right" : "left";
	}
	
	private isJumping: boolean;
	private jumpRotationAmount: number;
	private jumpRotationSpeed: number

	// Constants
	private static strokeColor: string = "#000000";

	public constructor(xPosition: number, yPosition: number, xSpeed: number, ySpeed: number, width: number, height: number, color: string) {
		this.internalXPosition = xPosition;
		this.internalYPosition = yPosition;
		this.internalXSpeed = xSpeed;
		this.internalYSpeed = ySpeed;
		this.internalWidth = width;
		this.internalHeight = height;
		this.internalColor = color;
		this.isJumping = false;
	}

	public ChangePosition(dX: number, dY: number) {
		this.internalXPosition += dX;
		this.internalYPosition += dY; 
	}
	
	public Tick(worldHeight: number, worldWidth: number, controller: Controller){
		// Move "forward"
		this.internalXPosition += this.internalXSpeed;
		this.internalYPosition += this.internalYSpeed;
		
		// If off the bottom, bounce up
		if(this.bottom > worldHeight)
		{
			// Clamp on screen, invert vertical speed.
			// Prevent loss of height on bounce.
			// This is less important for horizontals.
			let distanceOffBottom = this.bottom - worldHeight;
			this.yPosition = worldHeight - this.height - distanceOffBottom;
			this.ySpeed = -Math.abs(this.ySpeed);
			
			// If we were jumping, thats over now
			this.isJumping = false;
			this.jumpRotationAmount = 0;
			this.jumpRotationSpeed = 0;
		}
		
		// If off the right, bounce left
		if(this.right > worldWidth)
		{
			// Clamp on screen, invert horizontal speed
			this.xPosition = worldWidth - this.width;
			this.xSpeed = -Math.abs(this.xSpeed);
		}
		
		// If off the left, bounce right
		if(this.left < 0)
		{
			// Clamp on screen, invert horizontal speed
			this.xPosition = 0;
			this.xSpeed = Math.abs(this.xSpeed); 
		}
		
		// Perform the jump
		if(!this.isJumping && controller.isKeyPressed(["up", "space", "w"]))
		{
			this.ySpeed = Block.jumpSpeedIncrease;
			this.isJumping = true;
			this.jumpRotationSpeed = this.direction == "right" ? Block.initialJumpRotationSpeed : -Block.initialJumpRotationSpeed;
		}
		
		// Allow influence over horizontal direction
		if(controller.isKeyPressed(["left", "a"]))
		{
			this.xSpeed -= Block.horizontalSpeedIncrease;
		}
		if(controller.isKeyPressed(["right", "d"]))
		{
			this.xSpeed += Block.horizontalSpeedIncrease;
		}
		
		// Clamp the speed to the speed limit
		this.ySpeed = Math.min(this.ySpeed, Block.verticalSpeedLimit);
		this.ySpeed = Math.max(this.ySpeed, -Block.verticalSpeedLimit);
		this.xSpeed = Math.min(this.xSpeed, Block.horizontalSpeedLimit);
		this.xSpeed = Math.max(this.xSpeed, -Block.horizontalSpeedLimit);
		
		// Apply acceleration due to gravity
		this.internalYSpeed += Block.gravity;
		
		// Apply jump rotation
		this.jumpRotationAmount += this.jumpRotationSpeed;
		if(this.jumpRotationSpeed > 0)
		{
			this.jumpRotationSpeed = Math.max(0, this.jumpRotationSpeed - Block.jumpRotationSlowDown);
		}
		else if(this.jumpRotationSpeed < 0)
		{
			this.jumpRotationSpeed = Math.min(0, this.jumpRotationSpeed + Block.jumpRotationSlowDown);
		}
	}

	public Render(renderContext: CanvasRenderingContext2D) {
		renderContext.save();
		
		renderContext.translate(this.centerXPosition, this.centerYPosition);
		renderContext.rotate(this.jumpRotationAmount * Block.degrees);
		renderContext.translate(-this.centerXPosition, -this.centerYPosition);
		
		renderContext.beginPath();

		renderContext.rect(this.internalXPosition, this.internalYPosition, this.internalWidth, this.internalHeight);

		renderContext.strokeStyle = Block.strokeColor;
		renderContext.stroke();

		renderContext.fillStyle = this.direction == "right" ? this.internalColor : "#00FFFF";
		renderContext.fill();

		renderContext.closePath();
		
		renderContext.restore();
	}
}