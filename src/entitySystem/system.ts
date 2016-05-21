import {Entity} from "entitySystem/entity";
import {Orchestrator} from "entitySystem/orchestrator";

export abstract class System {

	protected static ApplyToIndividuals(
		entities: Entity[],
		predicate: (entity: Entity) => boolean,
		logic: (entity: Entity) => void,
		sort?: (entity: Entity) => number
	): void {
		let filteredEntities: Entity[] = entities.filter((entity: Entity) => {
			return predicate(entity);
		});

		if (sort) {
			filteredEntities = filteredEntities.sort((aEntity: Entity, bEntity: Entity) => {
				return sort(aEntity) > sort(bEntity) ? 1 : -1;
			});
		}

		filteredEntities.forEach((entity: Entity) => {
			logic(entity);
		});
	}

	protected static ApplyToPairs(
		entities: Entity[],
		predicate: (entity: Entity) => boolean,
		logic: (entityA: Entity, entityB: Entity) => void
	): void {
		let filteredEntities: Entity[] = entities.filter((entity: Entity) => {
			return predicate(entity);
		});

		for (let i: number = 0; i < filteredEntities.length - 1; i++) {
			// Store the inner entity to save on lookups.
			let entityA: Entity = filteredEntities[i];

			for (let j: number = i + 1; j < filteredEntities.length; j++) {
				logic(entityA, filteredEntities[j]);
			}
		}
	}

	public abstract Run(
		entities: Entity[],
		orchestrator: Orchestrator,
		deltaTime: number
	): void;
}
