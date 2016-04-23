import {Entity} from "entitySystem/entity";
import {System} from "entitySystem/system";
import {Orchestrator} from "entitySystem/orchestrator";
import {Controller} from "controller";

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
				this.TriggerKeyHandlers(entity, orchestrator, deltaTime);
			}
		);
	}

	private TriggerKeyHandlers(entity: Entity, orchestrator: Orchestrator, deltaTime: number): void {
		for (let key in entity.inputComponent.definedKeyHandlers) {
			if (this._controller.isKeyPressed(key)) {
				entity.inputComponent.getKeyHandler(key).trigger(entity, orchestrator, deltaTime);
			}
		}
	}
}
