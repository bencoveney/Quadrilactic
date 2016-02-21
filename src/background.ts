/// <reference path="block.ts" />
/// <reference path="point.ts" />
/// <reference path="IRenderable.ts" />
/// <reference path="player.ts" />
/// <reference path="sprite.ts" />

class Background implements IRenderable {
	private renderPosition: Point;
	private renderDimensions: Point;
	private color: string;
	private offset: number = 0;
	public isAlive: boolean = true;
	
	private staticBackground: Sprite;
	private stars1: Sprite;
	private stars2: Sprite;

	public constructor(
		renderPosition: Point,
		renderDimensions: Point,
		color: string,
		player: Player)
	{
		this.renderPosition = renderPosition;
		this.renderDimensions = renderDimensions;
		this.color = color;
		
		this.staticBackground = new Sprite("img/staticBackground.png", renderDimensions);
		this.stars1 = new Sprite("img/stars1.png", { x: renderDimensions.x, y: renderDimensions.y * 2 });
		this.stars2 = new Sprite("img/stars2.png", { x: renderDimensions.x, y: renderDimensions.y * 2 });
	}
	
	public SlideUp(amount: number)
	{
		if(amount < 0)
		{
			this.offset = this.offset - amount;
		}
	}

	public Render(renderContext: CanvasRenderingContext2D): IRenderable[]{
		
		var result = []
		
		result = result.concat(this.staticBackground.Render(renderContext));
		
 		let lowerYPosition1 = this.offset % (this.renderDimensions.y * 2);
 		let upperYPosition1 = lowerYPosition1 - (this.renderDimensions.y * 2);
		
		renderContext.save();
		renderContext.translate(0, lowerYPosition1);
		result = result.concat(this.stars1.Render(renderContext));
		renderContext.restore();
		
		renderContext.save();
		renderContext.translate(0, upperYPosition1);
		result = result.concat(this.stars1.Render(renderContext));
		renderContext.restore();
		
 		let lowerYPosition2 = (this.offset / 2) % (this.renderDimensions.y * 2);
 		let upperYPosition2 = lowerYPosition2 - (this.renderDimensions.y * 2);
		
		renderContext.save();
		renderContext.translate(0, lowerYPosition2);
		result = result.concat(this.stars2.Render(renderContext));
		renderContext.restore();
		
		renderContext.save();
		renderContext.translate(0, upperYPosition2);
		result = result.concat(this.stars2.Render(renderContext));
		renderContext.restore();

		return result;
	}
}
