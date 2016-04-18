import {Entity} from "entitySystem/entity";
import {System} from "entitySystem/system";
import {Orchestrator} from "entitySystem/orchestrator";

export class CollisionSystem extends System {
	public Run(entities: Entity[], orchestrator: Orchestrator, deltaTime: number): void {
		System.ApplyToPairs(
			entities,
			(entity: Entity): boolean => {
				return !!entity.collisionComponent;
			},
			(entityA: Entity, entityB: Entity): void => {
				this.Collide(entityA, entityB, orchestrator, deltaTime);
			}
		);
	}

	private Collide(entityA: Entity, entityB: Entity, orchestrator: Orchestrator, deltaTime: number): void {

		let isVerticalOverlap: boolean =
			(entityA.locationComponent.top < entityB.locationComponent.bottom) &&
			(entityA.locationComponent.bottom > entityB.locationComponent.top);

		let isHorizontalOverlap: boolean =
			(entityA.locationComponent.left < entityB.locationComponent.right) &&
			(entityA.locationComponent.right > entityB.locationComponent.left);

		// If theres no overlap then return.
		if (!isHorizontalOverlap || !isVerticalOverlap) {
			return;
		}

		// Always simulate a vertical bounce
		// If masses are the same speed can be swapped during an elastic collision
		let entityAYSpeed: number = entityA.locationComponent.ySpeed;
		let entityBYSpeed: number = entityB.locationComponent.ySpeed;
		entityA.locationComponent.ySpeed = entityBYSpeed;
		entityB.locationComponent.ySpeed = entityAYSpeed;

		// Only simulate a horizontal bounce if the x overlap has just started
		let entityAPreviousLeft: number = entityA.locationComponent.xPosition - entityA.locationComponent.xSpeed;
		let entityAPreviousRight: number = entityAPreviousLeft + entityA.locationComponent.width;
		let entityBPreviousLeft: number = entityB.locationComponent.xPosition - entityA.locationComponent.xSpeed;
		let entityBPreviousRight: number = entityBPreviousLeft + entityB.locationComponent.width;

		let wasHorizontalOverlap: boolean =
			(entityAPreviousLeft < entityBPreviousRight)
			&& (entityAPreviousRight > entityBPreviousLeft);

		if (!wasHorizontalOverlap) {
			entityA.locationComponent.xSpeed = -entityA.locationComponent.xSpeed;
			entityB.locationComponent.xSpeed = -entityB.locationComponent.xSpeed;
		}

		if (entityA.collisionComponent.collisionCallback) {
			entityA.collisionComponent.collisionCallback();
		}
		if (entityB.collisionComponent.collisionCallback) {
			entityB.collisionComponent.collisionCallback();
		}
	}
}
