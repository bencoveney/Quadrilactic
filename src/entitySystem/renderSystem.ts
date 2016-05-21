import {Entity} from "entitySystem/entity";
import {System} from "entitySystem/system";
import {Orchestrator} from "entitySystem/orchestrator";
import {LocationComponent, LocationType} from "entitySystem/locationComponent";
import {RenderComponent, RenderLayer, RectangleLayer, SpriteLayer, TextLayer} from "entitySystem/renderComponent";

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
			},
			(entity: Entity): number => {
				return entity.renderComponent.zIndex;
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

		this._renderContext.globalAlpha = renderComponent.opacityValue;

		if (renderComponent.position.type === LocationType.world) {
			this.OffsetViewport();
		}

		this.RotateAroundCenter(renderComponent.position);
		this.MoveToPosition(renderComponent.position);

		// Layers can be a function so access it once upfront to ensure a single set of results.
		let layers: RenderLayer[] = renderComponent.layers;

		for (let layerIndex: number = 0; layerIndex < layers.length; layerIndex++) {
			let layer: RenderLayer = layers[layerIndex];

			this._renderContext.save();
			this.OffsetLayer(layer);

			if (layer instanceof RectangleLayer) {
				this.DrawRect(renderComponent, layer as RectangleLayer);
			} else if (layer instanceof SpriteLayer) {
				this.DrawSprite(renderComponent, layer as SpriteLayer);
			} else if (layer instanceof TextLayer) {
				this.DrawText(renderComponent, layer as TextLayer);
			}

			this._renderContext.restore();
		}

		this._renderContext.restore();
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
			position.xPositionValue,
			position.yPositionValue);
	}

	private OffsetLayer(layer: RenderLayer): void {
		this._renderContext.translate(
			layer.offsetX,
			layer.offsetY);
	}

	private OffsetViewport(): void {
		this._renderContext.translate(
			this._offsetX,
			this._offsetY);
	}

	private DrawRect(renderComponent: RenderComponent, rectangleLayer: RectangleLayer): void {

		let skewedPosition: LocationComponent = renderComponent.skewedPosition;

		// Begin the shape.
		this._renderContext.beginPath();

		// Create the rectangle.
		this._renderContext.rect(
			0,
			0,
			skewedPosition.width,
			skewedPosition.height);

		// Fill it in.
		this._renderContext.fillStyle = rectangleLayer.fillColorValue;
		this._renderContext.fill();

		// End the shape.
		this._renderContext.closePath();
	}

	private DrawSprite(renderComponent: RenderComponent, spriteLayer: SpriteLayer): void {

		let skewedPosition: LocationComponent = renderComponent.skewedPosition;

		this._renderContext.drawImage(
			spriteLayer.image,
			// Source dimensions
			0,
			0,
			spriteLayer.image.width,
			spriteLayer.image.height,
			// Destination dimensions
			0,
			0,
			skewedPosition.width,
			skewedPosition.height);
	}

	private DrawText(renderComponent: RenderComponent, textLayer: TextLayer): void {

		this._renderContext.font = textLayer.sizeInPixels.toString() + "px " + textLayer.font;

		this._renderContext.fillStyle = textLayer.fillColorValue;

		this._renderContext.fillText(textLayer.textValue, 0, 0);
	}
}
