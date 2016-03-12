/// <reference path="point.ts" />
var Controller = (function () {
    function Controller(canvas) {
        var _this = this;
        this.isKeyPressedState = {
            space: false,
            left: false,
            up: false,
            right: false,
            a: false,
            d: false,
            m: false,
            v: false,
            w: false
        };
        this.canvas = canvas;
        window.addEventListener("keyup", function (event) {
            _this.handleKeyUp(event);
        });
        window.addEventListener("keydown", function (event) {
            _this.handleKeyDown(event);
        });
        canvas.addEventListener("mousemove", function (event) {
            _this.handleMouseMove(event);
        });
        canvas.addEventListener("mousedown", function (event) {
            _this.handleMouseDown(event);
        });
    }
    Controller.prototype.handleKeyUp = function (event) {
        var key = Controller.keyCodes[event.keyCode];
        this.isKeyPressedState[key] = false;
    };
    Controller.prototype.handleKeyDown = function (event) {
        var key = Controller.keyCodes[event.keyCode];
        this.isKeyPressedState[key] = true;
    };
    Controller.prototype.handleMouseMove = function (event) {
        var canvasElementPosition = this.canvas.getBoundingClientRect();
        this.mousePosition = {
            x: event.clientX - canvasElementPosition.left,
            y: event.clientY - canvasElementPosition.top,
        };
    };
    Controller.prototype.handleMouseDown = function (event) {
        var canvasElementPosition = this.canvas.getBoundingClientRect();
        this.clickLocation = {
            x: event.clientX - canvasElementPosition.left,
            y: event.clientY - canvasElementPosition.top,
        };
        event.preventDefault();
    };
    Controller.prototype.isKeyPressed = function (key) {
        var _this = this;
        var keys = [].concat(key);
        return keys.some(function (value) {
            return _this.isKeyPressedState[value];
        });
    };
    Controller.prototype.getMousePosition = function () {
        return this.mousePosition;
    };
    Controller.prototype.getClickPosition = function () {
        return this.clickLocation;
    };
    Controller.prototype.clearClick = function () {
        this.clickLocation = undefined;
    };
    Controller.keyCodes = {
        32: "space",
        37: "left",
        38: "up",
        39: "right",
        65: "a",
        68: "d",
        77: "m",
        86: "v",
        87: "w"
    };
    return Controller;
})();
/// <reference path="IRenderable.ts" />
var Particle = (function () {
    function Particle(xPosition, yPosition, width, height, rotation, color, opacity) {
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
        this.color = color;
        this.opacity = opacity;
        this.isAlive = true;
    }
    Object.defineProperty(Particle.prototype, "centerXPosition", {
        get: function () {
            return this.xPosition + (this.width / 2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Particle.prototype, "centerYPosition", {
        get: function () {
            return this.yPosition + (this.height / 2);
        },
        enumerable: true,
        configurable: true
    });
    Particle.prototype.Render = function (renderContext) {
        this.opacity -= 0.005;
        if (this.opacity <= 0) {
            this.isAlive = false;
        }
        else {
            renderContext.save();
            renderContext.globalAlpha = this.opacity;
            renderContext.translate(this.centerXPosition, this.centerYPosition);
            renderContext.rotate(this.rotation * Particle.degrees);
            renderContext.translate(-this.centerXPosition, -this.centerYPosition);
            renderContext.beginPath();
            renderContext.rect(this.xPosition, this.yPosition, this.width, this.height);
            renderContext.fillStyle = this.color;
            renderContext.fill();
            renderContext.closePath();
            renderContext.globalAlpha = 1;
            renderContext.restore();
        }
        return [];
    };
    Particle.degrees = Math.PI / 180;
    return Particle;
})();
/// <reference path="controller.ts" />
/// <reference path="point.ts" />
/// <reference path="IRenderable.ts" />
/// <reference path="particle.ts"" />
var Block = (function () {
    function Block(worldPosition, dimensions, color) {
        this.isAlive = true;
        this.worldPosition = worldPosition;
        this.dimensions = dimensions;
        this.internalColor = color;
        this.verticalSpeedLimit = Block.verticalSpeedLimit;
        this.initialWorldPosition = {
            x: worldPosition.x,
            y: worldPosition.y,
            dX: worldPosition.dX,
            dY: worldPosition.dY
        };
        this.skew = 0;
    }
    Object.defineProperty(Block.prototype, "xPosition", {
        // Position properties
        get: function () {
            return this.worldPosition.x;
        },
        set: function (newValue) {
            this.worldPosition.x = newValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "yPosition", {
        get: function () {
            return this.worldPosition.y;
        },
        set: function (newValue) {
            this.worldPosition.y = newValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "xSpeed", {
        get: function () {
            return this.worldPosition.dX;
        },
        set: function (newValue) {
            this.worldPosition.dX = newValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "ySpeed", {
        get: function () {
            return this.worldPosition.dY;
        },
        set: function (newValue) {
            this.worldPosition.dY = newValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "width", {
        get: function () {
            return this.dimensions.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "height", {
        get: function () {
            return this.dimensions.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "fillColor", {
        get: function () {
            return this.internalColor;
        },
        set: function (newValue) {
            this.internalColor = newValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "left", {
        get: function () {
            return this.worldPosition.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "right", {
        get: function () {
            return this.worldPosition.x + this.dimensions.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "top", {
        get: function () {
            return this.worldPosition.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "bottom", {
        get: function () {
            return this.worldPosition.y + this.dimensions.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "centerXPosition", {
        get: function () {
            return this.left + (this.width / 2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "centerYPosition", {
        get: function () {
            return this.top + (this.height / 2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "onMove", {
        get: function () {
            return this.onMoveCallback;
        },
        set: function (newValue) {
            this.onMoveCallback = newValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "skewedPosition", {
        get: function () {
            var skewAdjustment = this.skew == 0 ? 0 : Math.sin(this.skew);
            skewAdjustment = skewAdjustment * this.skew;
            var widthAdjustment = (skewAdjustment * this.width * Block.skewScale);
            var heightAdjustment = (skewAdjustment * this.height * Block.skewScale);
            return {
                x: this.xPosition + (widthAdjustment / 2),
                y: this.yPosition - (heightAdjustment / 2),
                width: this.width - widthAdjustment,
                height: this.height + heightAdjustment
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "direction", {
        // Direction properties
        get: function () {
            return this.xSpeed >= 0 ? "right" : "left";
        },
        enumerable: true,
        configurable: true
    });
    Block.prototype.Tick = function (deltaTime) {
        // Move "forward".
        this.xPosition += (this.xSpeed * deltaTime);
        this.yPosition += (this.ySpeed * deltaTime);
        if (this.onMoveCallback) {
            // The amount moved this tick is the same as the speed.
            this.onMoveCallback({ x: this.xSpeed, y: this.ySpeed });
        }
        this.skew = Math.max(0, this.skew - (Block.skewReduction * deltaTime));
        this.verticalSpeedLimit += Block.verticalSpeedLimitDelta * deltaTime;
        // Clamp the speed to the speed limit.
        this.ySpeed = Math.min(this.ySpeed, this.verticalSpeedLimit);
        this.ySpeed = Math.max(this.ySpeed, -this.verticalSpeedLimit);
        this.xSpeed = Math.min(this.xSpeed, Block.horizontalSpeedLimit);
        this.xSpeed = Math.max(this.xSpeed, -Block.horizontalSpeedLimit);
    };
    Block.prototype.Render = function (renderContext) {
        renderContext.beginPath();
        var skewedPosition = this.skewedPosition;
        renderContext.rect(skewedPosition.x, skewedPosition.y, skewedPosition.width, skewedPosition.height);
        renderContext.fillStyle = this.fillColor;
        renderContext.fill();
        renderContext.closePath();
        var particle = new Particle(skewedPosition.x, skewedPosition.y, skewedPosition.width, skewedPosition.height, 0, this.fillColor, 0.15);
        return [particle];
    };
    Block.prototype.Reset = function () {
        this.worldPosition = {
            x: this.initialWorldPosition.x,
            y: this.initialWorldPosition.y,
            dX: this.initialWorldPosition.dX,
            dY: this.initialWorldPosition.dY
        };
        this.verticalSpeedLimit = Block.verticalSpeedLimit;
    };
    // Constants
    Block.verticalSpeedLimit = 10;
    Block.verticalSpeedLimitDelta = 0.01;
    Block.horizontalSpeedLimit = 5;
    Block.horizontalSpeedSlowDown = 0.1;
    Block.skewScale = 0.07;
    Block.skewReduction = 0.3;
    // Constants
    Block.strokeColor = "#000000";
    return Block;
})();
var Sound = (function () {
    function Sound(path, options) {
        this.sound = new Audio(path);
        this.sound.volume = options.volume || Sound.defaultVolume;
        this.sound.loop = options.isLooping === true;
    }
    Sound.prototype.play = function () {
        this.sound.play();
    };
    Object.defineProperty(Sound.prototype, "volume", {
        set: function (newVolume) {
            this.sound.volume = newVolume;
        },
        enumerable: true,
        configurable: true
    });
    Sound.defaultVolume = 0.3;
    return Sound;
})();
/// <reference path="IRenderable.ts" />
/// <reference path="controller.ts" />
/// <reference path="sound.ts" />
var Volume = (function () {
    function Volume(renderDimensions, controller) {
        this.isAlive = true;
        this.controller = controller;
        this.soundButtonPosition = {
            x: renderDimensions.x - 40,
            y: 10
        };
        this.soundButtonDimensions = {
            x: 30,
            y: 30
        };
        this.opacity = Volume.fadedOpacity;
        this.level = 2;
        this.volume0 = new Sprite("img/volume0.png", this.soundButtonDimensions);
        this.volume1 = new Sprite("img/volume1.png", this.soundButtonDimensions);
        this.volume2 = new Sprite("img/volume2.png", this.soundButtonDimensions);
        this.volume3 = new Sprite("img/volume3.png", this.soundButtonDimensions);
        this.volume4 = new Sprite("img/volume4.png", this.soundButtonDimensions);
        this.isVolumeKeyPressed = false;
        this.sounds = [];
    }
    Volume.prototype.isPointOnButton = function (point) {
        return point
            && point.x > this.soundButtonPosition.x
            && point.x < this.soundButtonPosition.x + this.soundButtonDimensions.x
            && point.y > this.soundButtonPosition.y
            && point.y < this.soundButtonPosition.y + this.soundButtonDimensions.y;
    };
    Volume.prototype.Render = function (renderContext) {
        var mouseClick = this.controller.getClickPosition();
        if (mouseClick && this.isPointOnButton(mouseClick)) {
            this.changeVolume();
        }
        if (this.isPointOnButton(this.controller.getMousePosition())) {
            this.opacity = 1;
        }
        if (this.controller.isKeyPressed(["m", "v"])) {
            if (!this.isVolumeKeyPressed) {
                this.changeVolume();
                this.isVolumeKeyPressed = true;
            }
        }
        else {
            this.isVolumeKeyPressed = false;
        }
        this.opacity = Math.max(this.opacity - Volume.opacityDecay, Volume.fadedOpacity);
        renderContext.save();
        renderContext.globalAlpha = this.opacity;
        renderContext.translate(this.soundButtonPosition.x, this.soundButtonPosition.y);
        switch (this.level) {
            case 0:
                this.volume0.Render(renderContext);
                break;
            case 1:
                this.volume1.Render(renderContext);
                break;
            case 2:
                this.volume2.Render(renderContext);
                break;
            case 3:
                this.volume3.Render(renderContext);
                break;
            case 4:
                this.volume4.Render(renderContext);
                break;
        }
        renderContext.restore();
        return [];
    };
    Volume.prototype.changeVolume = function () {
        var _this = this;
        this.opacity = 1;
        this.level = Math.round(this.level >= 4 ? 0 : this.level + 1);
        this.sounds.forEach(function (sound) {
            sound.volume = _this.level / 5;
        });
    };
    Volume.prototype.createSound = function (path, options) {
        var newSound = new Sound(path, options);
        newSound.volume = this.level / 5;
        this.sounds.push(newSound);
        return newSound;
    };
    Volume.opacityDecay = 0.02;
    Volume.fadedOpacity = 0.4;
    return Volume;
})();
/// <reference path="block.ts" />
/// <reference path="point.ts" />
/// <reference path="IRenderable.ts" />
/// <reference path="sound.ts" />
/// <reference path="volume.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PhysicsBlock = (function (_super) {
    __extends(PhysicsBlock, _super);
    function PhysicsBlock(worldPosition, dimensions, color, gravity, volume, worldWidth) {
        _super.call(this, worldPosition, dimensions, color);
        this.internalGravity = gravity;
        this.worldWidth = worldWidth;
        this.rebound = volume.createSound("snd/blip.wav", {});
    }
    Object.defineProperty(PhysicsBlock.prototype, "gravity", {
        get: function () {
            return this.internalGravity;
        },
        set: function (newValue) {
            this.internalGravity = newValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PhysicsBlock.prototype, "onBounce", {
        get: function () {
            return this.onBounceCallback;
        },
        set: function (newValue) {
            this.onBounceCallback = newValue;
        },
        enumerable: true,
        configurable: true
    });
    PhysicsBlock.prototype.Tick = function (deltaTime) {
        _super.prototype.Tick.call(this, deltaTime);
        // If off the right, bounce left
        if (this.right > this.worldWidth) {
            this.rebound.play();
            // Clamp on screen, invert horizontal speed
            this.skew += 3;
            this.xPosition = this.worldWidth - this.width;
            this.xSpeed = -Math.abs(this.xSpeed);
        }
        // If off the left, bounce right
        if (this.left < 0) {
            this.rebound.play();
            // Clamp on screen, invert horizontal speed
            this.xPosition = 0;
            this.skew += 3;
            this.xSpeed = Math.abs(this.xSpeed);
        }
        // Apply acceleration due to gravity
        this.ySpeed += (this.internalGravity * deltaTime);
    };
    PhysicsBlock.prototype.Render = function (renderContext) {
        return _super.prototype.Render.call(this, renderContext);
    };
    PhysicsBlock.prototype.VerticalBounce = function (newYSpeed) {
        this.ySpeed = newYSpeed;
        this.skew += 10;
        // Allow insertion of bouncing code
        if (this.onBounceCallback) {
            this.onBounceCallback();
        }
    };
    PhysicsBlock.prototype.Reset = function () {
        _super.prototype.Reset.call(this);
    };
    return PhysicsBlock;
})(Block);
/// <reference path="IRenderable.ts" />
/// <reference path="point.ts" />
var Sprite = (function () {
    function Sprite(imagePath, dimensions) {
        var _this = this;
        this.isAlive = true;
        this.image = new Image();
        this.image.addEventListener("load", function () { _this.loaded(); }, false);
        this.image.src = imagePath;
        this.dimensions = dimensions;
    }
    Object.defineProperty(Sprite.prototype, "dimensions", {
        set: function (dimensions) {
            this.internalDimensions = dimensions;
        },
        enumerable: true,
        configurable: true
    });
    Sprite.prototype.loaded = function () {
        console.log("Loaded: " + this.image.src);
    };
    Sprite.prototype.Render = function (renderContext) {
        renderContext.drawImage(this.image, 
        // Source dimensions
        0, 0, this.image.width, this.image.height, 
        // Destination dimensions
        0, 0, this.internalDimensions.x, this.internalDimensions.y);
        return [];
    };
    return Sprite;
})();
/// <reference path="controller.ts" />
/// <reference path="physicsBlock.ts" />
/// <reference path="point.ts" />
/// <reference path="IRenderable.ts" />
/// <reference path="sprite.ts" />
/// <reference path="sound.ts" />
/// <reference path="volume.ts" />
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(worldPosition, dimensions, color, controller, gravity, worldWidth, volume) {
        _super.call(this, worldPosition, dimensions, color, gravity, volume, worldWidth);
        this.onBounce = this.Bounce;
        this.controller = controller;
        this.isJumping = false;
        this.jumpRotationAmount = 0;
        this.faceUp = new Sprite("img/faceHappy.png", dimensions);
        this.faceDown = new Sprite("img/faceWorried.png", dimensions);
        this.faceHover = new Sprite("img/faceChill.png", dimensions);
        this.jump = volume.createSound("snd/jump.wav", {});
        this.bounce = volume.createSound("snd/blip3.wav", {});
    }
    Player.prototype.Tick = function (deltaTime) {
        _super.prototype.Tick.call(this, deltaTime);
        // Perform the jump
        if (!this.isJumping && this.controller.isKeyPressed(["up", "space", "w"])) {
            this.jump.play();
            this.ySpeed = Player.jumpSpeedIncrease * deltaTime;
            this.isJumping = true;
            this.jumpRotationSpeed = this.direction == "right" ? Player.initialJumpRotationSpeed : -Player.initialJumpRotationSpeed;
        }
        // Allow influence over horizontal direction
        if (this.controller.isKeyPressed(["left", "a"])) {
            this.xSpeed -= (Player.horizontalSpeedIncrease * deltaTime);
        }
        if (this.controller.isKeyPressed(["right", "d"])) {
            this.xSpeed += (Player.horizontalSpeedIncrease * deltaTime);
        }
        // Apply jump rotation
        this.jumpRotationAmount += (this.jumpRotationSpeed * deltaTime);
        if (this.jumpRotationSpeed > 0) {
            this.jumpRotationSpeed = Math.max(0, this.jumpRotationSpeed - Player.jumpRotationSlowDown);
        }
        else if (this.jumpRotationSpeed < 0) {
            this.jumpRotationSpeed = Math.min(0, this.jumpRotationSpeed + Player.jumpRotationSlowDown);
        }
        this.jumpRotationAmount += this.xSpeed / 2;
    };
    Player.prototype.Bounce = function () {
        // If we were jumping, thats over now
        this.isJumping = false;
        this.jumpRotationAmount = 0;
        this.jumpRotationSpeed = 0;
        this.bounce.play();
    };
    Player.prototype.Render = function (renderContext) {
        var _this = this;
        renderContext.save();
        renderContext.translate(this.centerXPosition, this.centerYPosition);
        renderContext.rotate(this.jumpRotationAmount * Player.degrees);
        renderContext.translate(-this.centerXPosition, -this.centerYPosition);
        var faceSprite;
        if (this.ySpeed > Player.faceSwapThreshold) {
            faceSprite = this.faceDown;
        }
        else if (this.ySpeed < -Player.faceSwapThreshold) {
            faceSprite = this.faceUp;
        }
        else {
            faceSprite = this.faceHover;
        }
        var xHexidecimal = Math.round(15 - Math.abs(this.xSpeed)).toString(16);
        var yHexidecimal = Math.round(15 - Math.abs(this.ySpeed)).toString(16);
        this.fillColor = "#" + yHexidecimal + yHexidecimal + "ff" + xHexidecimal + xHexidecimal;
        var newRenderables = _super.prototype.Render.call(this, renderContext);
        newRenderables.forEach(function (renderable) {
            renderable.rotation = _this.jumpRotationAmount;
        });
        renderContext.restore();
        renderContext.save();
        renderContext.translate(this.centerXPosition, this.centerYPosition);
        renderContext.rotate(this.jumpRotationAmount * Player.degrees);
        renderContext.translate(-this.centerXPosition, -this.centerYPosition);
        var skewedPosition = this.skewedPosition;
        renderContext.translate(skewedPosition.x, skewedPosition.y);
        faceSprite.dimensions = {
            x: skewedPosition.width,
            y: skewedPosition.height
        };
        newRenderables = newRenderables.concat(faceSprite.Render(renderContext));
        renderContext.restore();
        return newRenderables;
    };
    Player.prototype.Reset = function () {
        _super.prototype.Reset.call(this);
        this.isJumping = false;
        this.jumpRotationAmount = 0;
        this.jumpRotationSpeed = 0;
    };
    Player.jumpSpeedIncrease = -8;
    Player.degrees = Math.PI / 180;
    Player.jumpRotationSlowDown = 0.1;
    Player.initialJumpRotationSpeed = 15;
    Player.horizontalSpeedIncrease = 0.5;
    Player.faceSwapThreshold = 3.5;
    return Player;
})(PhysicsBlock);
/// <reference path="block.ts" />
/// <reference path="point.ts" />
/// <reference path="IRenderable.ts" />
/// <reference path="player.ts" />
/// <reference path="sprite.ts" />
var Background = (function () {
    function Background(renderPosition, renderDimensions, color, player) {
        this.offset = 0;
        this.isAlive = true;
        this.renderPosition = renderPosition;
        this.renderDimensions = renderDimensions;
        this.color = color;
        this.staticBackground = new Sprite("img/staticBackground.png", renderDimensions);
        this.stars1 = new Sprite("img/stars1.png", { x: renderDimensions.x, y: renderDimensions.y * 2 });
        this.stars2 = new Sprite("img/stars2.png", { x: renderDimensions.x, y: renderDimensions.y * 2 });
    }
    Background.prototype.SlideUp = function (amount) {
        if (amount < 0) {
            this.offset = this.offset - amount;
        }
    };
    Background.prototype.Render = function (renderContext) {
        var result = [];
        result = result.concat(this.staticBackground.Render(renderContext));
        var lowerYPosition1 = this.offset % (this.renderDimensions.y * 2);
        var upperYPosition1 = lowerYPosition1 - (this.renderDimensions.y * 2);
        renderContext.save();
        renderContext.translate(0, lowerYPosition1);
        result = result.concat(this.stars1.Render(renderContext));
        renderContext.restore();
        renderContext.save();
        renderContext.translate(0, upperYPosition1);
        result = result.concat(this.stars1.Render(renderContext));
        renderContext.restore();
        var lowerYPosition2 = (this.offset / 2) % (this.renderDimensions.y * 2);
        var upperYPosition2 = lowerYPosition2 - (this.renderDimensions.y * 2);
        renderContext.save();
        renderContext.translate(0, lowerYPosition2);
        result = result.concat(this.stars2.Render(renderContext));
        renderContext.restore();
        renderContext.save();
        renderContext.translate(0, upperYPosition2);
        result = result.concat(this.stars2.Render(renderContext));
        renderContext.restore();
        return result;
    };
    return Background;
})();
/// <reference path="physicsBlock.ts" />
var Collider = (function () {
    function Collider() {
    }
    Collider.processCollisions = function (collidables) {
        if (collidables.length <= 1) {
            // Need multiple objects to perform collisions
            return;
        }
        for (var i = 0; i < collidables.length - 1; i++) {
            var collisionAction = function (subject, newYSpeed) {
                subject.VerticalBounce(newYSpeed);
            };
            var subject = collidables[i];
            for (var j = i + 1; j < collidables.length; j++) {
                var target = collidables[j];
                var isVerticalOverlap = (subject.top < target.bottom) && (subject.bottom > target.top);
                var isHorizontalOverlap = (subject.left < target.right) && (subject.right > target.left);
                if (isVerticalOverlap && isHorizontalOverlap) {
                    // Always simulate a vertical bounce
                    // If masses are the same speed can be swapped during an elastic collision
                    var subjectYSpeed = subject.ySpeed;
                    var targetYSpeed = target.ySpeed;
                    collisionAction(subject, targetYSpeed);
                    collisionAction(target, subjectYSpeed);
                    // Only simulate a horizontal bound if the x overlap has just started
                    var subjectPreviousLeft = subject.xPosition - subject.xSpeed;
                    var subjectPreviousRight = subjectPreviousLeft + subject.width;
                    var targetPreviousLeft = target.xPosition - target.xSpeed;
                    var targetPreviousRight = targetPreviousLeft + target.width;
                    var wasHorizontalOverlap = (subjectPreviousLeft < targetPreviousRight)
                        && (subjectPreviousRight > targetPreviousLeft);
                    if (!wasHorizontalOverlap) {
                        var subjectXSpeed = subject.xSpeed;
                        var targetXSpeed = target.xSpeed;
                        subject.xSpeed = targetXSpeed;
                        target.xSpeed = subjectXSpeed;
                    }
                }
            }
        }
    };
    return Collider;
})();
/// <reference path="IRenderable.ts" />
var ParticleText = (function () {
    function ParticleText(xPosition, yPosition, text, fontName, fontSize, rotation, color, opacity) {
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.text = text;
        this.font = fontSize.toString() + "px " + fontName;
        this.fontSize = fontSize;
        this.rotation = rotation;
        this.color = color;
        this.opacity = opacity;
        this.isAlive = true;
    }
    ParticleText.prototype.Render = function (renderContext) {
        this.opacity -= 0.005;
        if (this.opacity <= 0) {
            this.isAlive = false;
        }
        else {
            renderContext.save();
            renderContext.globalAlpha = this.opacity;
            renderContext.translate(this.xPosition, this.yPosition);
            renderContext.rotate(this.rotation * ParticleText.degrees);
            renderContext.translate(-this.xPosition, -this.yPosition);
            renderContext.fillStyle = this.color;
            renderContext.font = this.font;
            renderContext.fillText(this.text.toString(), this.xPosition, this.yPosition + this.fontSize);
            renderContext.globalAlpha = 1;
            renderContext.restore();
        }
        return [];
    };
    ParticleText.degrees = Math.PI / 180;
    return ParticleText;
})();
/// <reference path="block.ts" />
/// <reference path="point.ts" />
/// <reference path="IRenderable.ts" />
/// <reference path="player.ts" />
/// <reference path="particleText.ts" />
var Scoreboard = (function (_super) {
    __extends(Scoreboard, _super);
    function Scoreboard(player, worldPosition, dimensions, color) {
        var _this = this;
        _super.call(this, worldPosition, dimensions, color);
        this.player = player;
        // Shouldn't have to insert the nested function like this.
        this.player.onBounce = function () {
            _this.score = Math.round((_this.score + Scoreboard.bouncePoints) * 10) / 10;
            _this.player.Bounce();
        };
        var originalOnMove = this.player.onMove;
        this.player.onMove = function (amountMoved) {
            var currentHeight = -_this.player.top;
            if (currentHeight > _this.greatestHeightReached) {
                _this.greatestHeightReached = currentHeight;
                _this.multiplier = Math.round(_this.greatestHeightReached / 10) / 100;
                _this.points = Math.round(_this.score * _this.multiplier * 10) / 10;
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
    Scoreboard.prototype.Render = function (renderContext) {
        renderContext.beginPath();
        renderContext.save();
        renderContext.fillStyle = this.fillColor;
        renderContext.font = "" + Scoreboard.fontSizeInPx + "px Oswald";
        renderContext.translate(this.centerXPosition, this.centerYPosition);
        renderContext.rotate(Scoreboard.fontRotation * Scoreboard.degrees);
        renderContext.translate(-this.centerXPosition, -this.centerYPosition);
        renderContext.fillText(this.score.toString(), this.xPosition, this.yPosition + Scoreboard.fontSizeInPx);
        renderContext.font = "" + (Scoreboard.fontSizeInPx / 2) + "px Oswald";
        renderContext.fillText("x " + this.multiplier.toString(), this.xPosition, this.yPosition + (1.5 * Scoreboard.fontSizeInPx));
        renderContext.fillStyle = this.player.fillColor;
        renderContext.fillText("~ " + this.points.toString(), this.xPosition, this.yPosition + (2 * Scoreboard.fontSizeInPx));
        renderContext.restore();
        return [];
    };
    Object.defineProperty(Scoreboard.prototype, "totalPoints", {
        get: function () {
            return this.points;
        },
        enumerable: true,
        configurable: true
    });
    Scoreboard.prototype.Reset = function () {
        this.score = 0;
        this.greatestHeightReached = 0;
        this.multiplier = 0;
        this.points = 0;
    };
    Scoreboard.fontSizeInPx = 200;
    Scoreboard.fontRotation = 0;
    Scoreboard.bouncePoints = 1;
    Scoreboard.degrees = Math.PI / 180;
    return Scoreboard;
})(Block);
/// <reference path="point.ts" />
/// <reference path="IRenderable.ts" />
var Viewport = (function () {
    function Viewport(renderContext, fixedRenderables, backgroundRenderables, foregroundRenderables) {
        this.renderContext = renderContext;
        this.fixedRenderables = fixedRenderables;
        this.backgroundRenderables = backgroundRenderables;
        this.foregroundRenderables = foregroundRenderables;
        this.renderOffset = 0;
    }
    Object.defineProperty(Viewport.prototype, "offset", {
        get: function () {
            return this.renderOffset;
        },
        enumerable: true,
        configurable: true
    });
    Viewport.prototype.SlideUp = function (amount) {
        if (amount < 0) {
            this.renderOffset = this.renderOffset - amount;
        }
    };
    Viewport.prototype.Render = function (fps) {
        this.renderContext.save();
        this.renderContext.translate(0, this.renderOffset);
        this.backgroundRenderables = this.RenderSubSet(this.backgroundRenderables);
        this.renderContext.restore();
        this.fixedRenderables = this.RenderSubSet(this.fixedRenderables);
        this.renderContext.save();
        this.renderContext.translate(0, this.renderOffset);
        this.foregroundRenderables = this.RenderSubSet(this.foregroundRenderables);
        this.renderContext.restore();
        if (fps) {
            this.renderContext.fillStyle = '#FFFFFF';
            this.renderContext.fillText("FPS: " + fps.toString(), 0, 10);
        }
    };
    Viewport.prototype.RenderSubSet = function (subSet) {
        var newRenderables = subSet;
        for (var i = 0; i < subSet.length; i++) {
            newRenderables = subSet[i].Render(this.renderContext).concat(newRenderables);
        }
        return newRenderables.filter(function (renderable) {
            return renderable.isAlive;
        });
    };
    Viewport.prototype.Reset = function () {
        this.renderOffset = 0;
    };
    return Viewport;
})();
/// <reference path="IRenderable.ts" />
/// <reference path="controller.ts" />
/// <reference path="background.ts" />
var Menu = (function () {
    function Menu(renderDimensions, controller, background, onStartGame) {
        this.isAlive = true;
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
    }
    Menu.prototype.isPointOnButton = function (point) {
        return point
            && point.x > this.playButtonPosition.x
            && point.x < this.playButtonPosition.x + Menu.buttonWidth
            && point.y > this.playButtonPosition.y
            && point.y < this.playButtonPosition.y + Menu.buttonHeight;
    };
    Menu.prototype.Render = function (renderContext) {
        var mouseClick = this.controller.getClickPosition();
        if (mouseClick && this.isPointOnButton(mouseClick)) {
            this.onStartGame();
        }
        this.isButtonHovered = this.isPointOnButton(this.controller.getMousePosition());
        this.background.Render(renderContext);
        var horizontalCenter = (this.renderDimensions.x / 2);
        renderContext.save();
        renderContext.font = "" + Menu.titleFontSizeInPx + "px Oswald";
        renderContext.fillStyle = "rgba(255,255,255," + this.opacity + ")";
        renderContext.textAlign = "center";
        renderContext.fillText("Quadrilactic", horizontalCenter, Menu.titleFontSizeInPx + 50);
        if (this.lastPoints) {
            renderContext.save();
            renderContext.font = "" + Menu.scoreFontSizeInPx + "px Oswald";
            renderContext.fillStyle = this.scoreColor;
            renderContext.globalAlpha = this.opacity;
            renderContext.textAlign = "center";
            renderContext.fillText("Score: " + this.lastPoints, horizontalCenter, Menu.titleFontSizeInPx + Menu.scoreFontSizeInPx + 70);
            renderContext.restore();
        }
        if (this.isButtonHovered) {
            renderContext.fillRect(this.playButtonPosition.x, this.playButtonPosition.y, Menu.buttonWidth, Menu.buttonHeight);
        }
        renderContext.strokeStyle = "rgba(255,255,255," + this.opacity + ")";
        renderContext.lineWidth = 2;
        renderContext.strokeRect(this.playButtonPosition.x, this.playButtonPosition.y, Menu.buttonWidth, Menu.buttonHeight);
        renderContext.font = "" + Menu.playFontSizeInPx + "px Oswald";
        renderContext.fillStyle = (this.isButtonHovered ? "rgba(0,0,0," : "rgba(255,255,255,") + this.opacity + ")";
        renderContext.textAlign = "center";
        renderContext.fillText("Play", horizontalCenter, (Menu.playFontSizeInPx * 1.45) + this.playButtonPosition.y);
        renderContext.restore();
        this.opacity = Math.min(1, this.opacity + Menu.fadeInRate);
        return [];
    };
    Menu.prototype.showMenu = function (totalPoints, scoreColor) {
        this.isMenuOpen = true;
        this.opacity = 0;
        this.lastPoints = totalPoints;
        this.scoreColor = scoreColor;
    };
    Menu.titleFontSizeInPx = 90;
    Menu.scoreFontSizeInPx = 50;
    Menu.playFontSizeInPx = 50;
    Menu.buttonWidth = 200;
    Menu.buttonHeight = 100;
    Menu.fadeInRate = 0.02;
    return Menu;
})();
/// <reference path="player.ts" />
/// <reference path="controller.ts" />
/// <reference path="point.ts" />
/// <reference path="collider.ts" />
/// <reference path="IRenderable.ts" />
/// <reference path="scoreboard.ts" />
/// <reference path="background.ts" />
/// <reference path="viewport.ts" />
/// <reference path="sound.ts" />
/// <reference path="menu.ts" />
/// <reference path="volume.ts" />
var Renderer = (function () {
    function Renderer(canvas, controller) {
        var _this = this;
        // State
        this.isRunning = false;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.controller = controller;
        this.volume = new Volume({
            x: this.canvas.width,
            y: this.canvas.height
        }, controller);
        this.backgroundMusic = this.volume.createSound("snd/music.wav", { isLooping: true });
        this.backgroundMusic.play();
        this.deathSound = this.volume.createSound("snd/death.wav", {});
        var gameLeft = (this.canvas.width - Renderer.gameWidth) / 2;
        var playerPosition = {
            x: 30,
            y: 110,
            dX: 2,
            dY: -2
        };
        var playerDimensions = {
            x: 30,
            y: 30
        };
        this.player = new Player(playerPosition, playerDimensions, "#FF0000", controller, Renderer.defaultGravity, Renderer.gameWidth, this.volume);
        this.background = new Background({ x: 0, y: 0 }, { x: this.canvas.width, y: this.canvas.height }, "#222222", this.player);
        var platformPosition = {
            x: 30,
            y: 690,
            dX: 2,
            dY: 2
        };
        var platformDimensions = {
            x: 90,
            y: 20
        };
        this.platform = new PhysicsBlock(platformPosition, platformDimensions, "#FFFFFF", -Renderer.defaultGravity, this.volume, Renderer.gameWidth);
        this.platform.onBounce = function () {
            if (_this.platform.ySpeed < Renderer.minimumPlatformReboundSpeed) {
                _this.platform.ySpeed = Renderer.minimumPlatformReboundSpeed;
            }
        };
        var scoreboardPosition = {
            x: 20,
            y: 370,
            dX: 0,
            dY: 0
        };
        var scoreboardDimensions = {
            x: 0,
            y: 0
        };
        this.scoreboard = new Scoreboard(this.player, scoreboardPosition, scoreboardDimensions, "rgba(255,255,255, 0.1)");
        this.menu = new Menu({
            x: this.canvas.width,
            y: this.canvas.height
        }, controller, this.background, function () {
            _this.player.Reset();
            _this.platform.Reset();
            _this.viewport.Reset();
            _this.scoreboard.Reset();
            _this.isRunning = true;
        });
        this.viewport = new Viewport(this.context, [this.background, this.scoreboard], [], [this.player, this.platform]);
        var originalOnMove = this.player.onMove;
        this.player.onMove = function (amountMoved) {
            if (_this.player.yPosition < -(_this.viewport.offset - 100)) {
                _this.viewport.SlideUp(amountMoved.y);
                _this.background.SlideUp(amountMoved.y);
            }
            if (_this.player.yPosition > -(_this.viewport.offset - _this.canvas.height)) {
                _this.isRunning = false;
                _this.deathSound.play();
                _this.menu.showMenu(_this.scoreboard.totalPoints, _this.player.fillColor);
            }
            if (originalOnMove) {
                originalOnMove(amountMoved);
            }
        };
        this.Start();
    }
    Renderer.prototype.Start = function () {
        var _this = this;
        requestAnimationFrame(function (time) { _this.Tick(time); });
    };
    Renderer.prototype.Tick = function (timestamp) {
        var _this = this;
        var deltaTime = this.lastTimestamp ? (timestamp - this.lastTimestamp) : 0;
        var scaledTime = deltaTime / Renderer.timescale;
        this.lastTimestamp = timestamp;
        this.lastFps = Math.round(1000 / deltaTime);
        this.Draw();
        if (this.isRunning === true) {
            this.player.Tick(scaledTime);
            this.platform.Tick(scaledTime);
            Collider.processCollisions([this.player, this.platform]);
        }
        this.controller.clearClick();
        requestAnimationFrame(function (time) { _this.Tick(time); });
    };
    Renderer.prototype.Draw = function () {
        if (this.isRunning) {
            this.viewport.Render(this.lastFps);
        }
        else {
            this.menu.Render(this.context);
        }
        this.volume.Render(this.context);
    };
    Renderer.prototype.SetUpNewGame = function () {
    };
    // Constants
    Renderer.defaultGravity = 0.2;
    Renderer.millisecondsPerTick = 13;
    Renderer.gameWidth = 480;
    Renderer.gameHeight = 800;
    Renderer.minimumPlatformReboundSpeed = 10;
    Renderer.timescale = 16;
    return Renderer;
})();
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="renderer.ts" />
/// <reference path="controller.ts" />
var canvas = document.getElementById("viewport");
var controller = new Controller(canvas);
var renderer = new Renderer(canvas, controller);
//# sourceMappingURL=source.js.map