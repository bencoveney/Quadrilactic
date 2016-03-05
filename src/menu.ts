/// <reference path="IRenderable.ts" />
/// <reference path="controller.ts" />
/// <reference path="background.ts" />

class Menu implements IRenderable {
	private static titleFontSizeInPx: number = 90;
	private static scoreFontSizeInPx: number = 50;
	private static playFontSizeInPx: number = 50;
	private static buttonWidth: number = 200;
	private static buttonHeight: number = 100;
	private static fadeInRate: number = 0.02;

	private renderDimensions: Point;
	private background: Background;
	private isMenuOpen: boolean;
	private buttonPosition: Point;
	private buttonDimensions: Point;
	private isButtonHovered: boolean;
	private controller: Controller;
	private onStartGame: () => void;
	private opacity: number;
	private lastPoints: number;
	private scoreColor: string;

	public constructor(
		renderDimensions: Point,
		controller: Controller,
		background: Background,
		onStartGame: () => void)
	{
		this.renderDimensions = renderDimensions;
		this.background = background;
		this.isMenuOpen = true;
		this.isButtonHovered = false;
		this.controller = controller;
		this.onStartGame = onStartGame;
		
		this.opacity = 0;
		
		this.buttonPosition = {
			x: (renderDimensions.x - Menu.buttonWidth) / 2,
			y: renderDimensions.y - (Menu.buttonHeight * 2)
		}
	}

	public isAlive = true;
	
	private isPointOnButton(point: Point): boolean
	{
		return point
			&& point.x > this.buttonPosition.x
			&& point.x < this.buttonPosition.x + Menu.buttonWidth
			&& point.y > this.buttonPosition.y
			&& point.y < this.buttonPosition.y + Menu.buttonHeight
	}
	
	public Render(renderContext: CanvasRenderingContext2D): IRenderable[]
	{
		let mouseClick = this.controller.getClickPosition();
		if(mouseClick && this.isPointOnButton(mouseClick))
		{
			this.onStartGame();
		}
		
		this.isButtonHovered = this.isPointOnButton(this.controller.getMousePosition());
		
		this.background.Render(renderContext);
		
		let horizontalCenter = (this.renderDimensions.x / 2);

		renderContext.save();

		renderContext.font = "" + Menu.titleFontSizeInPx + "px Oswald";
		renderContext.fillStyle = "rgba(255,255,255," + this.opacity + ")";
		renderContext.textAlign = "center";
		renderContext.fillText("Quadrilactic", horizontalCenter, Menu.titleFontSizeInPx + 50);
		
		if(this.lastPoints)
		{
			renderContext.save();
			
			renderContext.font = "" + Menu.scoreFontSizeInPx + "px Oswald";
			renderContext.fillStyle = this.scoreColor;
			renderContext.globalAlpha = this.opacity;
			renderContext.textAlign = "center";
			renderContext.fillText("Score: " + this.lastPoints, horizontalCenter, Menu.titleFontSizeInPx + Menu.scoreFontSizeInPx + 70);
			
			renderContext.restore();
		}

		if(this.isButtonHovered)
		{
			renderContext.fillRect(
				this.buttonPosition.x,
				this.buttonPosition.y,
				Menu.buttonWidth,
				Menu.buttonHeight);
		}
		renderContext.strokeStyle = "rgba(255,255,255," + this.opacity + ")";
		renderContext.lineWidth = 2;
		renderContext.strokeRect(
			this.buttonPosition.x,
			this.buttonPosition.y,
			Menu.buttonWidth,
			Menu.buttonHeight);

		renderContext.font = "" + Menu.playFontSizeInPx + "px Oswald";
		renderContext.fillStyle = (this.isButtonHovered ? "rgba(0,0,0," : "rgba(255,255,255,") + this.opacity + ")";
		renderContext.textAlign = "center";
		renderContext.fillText("Play", horizontalCenter, (Menu.playFontSizeInPx * 1.45) + this.buttonPosition.y);

		renderContext.restore();
		
		this.opacity = Math.min(1, this.opacity + Menu.fadeInRate);

		return [];
	}

	public showMenu(totalPoints: number, scoreColor: string)
	{
		this.isMenuOpen = true;
		this.opacity = 0;
		this.lastPoints = totalPoints;
		this.scoreColor = scoreColor;
	}
}