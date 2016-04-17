import {Entity} from "entitySystem/entity";
import {System} from "entitySystem/system";
import {Orchestrator} from "entitySystem/orchestrator";
import {LocationComponent} from "entitySystem/locationComponent";
import {RenderComponent} from "entitySystem/renderComponent";

export class RenderSystem implements System {
	private _renderContext: CanvasRenderingContext2D;
	private _viewportOffset: number;

	public get viewportOffset(): number {
		return this._viewportOffset;
	}
	public set viewportOffset(newValue) {
		this._viewportOffset = newValue;
	}

	constructor(renderContext: CanvasRenderingContext2D) {
		this._renderContext = renderContext;
	}

	public Update(entity: Entity, orchestrator: Orchestrator, deltaTime: number): void {
		// TODO: Orchestrator shouldn't invoke if there isn't a relevant component.
		if (!entity.renderComponent) {
			return;
		}

		this._renderContext.save();

		let renderComponent: RenderComponent = entity.renderComponent;

		this._renderContext.globalAlpha = renderComponent.opacity;

		this.OffsetViewport();

		this.RotateAroundCenter(renderComponent.position);
		this.MoveToPosition(renderComponent.position);

		this.DrawRect(renderComponent);

		this._renderContext.restore();

		// Fade out.
		renderComponent.opacity -= 0.01;
		if (renderComponent.opacity <= 0) {
			orchestrator.Remove(entity);
		}
	}

	private RotateAroundCenter(position: LocationComponent): void {
		// Move the center of the entity to the origin
		this._renderContext.translate(
			position.centerXPosition,
			position.centerYPosition);

		// Rotate around the origin
		this._renderContext.rotate(position.rotationInDegrees);

		// Move back to the original position
		this._renderContext.translate(
			-position.centerXPosition,
			-position.centerYPosition);
	}

	private MoveToPosition(position: LocationComponent): void {
		this._renderContext.translate(
			position.xPosition,
			position.yPosition);
	}
	
	private OffsetViewport() {
		this._renderContext.translate(0, this._viewportOffset);
	}

	private DrawRect(renderComponent: RenderComponent): void {
		// Begin the shape.
		this._renderContext.beginPath();

		// Create the rectangle.
		this._renderContext.rect(
			0,
			0,
			renderComponent.position.width,
			renderComponent.position.height);

		// Fill it in.
		this._renderContext.fillStyle = renderComponent.fillColor;
		this._renderContext.fill();

		// End the shape.
		this._renderContext.closePath();
	}
}
