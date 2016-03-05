/// <reference path="../typings/tsd.d.ts" />
interface IRenderable {
    isAlive: boolean;
    Render(renderContext: CanvasRenderingContext2D): IRenderable[];
}
interface Point {
    x: number;
    y: number;
}
interface MovingPoint extends Point {
    dX: number;
    dY: number;
}
declare class Controller {
    private static keyCodes;
    private isKeyPressedState;
    private mousePosition;
    private clickLocation;
    private canvas;
    constructor(canvas: HTMLCanvasElement);
    private handleKeyUp(event);
    private handleKeyDown(event);
    private handleMouseMove(event);
    private handleMouseDown(event);
    isKeyPressed(key: string | string[]): boolean;
    getMousePosition(): Point;
    getClickPosition(): Point;
}
declare class Particle implements IRenderable {
    private static degrees;
    private xPosition;
    private yPosition;
    private width;
    private height;
    rotation: number;
    private color;
    private opacity;
    private centerXPosition;
    private centerYPosition;
    isAlive: boolean;
    constructor(xPosition: number, yPosition: number, width: number, height: number, rotation: number, color: string, opacity: number);
    Render(renderContext: CanvasRenderingContext2D): IRenderable[];
}
declare class Block implements IRenderable {
    private static verticalSpeedLimit;
    private static horizontalSpeedLimit;
    private static horizontalSpeedSlowDown;
    private worldPosition;
    private dimensions;
    private internalColor;
    private onMoveCallback;
    private initialWorldPosition;
    isAlive: boolean;
    xPosition: number;
    yPosition: number;
    xSpeed: number;
    ySpeed: number;
    width: number;
    height: number;
    fillColor: string;
    left: number;
    right: number;
    top: number;
    bottom: number;
    centerXPosition: number;
    centerYPosition: number;
    onMove: (amountMoved: Point) => void;
    direction: string;
    private static strokeColor;
    constructor(worldPosition: MovingPoint, dimensions: Point, color: string);
    Tick(deltaTime: number): void;
    Render(renderContext: CanvasRenderingContext2D): IRenderable[];
    Reset(): void;
}
interface ISoundOptions {
    volume?: number;
    isLooping?: boolean;
}
declare class Sound {
    private static defaultVolume;
    private sound;
    constructor(path: string, options: ISoundOptions);
    play(): void;
}
declare class PhysicsBlock extends Block {
    private internalGravity;
    private onBounceCallback;
    private worldWidth;
    private rebound;
    gravity: number;
    onBounce: () => void;
    constructor(worldPosition: MovingPoint, dimensions: Point, color: string, gravity: number, worldWidth?: number);
    Tick(deltaTime: number): void;
    Render(renderContext: CanvasRenderingContext2D): IRenderable[];
    VerticalBounce(newYSpeed: number): void;
    Reset(): void;
}
declare class Sprite implements IRenderable {
    private image;
    private dimensions;
    isAlive: boolean;
    constructor(imagePath: string, dimensions: Point);
    private loaded();
    Render(renderContext: CanvasRenderingContext2D): IRenderable[];
}
declare class Player extends PhysicsBlock {
    private static jumpSpeedIncrease;
    private static degrees;
    private static jumpRotationSlowDown;
    private static initialJumpRotationSpeed;
    private static horizontalSpeedIncrease;
    private static faceSwapThreshold;
    private isJumping;
    private jumpRotationAmount;
    private jumpRotationSpeed;
    private controller;
    private jump;
    private bounce;
    private faceUp;
    private faceDown;
    private faceHover;
    constructor(worldPosition: MovingPoint, dimensions: Point, color: string, controller: Controller, gravity: number, worldWidth: number);
    Tick(deltaTime: number): void;
    Bounce(): void;
    Render(renderContext: CanvasRenderingContext2D): IRenderable[];
    Reset(): void;
}
declare class Background implements IRenderable {
    private renderPosition;
    private renderDimensions;
    private color;
    private offset;
    isAlive: boolean;
    private staticBackground;
    private stars1;
    private stars2;
    constructor(renderPosition: Point, renderDimensions: Point, color: string, player: Player);
    SlideUp(amount: number): void;
    Render(renderContext: CanvasRenderingContext2D): IRenderable[];
}
declare class Collider {
    static processCollisions(collidables: PhysicsBlock[]): void;
}
declare class ParticleText implements IRenderable {
    private static degrees;
    private xPosition;
    private yPosition;
    private text;
    private font;
    private fontSize;
    private rotation;
    private color;
    private opacity;
    isAlive: boolean;
    constructor(xPosition: number, yPosition: number, text: string, fontName: string, fontSize: number, rotation: number, color: string, opacity: number);
    Render(renderContext: CanvasRenderingContext2D): IRenderable[];
}
declare class Scoreboard extends Block {
    private static fontSizeInPx;
    private static fontRotation;
    private static bouncePoints;
    private static degrees;
    private player;
    private score;
    private greatestHeightReached;
    private multiplier;
    private points;
    constructor(player: Player, worldPosition: MovingPoint, dimensions: Point, color: string);
    Render(renderContext: CanvasRenderingContext2D): IRenderable[];
    totalPoints: number;
    Reset(): void;
}
declare class Viewport {
    private renderContext;
    private fixedRenderables;
    private backgroundRenderables;
    private foregroundRenderables;
    private renderOffset;
    offset: number;
    constructor(renderContext: CanvasRenderingContext2D, fixedRenderables: IRenderable[], backgroundRenderables: IRenderable[], foregroundRenderables: IRenderable[]);
    SlideUp(amount: number): void;
    Render(): void;
    private RenderSubSet(subSet);
    Reset(): void;
}
declare class Menu implements IRenderable {
    private static titleFontSizeInPx;
    private static scoreFontSizeInPx;
    private static playFontSizeInPx;
    private static buttonWidth;
    private static buttonHeight;
    private static fadeInRate;
    private renderDimensions;
    private background;
    private isMenuOpen;
    private buttonPosition;
    private buttonDimensions;
    private isButtonHovered;
    private controller;
    private onStartGame;
    private opacity;
    private lastPoints;
    private scoreColor;
    constructor(renderDimensions: Point, controller: Controller, background: Background, onStartGame: () => void);
    isAlive: boolean;
    private isPointOnButton(point);
    Render(renderContext: CanvasRenderingContext2D): IRenderable[];
    showMenu(totalPoints: number, scoreColor: string): void;
}
declare class Renderer {
    private static defaultGravity;
    private static millisecondsPerTick;
    private static gameWidth;
    private static gameHeight;
    private static minimumPlatformReboundSpeed;
    private static timescale;
    private canvas;
    private context;
    private isRunning;
    private player;
    private platform;
    private scoreboard;
    private background;
    private menu;
    private viewport;
    private lastTimestamp;
    private lastFps;
    private backgroundMusic;
    private deathSound;
    constructor(canvas: HTMLCanvasElement, controller: Controller);
    Start(): void;
    private Tick(timestamp);
    private Draw();
    private SetUpNewGame();
}
declare let canvas: HTMLCanvasElement;
declare let controller: Controller;
declare let renderer: Renderer;
