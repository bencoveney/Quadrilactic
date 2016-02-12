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
			let collisionAction = (subject: PhysicsBlock, newYSpeed: number) => {
				subject.VerticalBounce(newYSpeed);
			}
			
			let subject: PhysicsBlock = collidables[i];
			
			for(let j: number = i+1; j < collidables.length; j++)
			{
				let target: PhysicsBlock = collidables[j];
				
				let isVerticalOverlap: boolean = (subject.top < target.bottom) && (subject.bottom > target.top);
				let isHorizontalOverlap: boolean = (subject.left < target.right) && (subject.right > target.left);

				if(isVerticalOverlap && isHorizontalOverlap)
				{
					// Always simulate a vertical bounce
					// If masses are the same speed can be swapped during an elastic collision
					let subjectYSpeed = subject.ySpeed;
					let targetYSpeed = target.ySpeed;
					collisionAction(subject, targetYSpeed);
					collisionAction(target, subjectYSpeed);
					
					// Only simulate a horizontal bound if the x overlap has just started
					let subjectPreviousLeft = subject.xPosition - subject.xSpeed;
					let subjectPreviousRight = subjectPreviousLeft + subject.width;
					let targetPreviousLeft = target.xPosition - target.xSpeed;
					let targetPreviousRight = targetPreviousLeft + target.width;
					
					let wasHorizontalOverlap: boolean =
						(subjectPreviousLeft < targetPreviousRight)
						&& (subjectPreviousRight > targetPreviousLeft);
					
					if(!wasHorizontalOverlap)
					{
						let subjectXSpeed = subject.xSpeed;
						let targetXSpeed = target.xSpeed;
						
						subject.xSpeed = targetXSpeed;
						target.xSpeed = subjectXSpeed;
					}
				}
			}
		}
	}
}