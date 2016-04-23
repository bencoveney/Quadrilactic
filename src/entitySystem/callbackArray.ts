import {Entity} from "entitySystem/entity";
import {Orchestrator} from "entitySystem/orchestrator";

interface Callback {
	(entity: Entity, orchestrator: Orchestrator, deltaTime: number): void;
}

export class CallbackArray extends Array {
	public trigger(entity: Entity, orchestrator: Orchestrator, deltaTime: number): void {
		this.forEach((individualCallback: Callback) => {
			individualCallback(entity, orchestrator, deltaTime);
		});
	}
}
