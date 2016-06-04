import {Point} from "point";
import {Orchestrator} from "entitySystem/orchestrator";
import {RenderSystem} from "entitySystem/renderSystem";

export class Viewport {
	private renderContext: CanvasRenderingContext2D;
	private renderOffset: number;
	private orchestrator: Orchestrator;

	public get renderDimensions(): Point {
		return {
			x: this.renderContext.canvas.width,
			y: this.renderContext.canvas.height
		};
	}

	public get offset(): number {
		return this.renderOffset;
	}

	constructor(
		renderContext: CanvasRenderingContext2D,
		orchestrator: Orchestrator
	) {
		this.renderContext = renderContext;
		this.renderOffset = 0;
		this.orchestrator = orchestrator;
	}

	public SlideUpTo(y: number): void {
		if (y > this.renderOffset) {
			this.renderOffset = y;
			(this.orchestrator.GetSystem("render") as RenderSystem).offsetY = y;
		}
	}

	public Render(fps?: number): void {
		if (fps) {
			this.renderContext.fillStyle = "#FFFFFF";
			this.renderContext.fillText("FPS: " + fps.toString(), 0, 10);
		}
	}

	public Reset(): void {
		this.renderOffset = 0;
		(this.orchestrator.GetSystem("render") as RenderSystem).offsetY = 0;
	}
}
