/// <reference path="block.ts" />
/// <reference path="point.ts" />
/// <reference path="IRenderable.ts" />
/// <reference path="player.ts" />
/// <reference path="particleText.ts" />

class Scoreboard extends Block {
	private static fontSizeInPx = 600;
	private static fontRotation = 30;
	private player: Player;
	private score: number;
	private static degrees = Math.PI / 180;
	private scoreToFade: number;
	
	public constructor(player: Player, worldPosition: MovingPoint, dimensions: Point, color: string) {
		super(worldPosition, dimensions, color);
		
		this.player = player;
		
		// Shouldn't have to insert the nested function like this.
		this.player.onBounce = () => {
			this.scoreToFade = this.score;
			this.score = this.score + 1;
			this.player.Bounce();
		}
		
		this.score = 0;
	}
	
	public Render(renderContext: CanvasRenderingContext2D): IRenderable[] {
		renderContext.beginPath();
		
		renderContext.save();
		
		renderContext.translate(this.centerXPosition, this.centerYPosition);
		renderContext.rotate(Scoreboard.fontRotation * Scoreboard.degrees);
		renderContext.translate(-this.centerXPosition, -this.centerYPosition);
		
		renderContext.fillStyle = this.fillColor;
		renderContext.font = "" + Scoreboard.fontSizeInPx + "px Oswald";
		renderContext.fillText(this.score.toString(), this.xPosition, this.yPosition + Scoreboard.fontSizeInPx);

		renderContext.restore();
		
		if(this.scoreToFade)
		{
			let score = this.scoreToFade;
			this.scoreToFade = undefined;
			
			return [new ParticleText(
				this.xPosition,
				this.yPosition,
				score.toString(),
				"Oswald",
				Scoreboard.fontSizeInPx,
				Scoreboard.fontRotation,
				this.fillColor,
				0.25
			)] as IRenderable[];
		}

		return [] as IRenderable[];
	}
}