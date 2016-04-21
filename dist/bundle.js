/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(17), __webpack_require__(18), __webpack_require__(19), __webpack_require__(21), __webpack_require__(22)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, renderer_1, controller_1, orchestrator_1, LocationSystem_1, RenderSystem_1, CollisionSystem_1) {
	    var canvas = document.getElementById("viewport");
	    var controller = new controller_1.Controller(canvas);
	    var orchestrator = new orchestrator_1.Orchestrator([], {
	        "location": new LocationSystem_1.LocationSystem()
	    }, {
	        "collision": new CollisionSystem_1.CollisionSystem()
	    }, {
	        "render": new RenderSystem_1.RenderSystem(canvas.getContext("2d"))
	    });
	    new renderer_1.Renderer(canvas, controller, orchestrator).Start();
	    window.onload = function () {
	        window.focus();
	    };
	    window.onclick = function () {
	        window.focus();
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(4), __webpack_require__(10), __webpack_require__(11), __webpack_require__(2), __webpack_require__(12), __webpack_require__(13), __webpack_require__(14), __webpack_require__(16)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, player_1, collider_1, scoreboard_1, background_1, viewport_1, menu_1, volume_1, platform_1) {
	    var Renderer = (function () {
	        function Renderer(canvas, controller, orchestrator) {
	            var _this = this;
	            this.isRunning = false;
	            this.canvas = canvas;
	            this.context = canvas.getContext("2d");
	            this.controller = controller;
	            this.orchestrator = orchestrator;
	            this.volume = new volume_1.Volume({
	                x: this.canvas.width,
	                y: this.canvas.height
	            }, controller);
	            this.backgroundMusic = this.volume.createSound("snd/music.wav", { isLooping: true });
	            this.backgroundMusic.play();
	            this.deathSound = this.volume.createSound("snd/death.wav", {});
	            var playerPosition = {
	                dX: 2,
	                dY: -2,
	                x: 30,
	                y: 110
	            };
	            var playerDimensions = {
	                x: 30,
	                y: 30
	            };
	            this.player = new player_1.Player(playerPosition, playerDimensions, "#FF0000", controller, Renderer.defaultGravity, Renderer.gameWidth, this.volume);
	            orchestrator.Add(this.player);
	            this.background = new background_1.Background({ x: 0, y: 0 }, { x: this.canvas.width, y: this.canvas.height }, "#222222", this.player);
	            var platformPosition = {
	                dX: 2,
	                dY: 2,
	                x: 30,
	                y: 690
	            };
	            var platformDimensions = {
	                x: 90,
	                y: 20
	            };
	            this.platform = new platform_1.Platform(platformPosition, platformDimensions, "#FFFFFF", -Renderer.defaultGravity, this.volume, Renderer.gameWidth);
	            this.platform.onBounce = function () {
	                if (_this.platform.locationComponent.ySpeed < Renderer.minimumPlatformReboundSpeed) {
	                    _this.platform.locationComponent.ySpeed = Renderer.minimumPlatformReboundSpeed;
	                }
	            };
	            orchestrator.Add(this.platform);
	            var scoreboardPosition = {
	                dX: 0,
	                dY: 0,
	                x: 20,
	                y: 370
	            };
	            var scoreboardDimensions = {
	                x: 0,
	                y: 0
	            };
	            this.scoreboard = new scoreboard_1.Scoreboard(this.player, scoreboardPosition, scoreboardDimensions, "rgba(255,255,255, 0.1)");
	            orchestrator.Add(this.scoreboard);
	            this.menu = new menu_1.Menu({
	                x: this.canvas.width,
	                y: this.canvas.height
	            }, controller, this.background, function () {
	                _this.player.Reset();
	                _this.platform.Reset();
	                _this.viewport.Reset();
	                _this.scoreboard.Reset();
	                _this.background.Reset();
	                _this.isRunning = true;
	            }, this.volume);
	            this.viewport = new viewport_1.Viewport(this.context, [this.background, this.scoreboard], [], [this.player, this.platform], this.orchestrator);
	            this.platform.viewport = this.viewport;
	            var originalOnMove = this.player.onMove;
	            this.player.onMove = function (amountMoved) {
	                _this.viewport.SlideUpTo(-_this.player.locationComponent.yPosition + 50);
	                _this.background.SlideUpTo(-_this.player.locationComponent.yPosition);
	                if (_this.player.locationComponent.yPosition > -(_this.viewport.offset - _this.canvas.height)) {
	                    _this.isRunning = false;
	                    _this.deathSound.play();
	                    _this.menu.showMenu(_this.scoreboard.totalPoints, _this.player.fillColor);
	                }
	                if (originalOnMove) {
	                    originalOnMove(amountMoved);
	                }
	            };
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
	            this.orchestrator.Tick(1);
	            if (this.isRunning === true) {
	                this.player.Tick(scaledTime);
	                this.platform.Tick(scaledTime);
	                collider_1.Collider.processCollisions([this.player, this.platform]);
	            }
	            this.controller.clearClick();
	            requestAnimationFrame(function (time) { _this.Tick(time); });
	        };
	        Renderer.prototype.Draw = function () {
	            if (this.isRunning) {
	                this.viewport.Render(this.lastFps);
	            }
	            else {
	                this.menu.Render(this.context, this.orchestrator);
	            }
	            this.volume.Render(this.context, this.orchestrator);
	        };
	        Renderer.defaultGravity = 0.2;
	        Renderer.gameWidth = 480;
	        Renderer.minimumPlatformReboundSpeed = 10;
	        Renderer.timescale = 16;
	        return Renderer;
	    })();
	    exports.Renderer = Renderer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, sprite_1) {
	    var Background = (function () {
	        function Background(renderPosition, renderDimensions, color, player) {
	            this.isAlive = true;
	            this.showArrow = false;
	            this.offset = 0;
	            this.renderPosition = renderPosition;
	            this.renderDimensions = renderDimensions;
	            this.color = color;
	            this.staticBackground = new sprite_1.Sprite("img/staticBackground.png", renderDimensions);
	            this.stars1 = new sprite_1.Sprite("img/stars1.png", { x: renderDimensions.x, y: renderDimensions.y * 2 });
	            this.stars2 = new sprite_1.Sprite("img/stars2.png", { x: renderDimensions.x, y: renderDimensions.y * 2 });
	            this.upArrow = new sprite_1.Sprite("img/upArrow.png", { x: 120, y: 99 });
	        }
	        Background.prototype.SlideUpTo = function (y) {
	            if (y > this.offset) {
	                this.offset = y;
	            }
	        };
	        Background.prototype.Render = function (renderContext, orchestrator) {
	            var result = [];
	            result = result.concat(this.staticBackground.Render(renderContext, orchestrator));
	            var lowerYPosition1 = this.offset % (this.renderDimensions.y * 2);
	            var upperYPosition1 = lowerYPosition1 - (this.renderDimensions.y * 2);
	            renderContext.save();
	            renderContext.translate(0, lowerYPosition1);
	            result = result.concat(this.stars1.Render(renderContext, orchestrator));
	            renderContext.restore();
	            renderContext.save();
	            renderContext.translate(0, upperYPosition1);
	            result = result.concat(this.stars1.Render(renderContext, orchestrator));
	            renderContext.restore();
	            var lowerYPosition2 = (this.offset / 2) % (this.renderDimensions.y * 2);
	            var upperYPosition2 = lowerYPosition2 - (this.renderDimensions.y * 2);
	            renderContext.save();
	            renderContext.translate(0, lowerYPosition2);
	            result = result.concat(this.stars2.Render(renderContext, orchestrator));
	            renderContext.restore();
	            renderContext.save();
	            renderContext.translate(0, upperYPosition2);
	            result = result.concat(this.stars2.Render(renderContext, orchestrator));
	            renderContext.restore();
	            if (this.showArrow && this.offset < (this.renderDimensions.y * 2)) {
	                renderContext.save();
	                renderContext.globalAlpha = 0.5;
	                renderContext.translate(300, this.offset + 40);
	                this.upArrow.Render(renderContext, orchestrator);
	                renderContext.restore();
	            }
	            return result;
	        };
	        Background.prototype.Reset = function () {
	            this.showArrow = true;
	            this.offset = 0;
	        };
	        return Background;
	    })();
	    exports.Background = Background;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
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
	        Sprite.prototype.Render = function (renderContext, orchestrator) {
	            renderContext.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, this.internalDimensions.x, this.internalDimensions.y);
	            return [];
	        };
	        Sprite.prototype.loaded = function () {
	            console.log("Loaded: " + this.image.src);
	        };
	        return Sprite;
	    })();
	    exports.Sprite = Sprite;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(5), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, physicsBlock_1, sprite_1) {
	    var Player = (function (_super) {
	        __extends(Player, _super);
	        function Player(worldPosition, dimensions, color, controller, gravity, worldWidth, volume) {
	            _super.call(this, worldPosition, dimensions, color, gravity, volume, 7, worldWidth);
	            this.onBounce = this.Bounce;
	            this.controller = controller;
	            this.isJumping = false;
	            this.faceUp = new sprite_1.Sprite("img/faceHappy.png", dimensions);
	            this.faceDown = new sprite_1.Sprite("img/faceWorried.png", dimensions);
	            this.faceHover = new sprite_1.Sprite("img/faceChill.png", dimensions);
	            this.jump = volume.createSound("snd/jump.wav", {});
	            this.bounce = volume.createSound("snd/blip3.wav", {});
	        }
	        Player.prototype.Tick = function (deltaTime) {
	            _super.prototype.Tick.call(this, deltaTime);
	            if (!this.isJumping && this.controller.isKeyPressed(["up", "space", "w"])) {
	                this.jump.play();
	                this.locationComponent.ySpeed = Player.jumpSpeedIncrease * deltaTime;
	                this.isJumping = true;
	                this.jumpRotationSpeed = this.direction === "right" ? Player.initialJumpRotationSpeed : -Player.initialJumpRotationSpeed;
	            }
	            if (this.controller.isKeyPressed(["left", "a"])) {
	                this.locationComponent.xSpeed -= (Player.horizontalSpeedIncrease * deltaTime);
	            }
	            if (this.controller.isKeyPressed(["right", "d"])) {
	                this.locationComponent.xSpeed += (Player.horizontalSpeedIncrease * deltaTime);
	            }
	            this.locationComponent.rotation += (this.jumpRotationSpeed * deltaTime);
	            if (this.jumpRotationSpeed > 0) {
	                this.jumpRotationSpeed = Math.max(0, this.jumpRotationSpeed - Player.jumpRotationSlowDown);
	            }
	            else if (this.jumpRotationSpeed < 0) {
	                this.jumpRotationSpeed = Math.min(0, this.jumpRotationSpeed + Player.jumpRotationSlowDown);
	            }
	            this.locationComponent.rotation += this.locationComponent.xSpeed / 2;
	        };
	        Player.prototype.Bounce = function () {
	            this.isJumping = false;
	            this.locationComponent.rotation = 0;
	            this.jumpRotationSpeed = 0;
	            this.bounce.play();
	        };
	        Player.prototype.Render = function (renderContext, orchestrator) {
	            var _this = this;
	            renderContext.save();
	            renderContext.translate(this.locationComponent.centerXPosition, this.locationComponent.centerYPosition);
	            renderContext.rotate(this.locationComponent.rotation * Player.degrees);
	            renderContext.translate(-this.locationComponent.centerXPosition, -this.locationComponent.centerYPosition);
	            var faceSprite;
	            if (this.locationComponent.ySpeed > Player.faceSwapThreshold) {
	                faceSprite = this.faceDown;
	            }
	            else if (this.locationComponent.ySpeed < -Player.faceSwapThreshold) {
	                faceSprite = this.faceUp;
	            }
	            else {
	                faceSprite = this.faceHover;
	            }
	            var xHexidecimal = Math.max(Math.round(15 - Math.abs(this.locationComponent.xSpeed)), 0).toString(16);
	            var yHexidecimal = Math.max(Math.round(15 - Math.abs(this.locationComponent.ySpeed)), 0).toString(16);
	            this.fillColor = "#" + yHexidecimal + yHexidecimal + "ff" + xHexidecimal + xHexidecimal;
	            var newRenderables = _super.prototype.Render.call(this, renderContext, orchestrator);
	            newRenderables.forEach(function (renderable) {
	                renderable.rotation = _this.locationComponent.rotation;
	            });
	            renderContext.restore();
	            renderContext.save();
	            renderContext.translate(this.locationComponent.centerXPosition, this.locationComponent.centerYPosition);
	            renderContext.rotate(this.locationComponent.rotation * Player.degrees);
	            renderContext.translate(-this.locationComponent.centerXPosition, -this.locationComponent.centerYPosition);
	            var skewedPosition = this.skewedPosition;
	            renderContext.translate(skewedPosition.x, skewedPosition.y);
	            faceSprite.dimensions = {
	                x: skewedPosition.width,
	                y: skewedPosition.height
	            };
	            newRenderables = newRenderables.concat(faceSprite.Render(renderContext, orchestrator));
	            renderContext.restore();
	            return newRenderables;
	        };
	        Player.prototype.Reset = function () {
	            _super.prototype.Reset.call(this);
	            this.isJumping = false;
	            this.locationComponent.rotation = 0;
	            this.jumpRotationSpeed = 0;
	        };
	        Player.jumpSpeedIncrease = -8;
	        Player.degrees = Math.PI / 180;
	        Player.jumpRotationSlowDown = 0.1;
	        Player.initialJumpRotationSpeed = 15;
	        Player.horizontalSpeedIncrease = 0.5;
	        Player.faceSwapThreshold = 3.5;
	        return Player;
	    })(physicsBlock_1.PhysicsBlock);
	    exports.Player = Player;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, block_1) {
	    var PhysicsBlock = (function (_super) {
	        __extends(PhysicsBlock, _super);
	        function PhysicsBlock(worldPosition, dimensions, color, gravity, volume, xSpeedLimit, worldWidth) {
	            _super.call(this, worldPosition, dimensions, color, xSpeedLimit);
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
	            if (this.locationComponent.right > this.worldWidth) {
	                this.rebound.play();
	                this.skew += 3;
	                this.locationComponent.xPosition = this.worldWidth - this.locationComponent.width;
	                this.locationComponent.xSpeed = -Math.abs(this.locationComponent.xSpeed);
	            }
	            if (this.locationComponent.left < 0) {
	                this.rebound.play();
	                this.locationComponent.xPosition = 0;
	                this.skew += 3;
	                this.locationComponent.xSpeed = Math.abs(this.locationComponent.xSpeed);
	            }
	            this.locationComponent.ySpeed += (this.internalGravity * deltaTime);
	        };
	        PhysicsBlock.prototype.Render = function (renderContext, orchestrator) {
	            return _super.prototype.Render.call(this, renderContext, orchestrator);
	        };
	        PhysicsBlock.prototype.VerticalBounce = function (newYSpeed) {
	            this.skew += 10;
	            if (this.onBounceCallback) {
	                this.onBounceCallback();
	            }
	        };
	        PhysicsBlock.prototype.Reset = function () {
	            _super.prototype.Reset.call(this);
	        };
	        return PhysicsBlock;
	    })(block_1.Block);
	    exports.PhysicsBlock = PhysicsBlock;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(7), __webpack_require__(8), __webpack_require__(9)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, locationComponent_1, renderComponent_1, collisionComponent_1) {
	    var Block = (function () {
	        function Block(worldPosition, dimensions, color, xSpeedLimit) {
	            this.isAlive = true;
	            this.locationComponent = new locationComponent_1.LocationComponent(worldPosition.x, worldPosition.y, dimensions.x, dimensions.y, worldPosition.dX, worldPosition.dY, 0);
	            this.collisionComponent = new collisionComponent_1.CollisionComponent(this.locationComponent);
	            this.internalColor = color;
	            this.horizontalSpeedLimit = xSpeedLimit;
	            this.verticalSpeedLimit = Block.verticalSpeedLimit;
	            this.initialWorldPosition = {
	                dX: worldPosition.dX,
	                dY: worldPosition.dY,
	                x: worldPosition.x,
	                y: worldPosition.y
	            };
	            this.skew = 0;
	        }
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
	                var skewAdjustment = this.skew === 0 ? 0 : Math.sin(this.skew);
	                skewAdjustment = skewAdjustment * this.skew;
	                var widthAdjustment = (skewAdjustment * this.locationComponent.width * Block.skewScale);
	                var heightAdjustment = (skewAdjustment * this.locationComponent.height * Block.skewScale);
	                return {
	                    height: this.locationComponent.height + heightAdjustment,
	                    width: this.locationComponent.width - widthAdjustment,
	                    x: this.locationComponent.xPosition + (widthAdjustment / 2),
	                    y: this.locationComponent.yPosition - (heightAdjustment / 2)
	                };
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(Block.prototype, "direction", {
	            get: function () {
	                return this.locationComponent.xSpeed >= 0 ? "right" : "left";
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Block.prototype.Tick = function (deltaTime) {
	            this.locationComponent.xPosition += (this.locationComponent.xSpeed * deltaTime);
	            this.locationComponent.yPosition += (this.locationComponent.ySpeed * deltaTime);
	            if (this.onMoveCallback) {
	                this.onMoveCallback({ x: this.locationComponent.xSpeed, y: this.locationComponent.ySpeed });
	            }
	            this.skew = Math.max(0, this.skew - (Block.skewReduction * deltaTime));
	            this.verticalSpeedLimit += Block.verticalSpeedLimitDelta * deltaTime;
	            this.locationComponent.ySpeed = Math.min(this.locationComponent.ySpeed, this.verticalSpeedLimit);
	            this.locationComponent.ySpeed = Math.max(this.locationComponent.ySpeed, -this.verticalSpeedLimit);
	            this.locationComponent.xSpeed = Math.min(this.locationComponent.xSpeed, this.horizontalSpeedLimit);
	            this.locationComponent.xSpeed = Math.max(this.locationComponent.xSpeed, -this.horizontalSpeedLimit);
	        };
	        Block.prototype.Render = function (renderContext, orchestrator) {
	            renderContext.beginPath();
	            var skewedPosition = this.skewedPosition;
	            renderContext.rect(skewedPosition.x, skewedPosition.y, skewedPosition.width, skewedPosition.height);
	            renderContext.fillStyle = this.fillColor;
	            renderContext.fill();
	            renderContext.closePath();
	            var particlePosition = this.locationComponent.Duplicate();
	            particlePosition.xSpeed = 0;
	            particlePosition.ySpeed = 0;
	            orchestrator.Add({
	                locationComponent: particlePosition,
	                renderComponent: new renderComponent_1.RenderComponent(this.fillColor, 0.2, particlePosition)
	            });
	            return [];
	        };
	        Block.prototype.Reset = function () {
	            this.locationComponent.xPosition = this.initialWorldPosition.x;
	            this.locationComponent.yPosition = this.initialWorldPosition.y;
	            this.locationComponent.xSpeed = this.initialWorldPosition.dX;
	            this.locationComponent.ySpeed = this.initialWorldPosition.dY;
	            this.verticalSpeedLimit = Block.verticalSpeedLimit;
	        };
	        Block.verticalSpeedLimit = 10;
	        Block.verticalSpeedLimitDelta = 0.01;
	        Block.skewScale = 0.07;
	        Block.skewReduction = 0.3;
	        return Block;
	    })();
	    exports.Block = Block;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    var LocationComponent = (function () {
	        function LocationComponent(x, y, width, height, xSpeed, ySpeed, rotation) {
	            this._x = x;
	            this._y = y;
	            this._xSize = width;
	            this._ySize = height;
	            this._xSpeed = xSpeed;
	            this._ySpeed = ySpeed;
	            this._rotation = rotation;
	        }
	        Object.defineProperty(LocationComponent.prototype, "xPosition", {
	            get: function () {
	                return this._x;
	            },
	            set: function (newValue) {
	                this._x = newValue;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(LocationComponent.prototype, "yPosition", {
	            get: function () {
	                return this._y;
	            },
	            set: function (newValue) {
	                this._y = newValue;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(LocationComponent.prototype, "width", {
	            get: function () {
	                return this._xSize;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(LocationComponent.prototype, "height", {
	            get: function () {
	                return this._ySize;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(LocationComponent.prototype, "xSpeed", {
	            get: function () {
	                return this._xSpeed;
	            },
	            set: function (newValue) {
	                this._xSpeed = newValue;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(LocationComponent.prototype, "ySpeed", {
	            get: function () {
	                return this._ySpeed;
	            },
	            set: function (newValue) {
	                this._ySpeed = newValue;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(LocationComponent.prototype, "rotation", {
	            get: function () {
	                return this._rotation;
	            },
	            set: function (newValue) {
	                this._rotation = newValue;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(LocationComponent.prototype, "left", {
	            get: function () {
	                return this._x;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(LocationComponent.prototype, "right", {
	            get: function () {
	                return this._x + this.width;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(LocationComponent.prototype, "top", {
	            get: function () {
	                return this._y;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(LocationComponent.prototype, "bottom", {
	            get: function () {
	                return this._y + this.height;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(LocationComponent.prototype, "centerXPosition", {
	            get: function () {
	                return this._x + (this.width / 2);
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(LocationComponent.prototype, "centerYPosition", {
	            get: function () {
	                return this._y + (this.height / 2);
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(LocationComponent.prototype, "rotationInDegrees", {
	            get: function () {
	                return this.rotation * LocationComponent.degrees;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        LocationComponent.prototype.Duplicate = function () {
	            return new LocationComponent(this._x, this._y, this._xSize, this._ySize, this._xSpeed, this._ySpeed, this._rotation);
	        };
	        LocationComponent.degrees = Math.PI / 180;
	        return LocationComponent;
	    })();
	    exports.LocationComponent = LocationComponent;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    var RenderComponent = (function () {
	        function RenderComponent(fillColor, opacity, position) {
	            this._fillColor = fillColor;
	            this._opacity = opacity;
	            this._position = position;
	        }
	        Object.defineProperty(RenderComponent.prototype, "fillColor", {
	            get: function () {
	                return this._fillColor;
	            },
	            set: function (newValue) {
	                this._fillColor = newValue;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(RenderComponent.prototype, "opacity", {
	            get: function () {
	                return this._opacity;
	            },
	            set: function (newValue) {
	                this._opacity = newValue;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(RenderComponent.prototype, "position", {
	            get: function () {
	                return this._position;
	            },
	            set: function (newValue) {
	                this._position = newValue;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        return RenderComponent;
	    })();
	    exports.RenderComponent = RenderComponent;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    var CollisionComponent = (function () {
	        function CollisionComponent(position, collisionCallback) {
	            this._position = position;
	            this._collisionCallback = collisionCallback;
	        }
	        Object.defineProperty(CollisionComponent.prototype, "position", {
	            get: function () {
	                return this._position;
	            },
	            set: function (newValue) {
	                this._position = newValue;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(CollisionComponent.prototype, "collisionCallback", {
	            get: function () {
	                return this._collisionCallback;
	            },
	            set: function (newValue) {
	                this._collisionCallback = newValue;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        return CollisionComponent;
	    })();
	    exports.CollisionComponent = CollisionComponent;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    var Collider = (function () {
	        function Collider() {
	        }
	        Collider.processCollisions = function (collidables) {
	            if (collidables.length <= 1) {
	                return;
	            }
	            for (var i = 0; i < collidables.length - 1; i++) {
	                var collisionAction = function (subject, newYSpeed) {
	                    subject.VerticalBounce(newYSpeed);
	                };
	                var subject = collidables[i];
	                for (var j = i + 1; j < collidables.length; j++) {
	                    var target = collidables[j];
	                    var isVerticalOverlap = (subject.locationComponent.top < target.locationComponent.bottom) &&
	                        (subject.locationComponent.bottom > target.locationComponent.top);
	                    var isHorizontalOverlap = (subject.locationComponent.left < target.locationComponent.right) &&
	                        (subject.locationComponent.right > target.locationComponent.left);
	                    if (isVerticalOverlap && isHorizontalOverlap) {
	                        var subjectYSpeed = subject.locationComponent.ySpeed;
	                        var targetYSpeed = target.locationComponent.ySpeed;
	                        collisionAction(subject, targetYSpeed);
	                        collisionAction(target, subjectYSpeed);
	                        var subjectPreviousLeft = subject.locationComponent.xPosition - subject.locationComponent.xSpeed;
	                        var subjectPreviousRight = subjectPreviousLeft + subject.locationComponent.width;
	                        var targetPreviousLeft = target.locationComponent.xPosition - target.locationComponent.xSpeed;
	                        var targetPreviousRight = targetPreviousLeft + target.locationComponent.width;
	                        var wasHorizontalOverlap = (subjectPreviousLeft < targetPreviousRight)
	                            && (subjectPreviousRight > targetPreviousLeft);
	                        if (!wasHorizontalOverlap) {
	                            subject.locationComponent.xSpeed = -subject.locationComponent.xSpeed;
	                            target.locationComponent.xSpeed = -target.locationComponent.xSpeed;
	                        }
	                    }
	                }
	            }
	        };
	        return Collider;
	    })();
	    exports.Collider = Collider;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, block_1) {
	    var Scoreboard = (function (_super) {
	        __extends(Scoreboard, _super);
	        function Scoreboard(player, worldPosition, dimensions, color) {
	            var _this = this;
	            _super.call(this, worldPosition, dimensions, color, 0);
	            this.player = player;
	            this.player.onBounce = function () {
	                _this.score = Math.round((_this.score + Scoreboard.bouncePoints) * 10) / 10;
	                _this.player.Bounce();
	            };
	            var originalOnMove = this.player.onMove;
	            this.player.onMove = function (amountMoved) {
	                var currentHeight = -_this.player.locationComponent.top;
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
	            renderContext.translate(this.locationComponent.centerXPosition, this.locationComponent.centerYPosition);
	            renderContext.rotate(Scoreboard.fontRotation * Scoreboard.degrees);
	            renderContext.translate(-this.locationComponent.centerXPosition, -this.locationComponent.centerYPosition);
	            renderContext.fillText(this.score.toString(), this.locationComponent.xPosition, this.locationComponent.yPosition + Scoreboard.fontSizeInPx);
	            renderContext.font = "" + (Scoreboard.fontSizeInPx / 2) + "px Oswald";
	            renderContext.fillText("x " + this.multiplier.toString(), this.locationComponent.xPosition, this.locationComponent.yPosition + (1.5 * Scoreboard.fontSizeInPx));
	            renderContext.globalAlpha = 0.5;
	            renderContext.fillStyle = this.player.fillColor;
	            renderContext.fillText("~ " + this.points.toString(), this.locationComponent.xPosition, this.locationComponent.yPosition + (2 * Scoreboard.fontSizeInPx));
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
	    })(block_1.Block);
	    exports.Scoreboard = Scoreboard;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    var Viewport = (function () {
	        function Viewport(renderContext, fixedRenderables, backgroundRenderables, foregroundRenderables, orchestrator) {
	            this.renderContext = renderContext;
	            this.fixedRenderables = fixedRenderables;
	            this.backgroundRenderables = backgroundRenderables;
	            this.foregroundRenderables = foregroundRenderables;
	            this.initialBackgroundRenderables = [].concat(backgroundRenderables);
	            this.initialForegroundRenderables = [].concat(foregroundRenderables);
	            this.renderOffset = 0;
	            this.orchestrator = orchestrator;
	        }
	        Object.defineProperty(Viewport.prototype, "renderDimensions", {
	            get: function () {
	                return {
	                    x: this.renderContext.canvas.width,
	                    y: this.renderContext.canvas.height
	                };
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(Viewport.prototype, "offset", {
	            get: function () {
	                return this.renderOffset;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Viewport.prototype.SlideUpTo = function (y) {
	            if (y > this.renderOffset) {
	                this.renderOffset = y;
	                this.orchestrator.GetSystem("render").offsetY = y;
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
	                this.renderContext.fillStyle = "#FFFFFF";
	                this.renderContext.fillText("FPS: " + fps.toString(), 0, 10);
	            }
	        };
	        Viewport.prototype.Reset = function () {
	            this.renderOffset = 0;
	            this.orchestrator.GetSystem("render").offsetY = 0;
	            this.backgroundRenderables = [].concat(this.initialBackgroundRenderables);
	            this.foregroundRenderables = [].concat(this.initialForegroundRenderables);
	        };
	        Viewport.prototype.RenderSubSet = function (subSet) {
	            var newRenderables = subSet;
	            for (var i = 0; i < subSet.length; i++) {
	                newRenderables = subSet[i].Render(this.renderContext, this.orchestrator).concat(newRenderables);
	            }
	            return newRenderables.filter(function (renderable) {
	                return renderable.isAlive;
	            });
	        };
	        return Viewport;
	    })();
	    exports.Viewport = Viewport;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, sprite_1) {
	    var Menu = (function () {
	        function Menu(renderDimensions, controller, background, onStartGame, volume) {
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
	                y: (renderDimensions.y - (Menu.buttonHeight * 2)) + 0.5
	            };
	            this.buttonHover = volume.createSound("snd/button_on.wav", {});
	            this.buttonUnhover = volume.createSound("snd/button_off.wav", {});
	            this.buttonClick = volume.createSound("snd/button_click.wav", {});
	            this.controlPosition = { x: 45, y: 300 };
	            this.controlDiagram = new sprite_1.Sprite("img/controls.png", { x: 390, y: 237 });
	        }
	        Menu.prototype.Render = function (renderContext, orchestrator) {
	            var mouseClick = this.controller.getClickPosition();
	            if ((mouseClick && this.isPointOnButton(mouseClick))
	                || this.controller.isKeyPressed("enter")
	                || this.controller.isKeyPressed("e")) {
	                this.buttonClick.play();
	                this.onStartGame();
	            }
	            var buttonIsNowHovered = this.isPointOnButton(this.controller.getMousePosition());
	            if (buttonIsNowHovered && !this.isButtonHovered) {
	                this.buttonHover.play();
	            }
	            else if (!buttonIsNowHovered && this.isButtonHovered) {
	                this.buttonUnhover.play();
	            }
	            this.isButtonHovered = buttonIsNowHovered;
	            this.background.Render(renderContext, orchestrator);
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
	            renderContext.lineWidth = 3;
	            renderContext.strokeRect(this.playButtonPosition.x, this.playButtonPosition.y, Menu.buttonWidth, Menu.buttonHeight);
	            renderContext.font = "" + Menu.playFontSizeInPx + "px Oswald";
	            renderContext.fillStyle = (this.isButtonHovered ? "rgba(0,0,0," : "rgba(255,255,255,") + this.opacity + ")";
	            renderContext.textAlign = "center";
	            renderContext.fillText("Play", horizontalCenter, (Menu.playFontSizeInPx * 1.45) + this.playButtonPosition.y);
	            renderContext.globalAlpha = this.opacity;
	            renderContext.translate(this.controlPosition.x, this.controlPosition.y);
	            this.controlDiagram.Render(renderContext, orchestrator);
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
	        Menu.prototype.isPointOnButton = function (point) {
	            return point
	                && point.x > this.playButtonPosition.x
	                && point.x < this.playButtonPosition.x + Menu.buttonWidth
	                && point.y > this.playButtonPosition.y
	                && point.y < this.playButtonPosition.y + Menu.buttonHeight;
	        };
	        Menu.titleFontSizeInPx = 90;
	        Menu.scoreFontSizeInPx = 50;
	        Menu.playFontSizeInPx = 50;
	        Menu.buttonWidth = 225;
	        Menu.buttonHeight = 100;
	        Menu.fadeInRate = 0.02;
	        return Menu;
	    })();
	    exports.Menu = Menu;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(15), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, sound_1, sprite_1) {
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
	            this.level = parseInt(localStorage.getItem("volumePosition") || 2);
	            this.volume0 = new sprite_1.Sprite("img/volume0.png", this.soundButtonDimensions);
	            this.volume1 = new sprite_1.Sprite("img/volume1.png", this.soundButtonDimensions);
	            this.volume2 = new sprite_1.Sprite("img/volume2.png", this.soundButtonDimensions);
	            this.volume3 = new sprite_1.Sprite("img/volume3.png", this.soundButtonDimensions);
	            this.volume4 = new sprite_1.Sprite("img/volume4.png", this.soundButtonDimensions);
	            this.isVolumeKeyPressed = false;
	            this.sounds = [];
	            this.volumeChanged = this.createSound("snd/volume.wav", {});
	        }
	        Volume.prototype.Render = function (renderContext, orchestrator) {
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
	                    this.volume0.Render(renderContext, orchestrator);
	                    break;
	                case 1:
	                    this.volume1.Render(renderContext, orchestrator);
	                    break;
	                case 2:
	                    this.volume2.Render(renderContext, orchestrator);
	                    break;
	                case 3:
	                    this.volume3.Render(renderContext, orchestrator);
	                    break;
	                case 4:
	                    this.volume4.Render(renderContext, orchestrator);
	                    break;
	                default:
	                    this.volume4.Render(renderContext, orchestrator);
	                    break;
	            }
	            renderContext.restore();
	            return [];
	        };
	        Volume.prototype.createSound = function (path, options) {
	            var newSound = new sound_1.Sound(path, options);
	            newSound.volume = this.level / 5;
	            this.sounds.push(newSound);
	            return newSound;
	        };
	        Volume.prototype.isPointOnButton = function (point) {
	            return point
	                && point.x > this.soundButtonPosition.x
	                && point.x < this.soundButtonPosition.x + this.soundButtonDimensions.x
	                && point.y > this.soundButtonPosition.y
	                && point.y < this.soundButtonPosition.y + this.soundButtonDimensions.y;
	        };
	        Volume.prototype.changeVolume = function () {
	            var _this = this;
	            this.opacity = 1;
	            this.level = Math.round(this.level >= 4 ? 0 : this.level + 1);
	            localStorage.setItem("volumePosition", this.level.toString());
	            this.sounds.forEach(function (sound) {
	                sound.volume = _this.level / 5;
	            });
	            this.volumeChanged.play();
	        };
	        Volume.opacityDecay = 0.02;
	        Volume.fadedOpacity = 0.4;
	        return Volume;
	    })();
	    exports.Volume = Volume;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
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
	    exports.Sound = Sound;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(5)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, physicsBlock_1) {
	    var Platform = (function (_super) {
	        __extends(Platform, _super);
	        function Platform(worldPosition, dimensions, color, gravity, volume, worldWidth) {
	            _super.call(this, worldPosition, dimensions, color, gravity, volume, 10, worldWidth);
	        }
	        Object.defineProperty(Platform.prototype, "bottomOfScreen", {
	            get: function () {
	                return this.viewport.renderDimensions.y - this.viewport.offset;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(Platform.prototype, "offscreenAmount", {
	            get: function () {
	                return Math.max(this.locationComponent.top - this.bottomOfScreen, 0);
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Platform.prototype.Tick = function (deltaTime) {
	            this.locationComponent.xSpeed =
	                this.locationComponent.xSpeed * ((Platform.platformSpeedIncrease + deltaTime) / Platform.platformSpeedIncrease);
	            _super.prototype.Tick.call(this, deltaTime);
	        };
	        Platform.prototype.Render = function (renderContext, orchestrator) {
	            if (this.offscreenAmount <= 0) {
	                return _super.prototype.Render.call(this, renderContext, orchestrator);
	            }
	            else {
	                renderContext.save();
	                renderContext.fillStyle = this.fillColor;
	                renderContext.globalAlpha = 0.2;
	                renderContext.fillRect(this.locationComponent.left, this.bottomOfScreen - this.locationComponent.height, this.locationComponent.width, this.locationComponent.height);
	                renderContext.globalAlpha = 1;
	                renderContext.fillRect(this.locationComponent.left, this.bottomOfScreen - this.locationComponent.height, ((this.offscreenAmount / 10) % this.locationComponent.width), this.locationComponent.height);
	                renderContext.restore();
	                return [];
	            }
	        };
	        Platform.platformSpeedIncrease = 1000;
	        return Platform;
	    })(physicsBlock_1.PhysicsBlock);
	    exports.Platform = Platform;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    var Controller = (function () {
	        function Controller(canvas) {
	            var _this = this;
	            this.isKeyPressedState = {
	                "enter": false,
	                "space": false,
	                "left": false,
	                "up": false,
	                "right": false,
	                "a": false,
	                "d": false,
	                "e": false,
	                "m": false,
	                "v": false,
	                "w": false
	            };
	            this.canvas = canvas;
	            window.addEventListener("keyup", function (event) {
	                _this.handleKeyUp(event);
	            });
	            window.addEventListener("keydown", function (event) {
	                _this.handleKeyDown(event);
	                if (Controller.keyCodes[event.keyCode]) {
	                    event.preventDefault();
	                }
	            });
	            canvas.addEventListener("mousemove", function (event) {
	                _this.handleMouseMove(event);
	            });
	            canvas.addEventListener("mousedown", function (event) {
	                _this.handleMouseDown(event);
	            });
	        }
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
	        Controller.keyCodes = {
	            13: "enter",
	            32: "space",
	            37: "left",
	            38: "up",
	            39: "right",
	            65: "a",
	            68: "d",
	            69: "e",
	            77: "m",
	            86: "v",
	            87: "w"
	        };
	        return Controller;
	    })();
	    exports.Controller = Controller;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    var Orchestrator = (function () {
	        function Orchestrator(initialEntities, preSystems, mainSystems, postSystems) {
	            if (preSystems === void 0) { preSystems = {}; }
	            if (mainSystems === void 0) { mainSystems = {}; }
	            if (postSystems === void 0) { postSystems = {}; }
	            this._entities = initialEntities;
	            this._preSystems = preSystems;
	            this._mainSystems = mainSystems;
	            this._postSystems = postSystems;
	            this._entitiesToAdd = [];
	            this._entitiesToRemove = [];
	        }
	        Object.defineProperty(Orchestrator.prototype, "entities", {
	            get: function () {
	                return this._entities;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Orchestrator.prototype.Tick = function (deltaTime) {
	            var _this = this;
	            if (this._entities.length > 500) {
	                throw new RangeError("Sanity check failed: Large number of entities");
	            }
	            this.RunSystems(this._preSystems, deltaTime);
	            this.RunSystems(this._mainSystems, deltaTime);
	            this.RunSystems(this._postSystems, deltaTime);
	            this._entities = this._entities.concat(this._entitiesToAdd);
	            this._entities = this._entities.filter(function (entity) {
	                return _this._entitiesToRemove.indexOf(entity) < 0;
	            }, this);
	            this._entitiesToAdd = [];
	            this._entitiesToRemove = [];
	        };
	        Orchestrator.prototype.Add = function (entity) {
	            this._entitiesToAdd.push(entity);
	        };
	        Orchestrator.prototype.Remove = function (entity) {
	            this._entitiesToRemove.push(entity);
	        };
	        Orchestrator.prototype.GetSystem = function (name) {
	            return this._mainSystems[name] || this._preSystems[name] || this._postSystems[name];
	        };
	        Orchestrator.prototype.RunSystems = function (systems, deltaTime) {
	            for (var systemName in systems) {
	                if (systems.hasOwnProperty(systemName)) {
	                    systems[systemName].Run(this._entities, this, deltaTime);
	                }
	            }
	        };
	        return Orchestrator;
	    })();
	    exports.Orchestrator = Orchestrator;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(20)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, system_1) {
	    var LocationSystem = (function (_super) {
	        __extends(LocationSystem, _super);
	        function LocationSystem() {
	            _super.apply(this, arguments);
	        }
	        LocationSystem.prototype.Run = function (entities, orchestrator, deltaTime) {
	            "noOp".toString();
	        };
	        return LocationSystem;
	    })(system_1.System);
	    exports.LocationSystem = LocationSystem;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    var System = (function () {
	        function System() {
	        }
	        System.ApplyToIndividuals = function (entities, predicate, logic) {
	            entities.filter(function (entity) {
	                return predicate(entity);
	            }).forEach(function (entity) {
	                logic(entity);
	            });
	        };
	        System.ApplyToPairs = function (entities, predicate, logic) {
	            var filteredEntities = entities.filter(function (entity) {
	                return predicate(entity);
	            });
	            for (var i = 0; i < filteredEntities.length - 1; i++) {
	                var entityA = filteredEntities[i];
	                for (var j = i + 1; j < filteredEntities.length; j++) {
	                    logic(entityA, filteredEntities[j]);
	                }
	            }
	        };
	        return System;
	    })();
	    exports.System = System;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(20)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, system_1) {
	    var RenderSystem = (function (_super) {
	        __extends(RenderSystem, _super);
	        function RenderSystem(renderContext) {
	            _super.call(this);
	            this._offsetX = 0;
	            this._offsetY = 0;
	            this._renderContext = renderContext;
	        }
	        Object.defineProperty(RenderSystem.prototype, "offsetX", {
	            get: function () {
	                return this._offsetX;
	            },
	            set: function (newValue) {
	                this._offsetX = newValue;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(RenderSystem.prototype, "offsetY", {
	            get: function () {
	                return this._offsetY;
	            },
	            set: function (newValue) {
	                this._offsetY = newValue;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        RenderSystem.prototype.Run = function (entities, orchestrator, deltaTime) {
	            var _this = this;
	            system_1.System.ApplyToIndividuals(entities, function (entity) {
	                return !!entity.renderComponent;
	            }, function (entity) {
	                _this.Draw(entity, orchestrator, deltaTime);
	            });
	        };
	        RenderSystem.prototype.Draw = function (entity, orchestrator, deltaTime) {
	            if (!entity.renderComponent) {
	                return;
	            }
	            this._renderContext.save();
	            var renderComponent = entity.renderComponent;
	            this._renderContext.globalAlpha = renderComponent.opacity;
	            this.OffsetViewport();
	            this.RotateAroundCenter(renderComponent.position);
	            this.MoveToPosition(renderComponent.position);
	            this.DrawRect(renderComponent);
	            this._renderContext.restore();
	            renderComponent.opacity -= 0.01;
	            if (renderComponent.opacity <= 0) {
	                orchestrator.Remove(entity);
	            }
	        };
	        RenderSystem.prototype.RotateAroundCenter = function (position) {
	            this._renderContext.translate(position.centerXPosition, position.centerYPosition);
	            this._renderContext.rotate(position.rotationInDegrees);
	            this._renderContext.translate(-position.centerXPosition, -position.centerYPosition);
	        };
	        RenderSystem.prototype.MoveToPosition = function (position) {
	            this._renderContext.translate(position.xPosition, position.yPosition);
	        };
	        RenderSystem.prototype.OffsetViewport = function () {
	            this._renderContext.translate(this._offsetX, this._offsetY);
	        };
	        RenderSystem.prototype.DrawRect = function (renderComponent) {
	            this._renderContext.beginPath();
	            this._renderContext.rect(0, 0, renderComponent.position.width, renderComponent.position.height);
	            this._renderContext.fillStyle = renderComponent.fillColor;
	            this._renderContext.fill();
	            this._renderContext.closePath();
	        };
	        return RenderSystem;
	    })(system_1.System);
	    exports.RenderSystem = RenderSystem;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(20)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, system_1) {
	    var CollisionSystem = (function (_super) {
	        __extends(CollisionSystem, _super);
	        function CollisionSystem() {
	            _super.apply(this, arguments);
	        }
	        CollisionSystem.prototype.Run = function (entities, orchestrator, deltaTime) {
	            var _this = this;
	            system_1.System.ApplyToPairs(entities, function (entity) {
	                return !!entity.collisionComponent;
	            }, function (entityA, entityB) {
	                _this.Collide(entityA, entityB, orchestrator, deltaTime);
	            });
	        };
	        CollisionSystem.prototype.Collide = function (entityA, entityB, orchestrator, deltaTime) {
	            var isVerticalOverlap = (entityA.locationComponent.top < entityB.locationComponent.bottom) &&
	                (entityA.locationComponent.bottom > entityB.locationComponent.top);
	            var isHorizontalOverlap = (entityA.locationComponent.left < entityB.locationComponent.right) &&
	                (entityA.locationComponent.right > entityB.locationComponent.left);
	            if (!isHorizontalOverlap || !isVerticalOverlap) {
	                return;
	            }
	            var entityAYSpeed = entityA.locationComponent.ySpeed;
	            var entityBYSpeed = entityB.locationComponent.ySpeed;
	            entityA.locationComponent.ySpeed = entityBYSpeed;
	            entityB.locationComponent.ySpeed = entityAYSpeed;
	            var entityAPreviousLeft = entityA.locationComponent.xPosition - entityA.locationComponent.xSpeed;
	            var entityAPreviousRight = entityAPreviousLeft + entityA.locationComponent.width;
	            var entityBPreviousLeft = entityB.locationComponent.xPosition - entityA.locationComponent.xSpeed;
	            var entityBPreviousRight = entityBPreviousLeft + entityB.locationComponent.width;
	            var wasHorizontalOverlap = (entityAPreviousLeft < entityBPreviousRight)
	                && (entityAPreviousRight > entityBPreviousLeft);
	            if (!wasHorizontalOverlap) {
	                entityA.locationComponent.xSpeed = -entityA.locationComponent.xSpeed;
	                entityB.locationComponent.xSpeed = -entityB.locationComponent.xSpeed;
	            }
	            if (entityA.collisionComponent.collisionCallback) {
	                entityA.collisionComponent.collisionCallback();
	            }
	            if (entityB.collisionComponent.collisionCallback) {
	                entityB.collisionComponent.collisionCallback();
	            }
	        };
	        return CollisionSystem;
	    })(system_1.System);
	    exports.CollisionSystem = CollisionSystem;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map