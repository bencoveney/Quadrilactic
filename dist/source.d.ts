/// <reference path="../typings/tsd.d.ts" />
interface IRenderable {
    isAlive: boolean;
    Render(renderContext: CanvasRenderingContext2D): IRenderable[];
}
declare class Controller {
    private static keyCodes;
    private isKeyPressedState;
    constructor();
    private handleKeyUp(event);
    private handleKeyDown(event);
    isKeyPressed(key: string | string[]): boolean;
}
interface Point {
    x: number;
    y: number;
}
interface MovingPoint extends Point {
    dX: number;
    dY: number;
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
}
declare class PhysicsBlock extends Block {
    private internalGravity;
    private onBounceCallback;
    private worldWidth;
    gravity: number;
    onBounce: () => void;
    constructor(worldPosition: MovingPoint, dimensions: Point, color: string, gravity: number, worldWidth?: number);
    Tick(deltaTime: number): void;
    Render(renderContext: CanvasRenderingContext2D): IRenderable[];
    VerticalBounce(newYSpeed: number): void;
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
    private faceUp;
    private faceDown;
    private faceHover;
    constructor(worldPosition: MovingPoint, dimensions: Point, color: string, controller: Controller, gravity: number, worldWidth: number);
    Tick(deltaTime: number): void;
    Bounce(): void;
    Render(renderContext: CanvasRenderingContext2D): IRenderable[];
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
    private player;
    private score;
    private static degrees;
    private greatestHeightReached;
    private multiplier;
    private points;
    constructor(player: Player, worldPosition: MovingPoint, dimensions: Point, color: string);
    Render(renderContext: CanvasRenderingContext2D): IRenderable[];
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
    private viewport;
    private lastTimestamp;
    private lastFps;
    constructor(canvas: HTMLCanvasElement, controller: Controller);
    Start(): void;
    Stop(): void;
    private Tick(timestamp);
    private Draw();
}
declare let canvas: HTMLCanvasElement;
declare let controller: Controller;
declare let renderer: Renderer;
