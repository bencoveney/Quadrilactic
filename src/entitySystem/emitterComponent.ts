import {Orchestrator} from "entitySystem/orchestrator";

interface Emitter {
	(orchestrator: Orchestrator, deltaTime: number): void;
}

export class EmitterComponent {
	private _emitter: Emitter;

	public get emitter(): Emitter {
		return this._emitter;
	}
	public set emitter(newEmitter: Emitter) {
		this._emitter = newEmitter;
	}

	public constructor(emitter: Emitter) {
		this._emitter = emitter;
	}
}
