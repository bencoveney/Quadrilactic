/// <reference path="point.ts" />
/// <reference path="IRenderable.ts" />

class Viewport {
	private renderContext: CanvasRenderingContext2D;
	private fixedRenderables: IRenderable[];
	private backgroundRenderables: IRenderable[];
	private foregroundRenderables: IRenderable[];
	private renderOffset: number;
	
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
		this.renderOffset = 0;
	}
	
	public SlideUp(amount: number)
	{
		if(amount < 0)
		{
			this.renderOffset = this.renderOffset - amount;
		}
	}
	
	public Render()
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
	}
	
	private RenderSubSet(subSet: IRenderable[]): IRenderable[]
	{
		let newRenderables = subSet;
		for(let i = 0; i < subSet.length; i++)
		{
			newRenderables = newRenderables.concat(subSet[i].Render(this.renderContext));
		}
		
		return newRenderables.filter((renderable: IRenderable) => {
			return renderable.isAlive;
		});
	}
}