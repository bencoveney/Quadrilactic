/// <reference path="controller.ts" />
/// <reference path="physicsBlock.ts" />
/// <reference path="point.ts" />
/// <reference path="IRenderable.ts" />

class Player extends PhysicsBlock {
	private static jumpSpeedIncrease = -8;
	private static degrees = Math.PI / 180;
	private static jumpRotationSlowDown = 0.25;
	private static initialJumpRotationSpeed = 15;
	private static horizontalSpeedIncrease = 0.5;
	
	private isJumping: boolean;
	private jumpRotationAmount: number;
	private jumpRotationSpeed: number;
	private controller: Controller;
	
	public constructor(
		worldPosition: MovingPoint,
		dimensions: Point,
		color: string,
		controller: Controller,
		gravity?: number,
		boundary?: Point,
		boundaryOffset?: Point)
	{
		super(worldPosition, dimensions, color, gravity, boundary, boundaryOffset);
		
		this.onBounce = this.Bounce;
		
		this.controller = controller;
		this.isJumping = false;
	}
	
	public Tick() {
		super.Tick();
		
		// Perform the jump
		if(!this.isJumping && this.controller.isKeyPressed(["up", "space", "w"]))
		{
			this.ySpeed = Player.jumpSpeedIncrease;
			this.isJumping = true;
			this.jumpRotationSpeed = this.direction == "right" ? Player.initialJumpRotationSpeed : -Player.initialJumpRotationSpeed;
		}
		
		// Allow influence over horizontal direction
		if(this.controller.isKeyPressed(["left", "a"]))
		{
			this.xSpeed -= Player.horizontalSpeedIncrease;
		}
		if(this.controller.isKeyPressed(["right", "d"]))
		{
			this.xSpeed += Player.horizontalSpeedIncrease;
		}
		
		// Apply jump rotation
		this.jumpRotationAmount += this.jumpRotationSpeed;
		if(this.jumpRotationSpeed > 0)
		{
			this.jumpRotationSpeed = Math.max(0, this.jumpRotationSpeed - Player.jumpRotationSlowDown);
		}
		else if(this.jumpRotationSpeed < 0)
		{
			this.jumpRotationSpeed = Math.min(0, this.jumpRotationSpeed + Player.jumpRotationSlowDown);
		}
	}
	
	public Bounce() {
		// If we were jumping, thats over now
		this.isJumping = false;
		this.jumpRotationAmount = 0;
		this.jumpRotationSpeed = 0;
	}
	
	public Render(renderContext: CanvasRenderingContext2D): IRenderable[] {
		renderContext.save();
		
		renderContext.translate(this.centerXPosition, this.centerYPosition);
		renderContext.rotate(this.jumpRotationAmount * Player.degrees);
		renderContext.translate(-this.centerXPosition, -this.centerYPosition);
		
		let newRenderables = super.Render(renderContext);
		
		renderContext.restore();
		
		return newRenderables;
	}
}