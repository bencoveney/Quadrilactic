import {Entity} from "entitySystem/entity";
import {System} from "entitySystem/system";
import {Orchestrator} from "entitySystem/orchestrator";

export class LocationSystem extends System {
	public Run(entities: Entity[], orchestrator: Orchestrator, deltaTime: number ): void {
		"noOp".toString();
	}
}
