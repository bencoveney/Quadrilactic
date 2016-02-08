/// <reference path="physicsBlock.ts" />

class Collider {
	public static processCollisions(collidables: PhysicsBlock[]){
		if(collidables.length <= 1)
		{
			// Need multiple objects to perform collisions
			return;
		}
		
		for(let i: number = 0; i < collidables.length - 1; i++)
		{
			let collisionAction = (subject: PhysicsBlock) => {
				subject.VerticalBounce();
			}
			
			let subject: PhysicsBlock = collidables[i];
			
			for(let j: number = i+1; j < collidables.length; j++)
			{
				let target: PhysicsBlock = collidables[j];
				
				let isVerticalOverlap: boolean = (subject.top < target.bottom) && ( subject.bottom > target.top );
				let isHorizontalOverlap: boolean = (subject.left < target.right) && ( subject.right > target.left );

				if(isVerticalOverlap && isHorizontalOverlap)
				{
					collisionAction(subject);
					collisionAction(target);
				}
			}
		}
	}
}