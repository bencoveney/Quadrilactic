/// <reference path="physicsBlock.ts" />
/// <reference path="point.ts" />
/// <reference path="IRenderable.ts" />
/// <reference path="sprite.ts" />

class Platform extends PhysicsBlock {
	
	public viewport: Viewport;
	
	private get bottomOfScreen(): number
	{
		return this.viewport.renderDimensions.y - this.viewport.offset
	}
	
	private get offscreenAmount(): number
	{
		return Math.max(this.top - this.bottomOfScreen, 0)
	}
	
	public constructor(
		worldPosition: MovingPoint,
		dimensions: Point,
		color: string,
		gravity: number,
		volume: Volume,
		worldWidth: number)
	{
		super(worldPosition, dimensions, color, gravity, volume, worldWidth);
	}
	
	public Render(renderContext: CanvasRenderingContext2D): IRenderable[] {
		if(this.offscreenAmount <= 0)
		{
			return super.Render(renderContext);
		}
		else
		{
			renderContext.save();
			
			renderContext.fillStyle = this.fillColor;
			
			renderContext.globalAlpha = 0.2;
			renderContext.fillRect(
				this.left,
				this.bottomOfScreen - this.height,
				this.width,
				this.height
			)
			
			renderContext.globalAlpha = 1;
			renderContext.fillRect(
				this.left,
				this.bottomOfScreen - this.height,
				((this.offscreenAmount/ 10) % this.width),
				this.height
			)
			
			renderContext.restore();
			
			return [];
		}
	}
}
