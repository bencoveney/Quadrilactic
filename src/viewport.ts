/// <reference path="point.ts" />
/// <reference path="IRenderable.ts" />

class Viewport {
	private renderContext: CanvasRenderingContext2D;
	private fixedRenderables: IRenderable[];
	private backgroundRenderables: IRenderable[];
	private foregroundRenderables: IRenderable[];
	private initialBackgroundRenderables: IRenderable[];
	private initialForegroundRenderables: IRenderable[];
	private renderOffset: number;
	
	public get renderDimensions(): Point
	{
		return {
			x: this.renderContext.canvas.width,
			y: this.renderContext.canvas.height
		};
	}
	
	public get offset(): number
	{
		return this.renderOffset;
	}
	
	constructor(
		renderContext: CanvasRenderingContext2D,
		fixedRenderables: IRenderable[],
		backgroundRenderables: IRenderable[],
		foregroundRenderables: IRenderable[]
	) {
		this.renderContext = renderContext;
		this.fixedRenderables = fixedRenderables;
		this.backgroundRenderables = backgroundRenderables;
		this.foregroundRenderables = foregroundRenderables;
		this.initialBackgroundRenderables = [].concat(backgroundRenderables);
		this.initialForegroundRenderables = [].concat(foregroundRenderables);
		this.renderOffset = 0;
	}
	
	public SlideUpTo(y: number)
	{
		if(y > this.renderOffset)
		{
			this.renderOffset = y;
		}
	}
	
	public Render(fps?: number)
	{
		this.renderContext.save();
		
		this.renderContext.translate(0, this.renderOffset);
		
		this.backgroundRenderables = this.RenderSubSet(this.backgroundRenderables);

		this.renderContext.restore();
		
		this.fixedRenderables = this.RenderSubSet(this.fixedRenderables);
		
		this.renderContext.save();
		
		this.renderContext.translate(0, this.renderOffset);
		
		this.foregroundRenderables = this.RenderSubSet(this.foregroundRenderables);

		this.renderContext.restore();
		
		if(fps)
		{
			this.renderContext.fillStyle = '#FFFFFF';
			this.renderContext.fillText("FPS: " + fps.toString(), 0, 10)
		}
	}
	
	private RenderSubSet(subSet: IRenderable[]): IRenderable[]
	{
		let newRenderables = subSet;
		for(let i = 0; i < subSet.length; i++)
		{
			newRenderables = subSet[i].Render(this.renderContext).concat(newRenderables);
		}
		
		return newRenderables.filter((renderable: IRenderable) => {
			return renderable.isAlive;
		});
	}
	
	public Reset()
	{
		this.renderOffset = 0;
		this.backgroundRenderables = [].concat(this.initialBackgroundRenderables);
		this.foregroundRenderables = [].concat(this.initialForegroundRenderables);
	}
}