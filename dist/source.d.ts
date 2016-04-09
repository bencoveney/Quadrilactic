/// <reference path="../typings/tsd.d.ts" />
interface Point {
    x: number;
    y: number;
}
interface MovingPoint extends Point {
    dX: number;
    dY: number;
}
interface Rectangle extends Point {
    width: number;
    height: number;
}
declare class Controller {
    private static keyCodes;
    private isKeyPressedState;
    private mousePosition;
    private clickLocation;
    private canvas;
    constructor(canvas: HTMLCanvasElement);
    isKeyPressed(key: string | string[]): boolean;
    getMousePosition(): Point;
    getClickPosition(): Point;
    clearClick(): void;
    private handleKeyUp(event);
    private handleKeyDown(event);
    private handleMouseMove(event);
    private handleMouseDown(event);
}
interface Renderable {
    isAlive: boolean;
    Render(renderContext: CanvasRenderingContext2D): Renderable[];
}
declare class Particle implements Renderable {
    private static degrees;
    rotation: number;
    isAlive: boolean;
    private xPosition;
    private yPosition;
    private width;
    private height;
    private color;
    private opacity;
    private centerXPosition;
    private centerYPosition;
    constructor(xPosition: number, yPosition: number, width: number, height: number, rotation: number, color: string, opacity: number);
    Render(renderContext: CanvasRenderingContext2D): Renderable[];
}
declare class Block implements Renderable {
    private static verticalSpeedLimit;
    private static verticalSpeedLimitDelta;
    private static skewScale;
    private static skewReduction;
    isAlive: boolean;
    protected skew: number;
    private worldPosition;
    private dimensions;
    private internalColor;
    private onMoveCallback;
    private initialWorldPosition;
    private verticalSpeedLimit;
    private horizontalSpeedLimit;
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
    skewedPosition: Rectangle;
    direction: string;
    constructor(worldPosition: MovingPoint, dimensions: Point, color: string, xSpeedLimit: number);
    Tick(deltaTime: number): void;
    Render(renderContext: CanvasRenderingContext2D): Renderable[];
    Reset(): void;
}
interface SoundOptions {
    volume?: number;
    isLooping?: boolean;
}
declare class Sound {
    private static defaultVolume;
    private sound;
    constructor(path: string, options: SoundOptions);
    play(): void;
    volume: number;
}
declare class Volume implements Renderable {
    private static opacityDecay;
    private static fadedOpacity;
    isAlive: boolean;
    private soundButtonPosition;
    private soundButtonDimensions;
    private controller;
    private level;
    private volume0;
    private volume1;
    private volume2;
    private volume3;
    private volume4;
    private opacity;
    private sounds;
    private isVolumeKeyPressed;
    private volumeChanged;
    constructor(renderDimensions: Point, controller: Controller);
    Render(renderContext: CanvasRenderingContext2D): Renderable[];
    createSound(path: string, options: SoundOptions): Sound;
    private isPointOnButton(point);
    private changeVolume();
}
declare class PhysicsBlock extends Block {
    private internalGravity;
    private onBounceCallback;
    private worldWidth;
    private rebound;
    gravity: number;
    onBounce: () => void;
    constructor(worldPosition: MovingPoint, dimensions: Point, color: string, gravity: number, volume: Volume, xSpeedLimit: number, worldWidth?: number);
    Tick(deltaTime: number): void;
    Render(renderContext: CanvasRenderingContext2D): Renderable[];
    VerticalBounce(newYSpeed: number): void;
    Reset(): void;
}
declare class Sprite implements Renderable {
    isAlive: boolean;
    private image;
    private internalDimensions;
    constructor(imagePath: string, dimensions: Point);
    dimensions: Point;
    Render(renderContext: CanvasRenderingContext2D): Renderable[];
    private loaded();
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
    constructor(worldPosition: MovingPoint, dimensions: Point, color: string, controller: Controller, gravity: number, worldWidth: number, volume: Volume);
    Tick(deltaTime: number): void;
    Bounce(): void;
    Render(renderContext: CanvasRenderingContext2D): Renderable[];
    Reset(): void;
}
declare class Background implements Renderable {
    isAlive: boolean;
    showArrow: boolean;
    private renderPosition;
    private renderDimensions;
    private color;
    private offset;
    private staticBackground;
    private stars1;
    private stars2;
    private upArrow;
    constructor(renderPosition: Point, renderDimensions: Point, color: string, player: Player);
    SlideUpTo(y: number): void;
    Render(renderContext: CanvasRenderingContext2D): Renderable[];
    Reset(): void;
}
declare class Collider {
    static processCollisions(collidables: PhysicsBlock[]): void;
}
declare class ParticleText implements Renderable {
    private static degrees;
    isAlive: boolean;
    private xPosition;
    private yPosition;
    private text;
    private font;
    private fontSize;
    private rotation;
    private color;
    private opacity;
    constructor(xPosition: number, yPosition: number, text: string, fontName: string, fontSize: number, rotation: number, color: string, opacity: number);
    Render(renderContext: CanvasRenderingContext2D): Renderable[];
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
    Render(renderContext: CanvasRenderingContext2D): Renderable[];
    totalPoints: number;
    Reset(): void;
}
declare class Viewport {
    private renderContext;
    private fixedRenderables;
    private backgroundRenderables;
    private foregroundRenderables;
    private initialBackgroundRenderables;
    private initialForegroundRenderables;
    private renderOffset;
    renderDimensions: Point;
    offset: number;
    constructor(renderContext: CanvasRenderingContext2D, fixedRenderables: Renderable[], backgroundRenderables: Renderable[], foregroundRenderables: Renderable[]);
    SlideUpTo(y: number): void;
    Render(fps?: number): void;
    Reset(): void;
    private RenderSubSet(subSet);
}
declare class Menu implements Renderable {
    private static titleFontSizeInPx;
    private static scoreFontSizeInPx;
    private static playFontSizeInPx;
    private static buttonWidth;
    private static buttonHeight;
    private static fadeInRate;
    isAlive: boolean;
    private renderDimensions;
    private background;
    private isMenuOpen;
    private playButtonPosition;
    private isButtonHovered;
    private controller;
    private onStartGame;
    private opacity;
    private lastPoints;
    private scoreColor;
    private buttonHover;
    private buttonUnhover;
    private buttonClick;
    private controlPosition;
    private controlDiagram;
    constructor(renderDimensions: Point, controller: Controller, background: Background, onStartGame: () => void, volume: Volume);
    Render(renderContext: CanvasRenderingContext2D): Renderable[];
    showMenu(totalPoints: number, scoreColor: string): void;
    private isPointOnButton(point);
}
declare class Platform extends PhysicsBlock {
    private static platformSpeedIncrease;
    viewport: Viewport;
    private bottomOfScreen;
    private offscreenAmount;
    constructor(worldPosition: MovingPoint, dimensions: Point, color: string, gravity: number, volume: Volume, worldWidth: number);
    Tick(deltaTime: number): void;
    Render(renderContext: CanvasRenderingContext2D): Renderable[];
}
declare class Renderer {
    private static defaultGravity;
    private static gameWidth;
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
    private volume;
    private controller;
    constructor(canvas: HTMLCanvasElement, controller: Controller);
    Start(): void;
    private Tick(timestamp);
    private Draw();
}
declare let canvas: HTMLCanvasElement;
declare let controller: Controller;
