import {Entity} from "entitySystem/entity";
import {System} from "entitySystem/system";
import {Orchestrator} from "entitySystem/orchestrator";

export enum GameState {
	None = 0,
	Menu = 1,
	Game = 2
}

interface StateChangeHandler {
	(removables: Entity[]): void;
}

export class GameStateSystem extends System {
	private _state: GameState;
	private _nextState: GameState;
	private _removables: Entity[] = [];

	private _onMenuState: StateChangeHandler;
	private _onGameState: StateChangeHandler;

	public get OnMenuState(): StateChangeHandler {
		return this._onMenuState;
	}
	public set OnMenuState(newHandler: StateChangeHandler) {
		this._onMenuState = newHandler;
	}

	public get OnGameState(): StateChangeHandler {
		return this._onGameState;
	}
	public set OnGameState(newHandler: StateChangeHandler) {
		this._onGameState = newHandler;
	}

	constructor() {
		super();

		this._state     = GameState.None;
		this._nextState = GameState.Menu;
	}

	public Run(entities: Entity[], orchestrator: Orchestrator, deltaTime: number): void {
		// The next state should always be blanked.
		// There is no scenario where we leave this method without having acted upon it.
		let nextState: GameState = this._nextState;
		this._nextState = undefined;

		// Don't proceed if theres no state change.
		if (this._state === nextState || !nextState) {
			return;
		}

		this._state = nextState;

		// Remove any specified entities.
		this._removables.forEach((entity: Entity) => {
			orchestrator.Remove(entity);
		});
		this._removables = [];

		switch (nextState) {
			case GameState.Game:
				this._onGameState(this._removables);
				break;

			case GameState.Menu:
				this._onMenuState(this._removables);
				break;

			default:
				break;
		}
	}

	public StartGame(): void {
		this._nextState = GameState.Game;
	}

	public EndGame(): void {
		this._nextState = GameState.Menu;
	}
}
