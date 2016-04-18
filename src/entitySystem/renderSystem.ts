import {Entity} from "entitySystem/entity";
import {System} from "entitySystem/system";
import {Orchestrator} from "entitySystem/orchestrator";
import {LocationComponent} from "entitySystem/locationComponent";
import {RenderComponent} from "entitySystem/renderComponent";

export class RenderSystem extends System {
	private _renderContext: CanvasRenderingContext2D;
	private _offsetX: number = 0;
	private _offsetY: number = 0;

	public get offsetX(): number {
		return this._offsetX;
	}
	public set offsetX(newValue: number) {
		this._offsetX = newValue;
	}
	public get offsetY(): number {
		return this._offsetY;
	}
	public set offsetY(newValue: number) {
		this._offsetY = newValue;
	}

	constructor(renderContext: CanvasRenderingContext2D) {
		super();

		this._renderContext = renderContext;
	}

	public Run(entities: Entity[], orchestrator: Orchestrator, deltaTime: number ): void {
		System.ApplyToIndividuals(
			entities,
			(entity: Entity): boolean => {
				return !!entity.renderComponent;
			},
			(entity: Entity): void => {
				this.Draw(entity, orchestrator, deltaTime);
			}
		);
	}

	private Draw(entity: Entity, orchestrator: Orchestrator, deltaTime: number): void {
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

	private OffsetViewport(): void {
		this._renderContext.translate(
			this._offsetX,
			this._offsetY);
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
