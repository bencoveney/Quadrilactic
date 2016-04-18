import {Entity} from "entitySystem/entity";
import {System} from "entitySystem/system";

interface Systems {
	[name: string]: System;
}

export class Orchestrator {
	// The list of entities currently in the system.
	private _entities: Entity[];

	// Storage of entities to add/remove at the end of the tick.
	private _entitiesToAdd: Entity[];
	private _entitiesToRemove: Entity[];

	private _preSystems: Systems;
	private _mainSystems: Systems;
	private _postSystems: Systems;

	public get entities(): Entity[] {
		return this._entities;
	}

	constructor(
		initialEntities: Entity[],
		preSystems: Systems = {},
		mainSystems: Systems = {},
		postSystems: Systems = {}
	) {
		this._entities = initialEntities;

		this._preSystems = preSystems;
		this._mainSystems = mainSystems;
		this._postSystems = postSystems;

		this._entitiesToAdd = [];
		this._entitiesToRemove = [];
	}

	public Tick(deltaTime: number): void {
		if (this._entities.length > 500) {
			throw new RangeError("Sanity check failed: Large number of entities");
		}

		this.RunSystems(this._preSystems, deltaTime);
		this.RunSystems(this._mainSystems, deltaTime);
		this.RunSystems(this._postSystems, deltaTime);

		// Add any new entities.
		this._entities = this._entities.concat(this._entitiesToAdd);

		// Remove any dead entities.
		this._entities = this._entities.filter(
			(entity: Entity) => {
				return this._entitiesToRemove.indexOf(entity) < 0;
			},
			this);

		// Reset the add/remove lists
		this._entitiesToAdd = [];
		this._entitiesToRemove = [];
	}

	public Add(entity: Entity): void {
		this._entitiesToAdd.push(entity);
	}

	public Remove(entity: Entity): void {
		this._entitiesToRemove.push(entity);
	}

	public GetSystem(name: string): System {
		return this._mainSystems[name] || this._preSystems[name] || this._postSystems[name];
	}

	private RunSystems(systems: Systems, deltaTime: number): void {
		for (let systemName in systems) {
			if (systems.hasOwnProperty(systemName)) {
				systems[systemName].Run(this._entities, this, deltaTime);
			}
		}
	}
}
