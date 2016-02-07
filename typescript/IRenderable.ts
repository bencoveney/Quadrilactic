interface IRenderable {
	isAlive: boolean;
	Render(renderContext: CanvasRenderingContext2D): IRenderable[];
}