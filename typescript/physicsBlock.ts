/// <reference path="block.ts" />
/// <reference path="point.ts" />

class PhysicsBlock extends Block {
	// Constants
	private static defaultGravity: number = 0.2;
	
	private internalGravity: number;
	private internalBoundary: Point;
	private onBounceCallback: () => void;
	
	public get gravity(): number {
		return this.internalGravity;
	}
	public set gravity(newValue: number) {
		this.internalGravity = newValue;
	}

	public get boundary(): Point {
		return this.internalBoundary
	}
	public set boundary(newValue: Point) {
		this.internalBoundary = newValue;
	}
	
	get onBounce() : () => void {
		return this.onBounceCallback;
	}
	set onBounce(newValue: () => void) {
		this.onBounceCallback = newValue;
	}

	public constructor(
		worldPosition: MovingPoint,
		dimensions: Point,
		color: string,
		gravity: number = PhysicsBlock.defaultGravity,
		boundary?: Point)
	{
		super(worldPosition, dimensions, color);
		
		this.internalGravity = gravity;
		this.internalBoundary = boundary;
	}
	
	public Tick(){
		super.Tick();
		
		// If off the bottom, bounce up
		if(this.bottom > this.internalBoundary.y)
		{
			// Clamp on screen, invert vertical speed.
			// Prevent loss of height on bounce.
			// This is less important for horizontals.
			let distanceOffBottom = this.bottom - this.internalBoundary.y;
			this.yPosition = this.internalBoundary.y - this.height - distanceOffBottom;
			this.ySpeed = -Math.abs(this.ySpeed);
			
			// Allow insertion of bouncing code
			this.onBounceCallback();
		}
		
		// If off the right, bounce left
		if(this.right > this.internalBoundary.x)
		{
			// Clamp on screen, invert horizontal speed
			this.xPosition = this.internalBoundary.x - this.width;
			this.xSpeed = -Math.abs(this.xSpeed);
		}
		
		// If off the left, bounce right
		if(this.left < 0)
		{
			// Clamp on screen, invert horizontal speed
			this.xPosition = 0;
			this.xSpeed = Math.abs(this.xSpeed); 
		}
		
		// Apply acceleration due to gravity
		this.ySpeed += this.internalGravity;
	}
	
	public Render(renderContext: CanvasRenderingContext2D) {
		super.Render(renderContext);
	}
}