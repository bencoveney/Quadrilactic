/// <reference path="IRenderable.ts" />
/// <reference path="controller.ts" />
/// <reference path="background.ts" />
/// <reference path="sound.ts" />
/// <reference path="volume.ts" />

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
	private playButtonPosition: Point;
	private isButtonHovered: boolean;
	private controller: Controller;
	private onStartGame: () => void;
	private opacity: number;
	private lastPoints: number;
	private scoreColor: string;
	private buttonHover: Sound;
	private buttonUnhover: Sound;
	private buttonClick: Sound;

	public constructor(
		renderDimensions: Point,
		controller: Controller,
		background: Background,
		onStartGame: () => void,
		volume: Volume)
	{
		this.renderDimensions = renderDimensions;
		this.background = background;
		this.isMenuOpen = true;
		this.isButtonHovered = false;
		this.controller = controller;
		this.onStartGame = onStartGame;
		
		this.opacity = 0;
		
		this.playButtonPosition = {
			x: (renderDimensions.x - Menu.buttonWidth) / 2,
			y: renderDimensions.y - (Menu.buttonHeight * 2)
		};
		
		this.buttonHover = volume.createSound("snd/button_on.wav", {});
		this.buttonUnhover = volume.createSound("snd/button_off.wav", {});
		this.buttonClick = volume.createSound("snd/button_click.wav", {});
	}

	public isAlive = true;
	
	private isPointOnButton(point: Point): boolean
	{
		return point
			&& point.x > this.playButtonPosition.x
			&& point.x < this.playButtonPosition.x + Menu.buttonWidth
			&& point.y > this.playButtonPosition.y
			&& point.y < this.playButtonPosition.y + Menu.buttonHeight
	}
	
	public Render(renderContext: CanvasRenderingContext2D): IRenderable[]
	{
		let mouseClick = this.controller.getClickPosition();
		if((mouseClick && this.isPointOnButton(mouseClick))
			|| this.controller.isKeyPressed("enter")
			|| this.controller.isKeyPressed("e"))
		{
			this.buttonClick.play();
			this.onStartGame();
		}
		
		let buttonIsNowHovered = this.isPointOnButton(this.controller.getMousePosition());

		if(buttonIsNowHovered && !this.isButtonHovered)
		{
			this.buttonHover.play();
		}
		else if (!buttonIsNowHovered && this.isButtonHovered)
		{
			this.buttonUnhover.play();
		}

		this.isButtonHovered = buttonIsNowHovered;

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
				this.playButtonPosition.x,
				this.playButtonPosition.y,
				Menu.buttonWidth,
				Menu.buttonHeight);
		}
		renderContext.strokeStyle = "rgba(255,255,255," + this.opacity + ")";
		renderContext.lineWidth = 2;
		renderContext.strokeRect(
			this.playButtonPosition.x,
			this.playButtonPosition.y,
			Menu.buttonWidth,
			Menu.buttonHeight);

		renderContext.font = "" + Menu.playFontSizeInPx + "px Oswald";
		renderContext.fillStyle = (this.isButtonHovered ? "rgba(0,0,0," : "rgba(255,255,255,") + this.opacity + ")";
		renderContext.textAlign = "center";
		renderContext.fillText("Play", horizontalCenter, (Menu.playFontSizeInPx * 1.45) + this.playButtonPosition.y);

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
