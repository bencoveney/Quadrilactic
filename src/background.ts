/// <reference path="block.ts" />
/// <reference path="point.ts" />
/// <reference path="IRenderable.ts" />
/// <reference path="player.ts" />

class Background implements IRenderable {
	private renderPosition: Point;
	private renderDimensions: Point;
	private color: string;
	private offset: number = 0;
	public isAlive: boolean = true;

	public constructor(
		renderPosition: Point,
		renderDimensions: Point,
		color: string,
		player: Player)
	{
		this.renderPosition = renderPosition;
		this.renderDimensions = renderDimensions;
		this.color = color;
	}
	
	public SlideUp(amount: number)
	{
		if(amount < 0)
		{
			this.offset = this.offset - amount;
		}
	}

	public Render(renderContext: CanvasRenderingContext2D): IRenderable[]{
		let lowerYPosition = this.offset % this.renderDimensions.y;
		let upperYPosition = lowerYPosition - this.renderDimensions.y;

		renderContext.beginPath();

		renderContext.rect(
			this.renderPosition.x,
			lowerYPosition,
			this.renderDimensions.x,
			this.renderDimensions.y-10);

		renderContext.rect(
			this.renderPosition.x,
			upperYPosition,
			this.renderDimensions.x,
			this.renderDimensions.y-10);

		renderContext.fillStyle = this.color;
		renderContext.fill();

		renderContext.closePath();

		return [];
	}
}
