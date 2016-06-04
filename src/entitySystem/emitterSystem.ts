import {Entity} from "entitySystem/entity";
import {System} from "entitySystem/system";
import {Orchestrator} from "entitySystem/orchestrator";

export class EmitterSystem extends System {
	constructor() {
		super();
	}

	public Run(entities: Entity[], orchestrator: Orchestrator, deltaTime: number): void {
		System.ApplyToIndividuals(
			entities,
			(entity: Entity): boolean => {
				return !!entity.emitterComponent;
			},
			(entity: Entity): void => {
				this.Emit(entity, orchestrator, deltaTime);
			}
		);
	}

	private Emit(entity: Entity, orchestrator: Orchestrator, deltaTime: number): void {
		entity.emitterComponent.emitter(orchestrator, deltaTime);
	}
}
