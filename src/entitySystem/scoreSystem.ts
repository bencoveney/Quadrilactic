import {Entity} from "entitySystem/entity";
import {System} from "entitySystem/system";
import {Orchestrator} from "entitySystem/orchestrator";

export class ScoreSystem extends System {
	private _points: number;
	private _multiplier: number;

	public get points(): number {
		return this._points;
	}

	public get multiplier(): number {
		return this._multiplier;
	}

	public get totalScore(): number {
		return this._points * this._multiplier;
	}

	constructor() {
		super();

		this.ResetScore();
	}

	public Run(entities: Entity[], orchestrator: Orchestrator, deltaTime: number ): void {
		let currentPoints: number = 0;
		let currentMultiplier: number = 0;

		System.ApplyToIndividuals(
			entities,
			(entity: Entity): boolean => {
				return !!entity.scoreComponent;
			},
			(entity: Entity): void => {
				currentPoints += entity.scoreComponent.pointsValue;
				currentMultiplier += entity.scoreComponent.multiplierValue;
			}
		);

		// Assign the points if they have increased.
		if (currentPoints > this._points) {
			this._points = currentPoints;
		}
		if (currentMultiplier > this._multiplier) {
			this._multiplier = currentMultiplier;
		}
	}

	public ResetScore(): void {
		this._points = 0;
		this._multiplier = 0;
	}
}
