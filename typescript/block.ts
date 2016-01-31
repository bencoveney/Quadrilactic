class Block {
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

	// Constants
	private static strokeColor: string = "#000000";

	public constructor(xPosition: number, yPosition: number, width: number, height: number, color: string) {
		this.internalXPosition = xPosition;
		this.internalYPosition = yPosition;
		this.internalWidth = width;
		this.internalHeight = height;
		this.internalColor = color;
	}

	public ChangePosition(dX: number, dY: number) {
		this.internalXPosition += dX;
		this.internalYPosition += dY; 
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