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
    direction: string;
    private static strokeColor;
    constructor(worldPosition: MovingPoint, dimensions: Point, color: string);
    Tick(): void;
    Render(renderContext: CanvasRenderingContext2D): IRenderable[];
}
declare class PhysicsBlock extends Block {
    private internalGravity;
    private internalBoundary;
    private internalBoundaryOffset;
    private onBounceCallback;
    gravity: number;
    boundary: Point;
    boundaryOffset: Point;
    leftBoundary: number;
    rightBoundary: number;
    topBoundary: number;
    bottomBoundary: number;
    onBounce: () => void;
    constructor(worldPosition: MovingPoint, dimensions: Point, color: string, gravity: number, boundary?: Point, boundaryOffset?: Point);
    Tick(): void;
    Render(renderContext: CanvasRenderingContext2D): IRenderable[];
    VerticalBounce(): void;
}
declare class Collider {
    static processCollisions(collidables: PhysicsBlock[]): void;
}
declare class Player extends PhysicsBlock {
    private static jumpSpeedIncrease;
    private static degrees;
    private static jumpRotationSlowDown;
    private static initialJumpRotationSpeed;
    private static horizontalSpeedIncrease;
    private isJumping;
    private jumpRotationAmount;
    private jumpRotationSpeed;
    private controller;
    constructor(worldPosition: MovingPoint, dimensions: Point, color: string, controller: Controller, gravity?: number, boundary?: Point, boundaryOffset?: Point);
    Tick(): void;
    Bounce(): void;
    Render(renderContext: CanvasRenderingContext2D): IRenderable[];
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
    private scoreToFade;
    constructor(player: Player, worldPosition: MovingPoint, dimensions: Point, color: string);
    Render(renderContext: CanvasRenderingContext2D): IRenderable[];
}
declare class Renderer {
    private static defaultGravity;
    private static millisecondsPerTick;
    private static gameWidth;
    private static gameHeight;
    private canvas;
    private context;
    private isRunning;
    private player;
    private platform;
    private scoreboard;
    private intervalId;
    private renderables;
    constructor(canvas: HTMLCanvasElement, controller: Controller);
    Start(): void;
    Stop(): void;
    private Tick();
    private Clear();
    private Draw();
}
declare let canvas: HTMLCanvasElement;
declare let controller: Controller;
declare let renderer: Renderer;
