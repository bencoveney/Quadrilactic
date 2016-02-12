/// <reference path="block.ts" />
/// <reference path="point.ts" />
/// <reference path="IRenderable.ts" />

class PhysicsBlock extends Block {
	
	private internalGravity: number;
	private internalBoundary: Point;
	private internalBoundaryOffset: Point;
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

	public get boundaryOffset(): Point {
		return this.internalBoundaryOffset
	}
	public set boundaryOffset(newValue: Point) {
		this.internalBoundaryOffset = newValue;
	}
	
	public get leftBoundary(): number {
		return this.boundaryOffset ? this.boundaryOffset.x : 0;
	}
	public get rightBoundary(): number {
		return this.leftBoundary + (this.boundary ? this.boundary.x : 0);
	}
	public get topBoundary(): number {
		return this.boundaryOffset ? this.boundaryOffset.y : 0;
	}
	public get bottomBoundary(): number {
		return this.topBoundary + (this.boundary ? this.boundary.y : 0);
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
		gravity: number,
		boundary?: Point,
		boundaryOffset?: Point)
	{
		super(worldPosition, dimensions, color);
		
		this.internalGravity = gravity;
		this.internalBoundary = boundary;
		this.internalBoundaryOffset = boundaryOffset;
	}
	
	public Tick(){
		super.Tick();
		
		// If off the bottom, bounce up
		if(this.bottom > this.bottomBoundary)
		{
			// Clamp on screen, invert vertical speed.
			// Prevent loss of height on bounce.
			// This is less important for horizontals.
			let distanceOffBottom = this.bottom - this.bottomBoundary;
			this.yPosition = this.bottomBoundary - this.height - distanceOffBottom;
			this.VerticalBounce(- this.ySpeed);
		}
		
		// If off the top, bounce down
		if(this.top < this.topBoundary)
		{
			// Clamp on screen, invert vertical speed.
			// Prevent loss of height on bounce.
			// This is less important for horizontals.
			let distanceOffTop = this.topBoundary - this.top;
			this.yPosition = this.topBoundary + distanceOffTop;
			this.VerticalBounce(- this.ySpeed);
		}
		
		// If off the right, bounce left
		if(this.right > this.rightBoundary)
		{
			// Clamp on screen, invert horizontal speed
			this.xPosition = this.rightBoundary - this.width;
			this.xSpeed = -Math.abs(this.xSpeed);
		}
		
		// If off the left, bounce right
		if(this.left < this.leftBoundary)
		{
			// Clamp on screen, invert horizontal speed
			this.xPosition = this.leftBoundary;
			this.xSpeed = Math.abs(this.xSpeed); 
		}
		
		// Apply acceleration due to gravity
		this.ySpeed += this.internalGravity;
	}
	
	public Render(renderContext: CanvasRenderingContext2D): IRenderable[] {
		return super.Render(renderContext);
	}
	
	public VerticalBounce(newYSpeed: number) {
		this.ySpeed = newYSpeed;
		
		// Allow insertion of bouncing code
		if(this.onBounceCallback)
		{
			this.onBounceCallback();
		}
	}
}
