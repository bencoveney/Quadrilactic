import {Block} from "block";
import {MovingPoint, Point} from "point";
import {Renderable} from "renderable";
import {Player} from "player";

export class Scoreboard extends Block {
	private static fontSizeInPx: number = 200;
	private static fontRotation: number = 0;
	private static bouncePoints: number = 1;
	private static degrees: number = Math.PI / 180;

	private player: Player;
	private score: number;
	private greatestHeightReached: number;
	private multiplier: number;
	private points: number;

	public constructor(player: Player, worldPosition: MovingPoint, dimensions: Point, color: string) {
		super(worldPosition, dimensions, color, 0);

		this.player = player;

		let originalBounceHandler: Function = this.player.collisionComponent.collisionCallback;
		this.player.collisionComponent.collisionCallback = () => {
			this.score = Math.round((this.score + Scoreboard.bouncePoints) * 10) / 10;
			originalBounceHandler();
		};

		let originalOnMove: (amountMoved: Point) => void = this.player.onMove;
		this.player.onMove = (amountMoved: Point) => {

			let currentHeight: number = -this.player.locationComponent.top;
			if (currentHeight > this.greatestHeightReached) {
				this.greatestHeightReached = currentHeight;
				this.multiplier = Math.round(this.greatestHeightReached / 10) / 100;
				this.points = Math.round(this.score * this.multiplier * 10) / 10;
			}

			if (originalOnMove) {
				originalOnMove(amountMoved);
			}
		};

		this.score = 0;
		this.greatestHeightReached = 0;
		this.multiplier = 0;
		this.points = 0;
	}

	public Render(renderContext: CanvasRenderingContext2D): Renderable[] {
		renderContext.beginPath();

		renderContext.save();

		renderContext.fillStyle = this.fillColor;
		renderContext.font = "" + Scoreboard.fontSizeInPx + "px Oswald";

		renderContext.translate(this.locationComponent.centerXPosition, this.locationComponent.centerYPosition);
		renderContext.rotate(Scoreboard.fontRotation * Scoreboard.degrees);
		renderContext.translate(-this.locationComponent.centerXPosition, -this.locationComponent.centerYPosition);

		renderContext.fillText(
			this.score.toString(),
			this.locationComponent.xPosition,
			this.locationComponent.yPosition + Scoreboard.fontSizeInPx);

		renderContext.font = "" + (Scoreboard.fontSizeInPx / 2) + "px Oswald";
		renderContext.fillText(
			"x " + this.multiplier.toString(),
			this.locationComponent.xPosition,
			this.locationComponent.yPosition + (1.5 * Scoreboard.fontSizeInPx));

		renderContext.globalAlpha = 0.5;
		renderContext.fillStyle = this.player.fillColor;
		renderContext.fillText(
			"~ " + this.points.toString(),
			this.locationComponent.xPosition,
			this.locationComponent.yPosition + (2 * Scoreboard.fontSizeInPx));

		renderContext.restore();

		return [] as Renderable[];
	}

	public get totalPoints(): number {
		return this.points;
	}

	public Reset(): void {
		this.score = 0;
		this.greatestHeightReached = 0;
		this.multiplier = 0;
		this.points = 0;
	}
}
