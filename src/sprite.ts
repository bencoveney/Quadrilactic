/// <reference path="IRenderable.ts" />
/// <reference path="point.ts" />

class Sprite implements IRenderable {
	private image: HTMLImageElement;
	private dimensions: Point;
	public isAlive: boolean = true;
	
	constructor(imagePath: string, dimensions: Point)
	{
		this.image = new Image();
		this.image.addEventListener("load", () => { this.loaded() }, false);
		this.image.src = imagePath;
		
		this.dimensions = dimensions;
	}
	
	private loaded()
	{
		console.log("Loaded: " + this.image.src);
	}
	
	public Render(renderContext: CanvasRenderingContext2D): IRenderable[]
	{
		renderContext.drawImage(
			this.image,
			// Source dimensions
			0,
			0,
			this.image.width,
			this.image.height,
			// Destination dimensions
			0,
			0,
			this.dimensions.x,
			this.dimensions.y);

		return [];
	}
}