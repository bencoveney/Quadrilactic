import {Entity} from "entitySystem/entity";
import {Orchestrator} from "entitySystem/orchestrator";

export interface System {
	Update(entity: Entity, orchestrator: Orchestrator, deltaTime: number): void;
}
