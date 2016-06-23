import {Entity} from "entitySystem/entity";
import {System} from "entitySystem/system";
import {Orchestrator} from "entitySystem/orchestrator";
import {Controller} from "controller";
import {InputComponent} from "entitySystem/inputComponent";
import {LocationComponent} from "entitySystem/locationComponent";

type coordinate = {x: number, y: number};

export class InputSystem extends System {
	private _controller: Controller;

	constructor(controller: Controller) {
		super();

		this._controller = controller;
	}

	public Run(entities: Entity[], orchestrator: Orchestrator, deltaTime: number): void {
		System.ApplyToIndividuals(
			entities,
			(entity: Entity): boolean => {
				return !!entity.inputComponent;
			},
			(entity: Entity): void => {
				if (entity.locationComponent) {
					this.TriggerMouseHandlers(entity, orchestrator, deltaTime);
				}

				this.TriggerKeyHandlers(entity, orchestrator, deltaTime);
			}
		);

		this._controller.clearClick();
	}

	private TriggerMouseHandlers(entity: Entity, orchestrator: Orchestrator, deltaTime: number): void {
		let inputHandlers: InputComponent = entity.inputComponent;

		let hoverLocation: coordinate = this._controller.getMousePosition();
		let clickLocation: coordinate = this._controller.getClickPosition();

		let detectOverlap: (position: coordinate) => void = (position: coordinate) => {
			if (!hoverLocation) {
				return false;
			}

			let location: LocationComponent = entity.locationComponent;

			let isHorizontalOverlap: boolean = position.x > location.left && position.x < location.right;
			let isVerticalOverlap: boolean = position.y > location.top && position.y < location.bottom;

			return isHorizontalOverlap && isVerticalOverlap;
		};

		// If no overlap.
		if (!detectOverlap(hoverLocation)) {
			// Check if mouse has moved out.
			if (inputHandlers.isMouseOver) {
				inputHandlers.isMouseOver = false;
				inputHandlers.onMouseOut.trigger(entity, orchestrator, deltaTime);
			}

			// Mouse press on entity has been released. No handler for this.
			if (inputHandlers.isMouseDown) {
				inputHandlers.isMouseDown = false;
			}

			// No more relevant handlers.
			return;
		}

		// Check if the mouse is newly over.
		if (!inputHandlers.isMouseOver) {
			inputHandlers.onMouseOver.trigger(entity, orchestrator, deltaTime);
			inputHandlers.isMouseOver = true;
		}

		// Check if the mouse is newly clicked.
		// We already know its hovering so just check if a click exists.
		if (!inputHandlers.isMouseDown && clickLocation) {
			inputHandlers.onMouseClick.trigger(entity, orchestrator, deltaTime);
			inputHandlers.isMouseDown = true;
		}
	}

	private TriggerKeyHandlers(entity: Entity, orchestrator: Orchestrator, deltaTime: number): void {
		for (let key in entity.inputComponent.definedKeyHandlers) {
			if (this._controller.isKeyPressed(key)) {
				entity.inputComponent.getKeyHandler(key).trigger(entity, orchestrator, deltaTime);
			}
		}
	}
}
