class Block {
	private static gravity = 0.2;
	
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
	}

	public ChangePosition(dX: number, dY: number) {
		this.internalXPosition += dX;
		this.internalYPosition += dY; 
	}
	
	public Tick(worldHeight: number, worldWidth: number){
		// Move "forward"
		this.internalXPosition += this.internalXSpeed;
		this.internalYPosition += this.internalYSpeed;
		
		// If off the bottom, bounce up
		if(this.bottom > worldHeight)
		{
			// Clamp on screen, invert vertical speed
			this.yPosition = worldHeight - this.height;
			this.ySpeed = - Math.abs(this.ySpeed);
		}
		
		// If off the right, bounce left
		if(this.right > worldWidth)
		{
			// Clamp on screen, invert horizontal speed
			this.xPosition = worldWidth - this.width;
			this.xSpeed = - Math.abs(this.xSpeed);
		}
		
		// If off the left, bounce right
		if(this.left < 0)
		{
			// Clamp on screen, invert horizontal speed
			this.xPosition = 0;
			this.xSpeed = Math.abs(this.xSpeed);
		}
		
		// Apply acceleration due to gravity
		this.internalYSpeed += Block.gravity;
	}

	public Render(renderContext: CanvasRenderingContext2D) {
		renderContext.beginPath();

		renderContext.rect(this.internalXPosition, this.internalYPosition, this.internalWidth, this.internalHeight);

		renderContext.strokeStyle = Block.strokeColor;
		renderContext.stroke();

		renderContext.fillStyle = this.internalColor;
		renderContext.fill();

		renderContext.closePath();
	}
}