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

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(5), __webpack_require__(20), __webpack_require__(21), __webpack_require__(22), __webpack_require__(1), __webpack_require__(23), __webpack_require__(24), __webpack_require__(25), __webpack_require__(26), __webpack_require__(27)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, renderer_1, controller_1, orchestrator_1, locationSystem_1, renderSystem_1, collisionSystem_1, inputSystem_1, scoreSystem_1, gameStateSystem_1, emitterSystem_1) {
	    var canvas = document.getElementById("viewport");
	    var controller = new controller_1.Controller(canvas);
	    var orchestrator = new orchestrator_1.Orchestrator([], {
	        "location": new locationSystem_1.LocationSystem()
	    }, {
	        "input": new inputSystem_1.InputSystem(controller),
	        "collision": new collisionSystem_1.CollisionSystem(),
	        "score": new scoreSystem_1.ScoreSystem(),
	        "gameState": new gameStateSystem_1.GameStateSystem(),
	        "emitter": new emitterSystem_1.EmitterSystem()
	    }, {
	        "render": new renderSystem_1.RenderSystem(canvas.getContext("2d"))
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

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(3), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, system_1, locationComponent_1, renderComponent_1) {
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
	            }, function (entity) {
	                return entity.renderComponent.zIndex;
	            });
	        };
	        RenderSystem.prototype.Draw = function (entity, orchestrator, deltaTime) {
	            if (!entity.renderComponent) {
	                return;
	            }
	            this._renderContext.save();
	            var renderComponent = entity.renderComponent;
	            this._renderContext.globalAlpha = renderComponent.opacityValue;
	            if (renderComponent.position.type === locationComponent_1.LocationType.world) {
	                this.OffsetViewport();
	            }
	            this.RotateAroundCenter(renderComponent.position);
	            this.MoveToPosition(renderComponent.position);
	            var layers = renderComponent.layers;
	            for (var layerIndex = 0; layerIndex < layers.length; layerIndex++) {
	                var layer = layers[layerIndex];
	                this._renderContext.save();
	                this.OffsetLayer(layer);
	                if (layer instanceof renderComponent_1.RectangleLayer) {
	                    this.DrawRect(renderComponent, layer);
	                }
	                else if (layer instanceof renderComponent_1.SpriteLayer) {
	                    this.DrawSprite(renderComponent, layer);
	                }
	                else if (layer instanceof renderComponent_1.TextLayer) {
	                    this.DrawText(renderComponent, layer);
	                }
	                this._renderContext.restore();
	            }
	            this._renderContext.restore();
	        };
	        RenderSystem.prototype.RotateAroundCenter = function (position) {
	            this._renderContext.translate(position.centerXPosition, position.centerYPosition);
	            this._renderContext.rotate(position.rotationInDegrees);
	            this._renderContext.translate(-position.centerXPosition, -position.centerYPosition);
	        };
	        RenderSystem.prototype.MoveToPosition = function (position) {
	            this._renderContext.translate(position.xPositionValue, position.yPositionValue);
	        };
	        RenderSystem.prototype.OffsetLayer = function (layer) {
	            this._renderContext.translate(layer.offsetX, layer.offsetY);
	        };
	        RenderSystem.prototype.OffsetViewport = function () {
	            this._renderContext.translate(this._offsetX, this._offsetY);
	        };
	        RenderSystem.prototype.DrawRect = function (renderComponent, rectangleLayer) {
	            var skewedPosition = renderComponent.skewedPosition;
	            this._renderContext.beginPath();
	            this._renderContext.rect(0, 0, skewedPosition.width, skewedPosition.height);
	            this._renderContext.fillStyle = rectangleLayer.fillColorValue;
	            this._renderContext.fill();
	            this._renderContext.closePath();
	        };
	        RenderSystem.prototype.DrawSprite = function (renderComponent, spriteLayer) {
	            var skewedPosition = renderComponent.skewedPosition;
	            this._renderContext.drawImage(spriteLayer.image, 0, 0, spriteLayer.image.width, spriteLayer.image.height, 0, 0, skewedPosition.width, skewedPosition.height);
	        };
	        RenderSystem.prototype.DrawText = function (renderComponent, textLayer) {
	            this._renderContext.font = textLayer.sizeInPixels.toString() + "px " + textLayer.font;
	            this._renderContext.fillStyle = textLayer.fillColorValue;
	            if (textLayer.isCentered) {
	                this._renderContext.textAlign = "center";
	            }
	            else {
	                this._renderContext.textAlign = "left";
	            }
	            this._renderContext.fillText(textLayer.textValue, 0, 0);
	        };
	        return RenderSystem;
	    })(system_1.System);
	    exports.RenderSystem = RenderSystem;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    var System = (function () {
	        function System() {
	        }
	        System.ApplyToIndividuals = function (entities, predicate, logic, sort) {
	            var filteredEntities = entities.filter(function (entity) {
	                return predicate(entity);
	            });
	            if (sort) {
	                filteredEntities = filteredEntities.sort(function (aEntity, bEntity) {
	                    return sort(aEntity) > sort(bEntity) ? 1 : -1;
	                });
	            }
	            filteredEntities.forEach(function (entity) {
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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    (function (LocationType) {
	        LocationType[LocationType["unknown"] = 0] = "unknown";
	        LocationType[LocationType["world"] = 1] = "world";
	        LocationType[LocationType["ui"] = 2] = "ui";
	    })(exports.LocationType || (exports.LocationType = {}));
	    var LocationType = exports.LocationType;
	    var LocationComponent = (function () {
	        function LocationComponent(x, y, width, height, xSpeed, ySpeed, rotation, type) {
	            if (type === void 0) { type = LocationType.world; }
	            this._x = x;
	            this._y = y;
	            this._xSize = width;
	            this._ySize = height;
	            this._xSpeed = xSpeed;
	            this._ySpeed = ySpeed;
	            this._rotation = rotation;
	            this._type = type;
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
	        Object.defineProperty(LocationComponent.prototype, "xPositionValue", {
	            get: function () {
	                if (typeof this._x === "function") {
	                    return this._x();
	                }
	                else {
	                    return this._x;
	                }
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(LocationComponent.prototype, "yPositionValue", {
	            get: function () {
	                if (typeof this._y === "function") {
	                    return this._y();
	                }
	                else {
	                    return this._y;
	                }
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
	                return this.xPositionValue;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(LocationComponent.prototype, "right", {
	            get: function () {
	                return this.xPositionValue + this.width;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(LocationComponent.prototype, "top", {
	            get: function () {
	                return this.yPositionValue;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(LocationComponent.prototype, "bottom", {
	            get: function () {
	                return this.yPositionValue + this.height;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(LocationComponent.prototype, "centerXPosition", {
	            get: function () {
	                return this.xPositionValue + (this.width / 2);
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(LocationComponent.prototype, "centerYPosition", {
	            get: function () {
	                return this.yPositionValue + (this.height / 2);
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
	        Object.defineProperty(LocationComponent.prototype, "type", {
	            get: function () {
	                return this._type;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        LocationComponent.prototype.Duplicate = function () {
	            return new LocationComponent(this._x, this._y, this._xSize, this._ySize, this._xSpeed, this._ySpeed, this._rotation, this._type);
	        };
	        LocationComponent.degrees = Math.PI / 180;
	        return LocationComponent;
	    })();
	    exports.LocationComponent = LocationComponent;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, locationComponent_1) {
	    var RenderComponent = (function () {
	        function RenderComponent(position, layers, opacity, zIndex) {
	            this._position = position;
	            this._layers = layers;
	            this._opacity = opacity;
	            this._zIndex = zIndex;
	            this._skew = 0;
	        }
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
	        Object.defineProperty(RenderComponent.prototype, "skewedPosition", {
	            get: function () {
	                var skewAdjustment = this.skew === 0 ? 0 : Math.sin(this.skew);
	                skewAdjustment = skewAdjustment * this.skew;
	                var widthAdjustment = (skewAdjustment * this._position.width * RenderComponent.skewScale);
	                var heightAdjustment = (skewAdjustment * this._position.height * RenderComponent.skewScale);
	                return new locationComponent_1.LocationComponent(this._position.xPositionValue + (widthAdjustment / 2), this._position.yPositionValue - (heightAdjustment / 2), this._position.width - widthAdjustment, this._position.height + heightAdjustment, this._position.xSpeed, this._position.ySpeed, this._position.rotation);
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
	        Object.defineProperty(RenderComponent.prototype, "opacityValue", {
	            get: function () {
	                if (typeof this._opacity === "function") {
	                    return this._opacity();
	                }
	                else {
	                    return this._opacity;
	                }
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(RenderComponent.prototype, "zIndex", {
	            get: function () {
	                return this._zIndex;
	            },
	            set: function (newValue) {
	                this._zIndex = newValue;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(RenderComponent.prototype, "skew", {
	            get: function () {
	                return this._skew;
	            },
	            set: function (newValue) {
	                this._skew = newValue;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(RenderComponent.prototype, "layers", {
	            get: function () {
	                if (typeof this._layers === "function") {
	                    return this._layers();
	                }
	                else {
	                    return [].concat(this._layers);
	                }
	            },
	            enumerable: true,
	            configurable: true
	        });
	        RenderComponent.skewScale = 0.07;
	        return RenderComponent;
	    })();
	    exports.RenderComponent = RenderComponent;
	    var RenderLayer = (function () {
	        function RenderLayer() {
	            this._offsetX = 0;
	            this._offsetY = 0;
	        }
	        Object.defineProperty(RenderLayer.prototype, "offsetX", {
	            get: function () {
	                return this._offsetX;
	            },
	            set: function (newValue) {
	                this._offsetX = newValue;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(RenderLayer.prototype, "offsetY", {
	            get: function () {
	                return this._offsetY;
	            },
	            set: function (newValue) {
	                this._offsetY = newValue;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        return RenderLayer;
	    })();
	    exports.RenderLayer = RenderLayer;
	    var RectangleLayer = (function (_super) {
	        __extends(RectangleLayer, _super);
	        function RectangleLayer(fillColor) {
	            _super.call(this);
	            this._fillColor = fillColor;
	        }
	        Object.defineProperty(RectangleLayer.prototype, "fillColor", {
	            get: function () {
	                return this._fillColor;
	            },
	            set: function (newValue) {
	                this._fillColor = newValue;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(RectangleLayer.prototype, "fillColorValue", {
	            get: function () {
	                if (typeof this._fillColor === "function") {
	                    return this._fillColor();
	                }
	                else {
	                    return this._fillColor;
	                }
	            },
	            enumerable: true,
	            configurable: true
	        });
	        return RectangleLayer;
	    })(RenderLayer);
	    exports.RectangleLayer = RectangleLayer;
	    var SpriteLayer = (function (_super) {
	        __extends(SpriteLayer, _super);
	        function SpriteLayer(image) {
	            _super.call(this);
	            this._image = image;
	        }
	        Object.defineProperty(SpriteLayer.prototype, "image", {
	            get: function () {
	                return this._image;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        SpriteLayer.FromPath = function (imagePath) {
	            var image = new Image();
	            image.src = imagePath;
	            return new SpriteLayer(image);
	        };
	        return SpriteLayer;
	    })(RenderLayer);
	    exports.SpriteLayer = SpriteLayer;
	    var TextLayer = (function (_super) {
	        __extends(TextLayer, _super);
	        function TextLayer(text, fillColor, font, sizeInPixels, isCentered) {
	            if (isCentered === void 0) { isCentered = false; }
	            _super.call(this);
	            this._text = text;
	            this._fillColor = fillColor;
	            this._font = font;
	            this._sizeInPixels = sizeInPixels;
	            this._isCentered = isCentered;
	        }
	        Object.defineProperty(TextLayer.prototype, "text", {
	            get: function () {
	                return this._text;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(TextLayer.prototype, "textValue", {
	            get: function () {
	                if (typeof this._text === "function") {
	                    return this._text();
	                }
	                else {
	                    return this._text;
	                }
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(TextLayer.prototype, "fillColor", {
	            get: function () {
	                return this._fillColor;
	            },
	            set: function (newValue) {
	                this._fillColor = newValue;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(TextLayer.prototype, "fillColorValue", {
	            get: function () {
	                if (typeof this._fillColor === "function") {
	                    return this._fillColor();
	                }
	                else {
	                    return this._fillColor;
	                }
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(TextLayer.prototype, "font", {
	            get: function () {
	                return this._font;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(TextLayer.prototype, "sizeInPixels", {
	            get: function () {
	                return this._sizeInPixels;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(TextLayer.prototype, "isCentered", {
	            get: function () {
	                return this._isCentered;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        return TextLayer;
	    })(RenderLayer);
	    exports.TextLayer = TextLayer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(9), __webpack_require__(17), __webpack_require__(18), __webpack_require__(6), __webpack_require__(19), __webpack_require__(3), __webpack_require__(4), __webpack_require__(14)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, player_1, viewport_1, menu_1, volume_1, platform_1, locationComponent_1, renderComponent_1, inputComponent_1) {
	    var Renderer = (function () {
	        function Renderer(canvas, controller, orchestrator) {
	            var _this = this;
	            this.isRunning = false;
	            this.canvas = canvas;
	            this.context = canvas.getContext("2d");
	            this.controller = controller;
	            this.orchestrator = orchestrator;
	            this.gameStateSystem = orchestrator.GetSystem("gameState");
	            this.volume = new volume_1.Volume({
	                x: this.canvas.width,
	                y: this.canvas.height
	            }, controller);
	            this.backgroundMusic = this.volume.createSound("snd/music.wav", { isLooping: true });
	            this.backgroundMusic.play();
	            this.deathSound = this.volume.createSound("snd/death.wav", {});
	            var scoreSystem = orchestrator.GetSystem("score");
	            var backgroundLayerFactory = function (scrollRate, zIndex, spriteUrl) {
	                var layerHeight = canvas.height * 2;
	                var backgroundLayerPosition = new locationComponent_1.LocationComponent(0, 0, canvas.width, layerHeight, 0, 0, 0, locationComponent_1.LocationType.ui);
	                var spriteLayers = [
	                    renderComponent_1.SpriteLayer.FromPath(spriteUrl),
	                    renderComponent_1.SpriteLayer.FromPath(spriteUrl)
	                ];
	                var backgroundSpritePainter = new renderComponent_1.RenderComponent(backgroundLayerPosition, function () {
	                    var layerOffset = (_this.viewport.offset % layerHeight) * scrollRate;
	                    spriteLayers[0].offsetY = layerOffset;
	                    spriteLayers[1].offsetY = layerOffset - (layerHeight);
	                    return spriteLayers;
	                }, 1, zIndex);
	                var entity = {
	                    locationComponent: backgroundLayerPosition,
	                    renderComponent: backgroundSpritePainter
	                };
	                orchestrator.Add(entity);
	            };
	            backgroundLayerFactory(0, 0, "img/staticBackground.png");
	            backgroundLayerFactory(0.5, 0.1, "img/stars1.png");
	            backgroundLayerFactory(1, 0.2, "img/stars2.png");
	            this.gameStateSystem.OnGameState = function (removables) {
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
	                _this.player = new player_1.Player(playerPosition, playerDimensions, "#FF0000", controller, Renderer.defaultGravity, Renderer.gameWidth, _this.volume);
	                removables.push(_this.player);
	                orchestrator.Add(_this.player);
	                var scoreDisplayFactory = function (text, size, verticalOffset) {
	                    var scoreDisplayPosition = new locationComponent_1.LocationComponent(20, canvas.height - verticalOffset - 20, 0, 0, 0, 0, 0, locationComponent_1.LocationType.ui);
	                    var entity = {
	                        locationComponent: scoreDisplayPosition,
	                        renderComponent: new renderComponent_1.RenderComponent(scoreDisplayPosition, [
	                            new renderComponent_1.TextLayer(text, "ffffff", "Oswald", size),
	                        ], 0.8, 0.5)
	                    };
	                    removables.push(entity);
	                    orchestrator.Add(entity);
	                };
	                scoreDisplayFactory(function () {
	                    return scoreSystem.multiplier.toString();
	                }, 200, 200);
	                scoreDisplayFactory(function () {
	                    return "x " + scoreSystem.points.toString();
	                }, 100, 100);
	                scoreDisplayFactory(function () {
	                    return "~ " + scoreSystem.totalScore.toString();
	                }, 100, 0);
	                var upArrowPosition = new locationComponent_1.LocationComponent(300, 40, 120, 99, 0, 0, 0, locationComponent_1.LocationType.world);
	                var upArrowRender = new renderComponent_1.RenderComponent(upArrowPosition, renderComponent_1.SpriteLayer.FromPath("img/upArrow.png"), 0.5, 0.3);
	                var upArrowEntity = {
	                    locationComponent: upArrowPosition,
	                    renderComponent: upArrowRender
	                };
	                removables.push(upArrowEntity);
	                orchestrator.Add(upArrowEntity);
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
	                _this.platform = new platform_1.Platform(platformPosition, platformDimensions, "#FFFFFF", -Renderer.defaultGravity, _this.volume, Renderer.gameWidth);
	                removables.push(_this.platform);
	                orchestrator.Add(_this.platform);
	                _this.platform.viewport = _this.viewport;
	                var originalOnMove = _this.player.onMove;
	                _this.player.onMove = function (amountMoved) {
	                    _this.viewport.SlideUpTo(-_this.player.locationComponent.yPosition + 50);
	                    if (_this.player.locationComponent.yPosition > -(_this.viewport.offset - _this.canvas.height)) {
	                        _this.isRunning = false;
	                        _this.deathSound.play();
	                        _this.gameStateSystem.EndGame();
	                        _this.menu.showMenu(scoreSystem.totalScore, _this.player.fillColor);
	                    }
	                    if (originalOnMove) {
	                        originalOnMove(amountMoved);
	                    }
	                };
	            };
	            this.gameStateSystem.OnMenuState = function (removables) {
	                var menuOpacity = 1;
	                var titlePosition = new locationComponent_1.LocationComponent((Renderer.gameWidth / 2), 140, 0, 0, 0, 0, 0, locationComponent_1.LocationType.ui);
	                var titleRender = new renderComponent_1.RenderComponent(titlePosition, new renderComponent_1.TextLayer("Quadrilactic", "#FFFFFF", "Oswald", 90, true), function () { return menuOpacity; }, 1);
	                var titleText = {
	                    locationComponent: titlePosition,
	                    renderComponent: titleRender
	                };
	                removables.push(titleText);
	                orchestrator.Add(titleText);
	                var scorePosition = new locationComponent_1.LocationComponent((Renderer.gameWidth / 2), 210, 0, 0, 0, 0, 0, locationComponent_1.LocationType.ui);
	                var currentScore = orchestrator.GetSystem("score").totalScore;
	                var scoreRender = new renderComponent_1.RenderComponent(scorePosition, function () {
	                    var result = [];
	                    if (currentScore > 0) {
	                        result.push(new renderComponent_1.TextLayer("Score: " + currentScore, "#FFFFFF", "Oswald", 50, true));
	                    }
	                    return result;
	                }, function () { return menuOpacity; }, 1);
	                var scoreText = {
	                    locationComponent: scorePosition,
	                    renderComponent: scoreRender
	                };
	                removables.push(scoreText);
	                orchestrator.Add(scoreText);
	                var instructionsPosition = new locationComponent_1.LocationComponent(45, 300, 390, 237, 0, 0, 0, locationComponent_1.LocationType.ui);
	                var instructionsRender = new renderComponent_1.RenderComponent(instructionsPosition, renderComponent_1.SpriteLayer.FromPath("img/controls.png"), function () { return menuOpacity; }, 1);
	                var instructionsImage = {
	                    locationComponent: instructionsPosition,
	                    renderComponent: instructionsRender
	                };
	                removables.push(instructionsImage);
	                orchestrator.Add(instructionsImage);
	                var playButtonWidth = 225;
	                var playButtonHeight = 100;
	                var playButtonLeft = (Renderer.gameWidth / 2) - (playButtonWidth / 2);
	                var playButtonTop = 600;
	                var playButtonTextSize = 50;
	                var playButtonForegroundColor = "#000000";
	                var playButtonBackgroundColor = "#FFFFFF";
	                var playBackgroundPosition = new locationComponent_1.LocationComponent(playButtonLeft, playButtonTop, playButtonWidth, playButtonHeight, 0, 0, 0, locationComponent_1.LocationType.ui);
	                var playBackgroundRender = new renderComponent_1.RenderComponent(playBackgroundPosition, [
	                    new renderComponent_1.RectangleLayer(function () { return playButtonBackgroundColor; })
	                ], function () { return menuOpacity; }, 1);
	                var playBackgroundInput = new inputComponent_1.InputComponent();
	                playBackgroundInput.onMouseOver.push(function () {
	                    playButtonBackgroundColor = "#FF0000";
	                });
	                playBackgroundInput.onMouseOut.push(function () {
	                    playButtonBackgroundColor = "#FFFFFF";
	                });
	                var playBackground = {
	                    inputComponent: playBackgroundInput,
	                    locationComponent: playBackgroundPosition,
	                    renderComponent: playBackgroundRender
	                };
	                removables.push(playBackground);
	                orchestrator.Add(playBackground);
	                var playTextPosition = new locationComponent_1.LocationComponent(Renderer.gameWidth / 2, playButtonTop + 70, playButtonWidth, playButtonHeight, 0, 0, 0, locationComponent_1.LocationType.ui);
	                var playTextRender = new renderComponent_1.RenderComponent(playTextPosition, [
	                    new renderComponent_1.TextLayer("Play", function () { return playButtonForegroundColor; }, "Oswald", playButtonTextSize, true)
	                ], function () { return menuOpacity; }, 1);
	                var playText = {
	                    locationComponent: playTextPosition,
	                    renderComponent: playTextRender
	                };
	                removables.push(playText);
	                orchestrator.Add(playText);
	            };
	            this.menu = new menu_1.Menu({
	                x: this.canvas.width,
	                y: this.canvas.height
	            }, controller, function () {
	                _this.viewport.Reset();
	                _this.isRunning = true;
	                _this.gameStateSystem.StartGame();
	                scoreSystem.ResetScore();
	            }, this.volume);
	            this.viewport = new viewport_1.Viewport(this.context, this.orchestrator);
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
	            }
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
	        Renderer.timescale = 16;
	        return Renderer;
	    })();
	    exports.Renderer = Renderer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(7), __webpack_require__(8)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, sound_1, sprite_1) {
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
	            this.level = parseInt(localStorage.getItem("volumePosition") || 2, 10);
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
/* 7 */
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    var Sprite = (function () {
	        function Sprite(imagePath, dimensions) {
	            this.isAlive = true;
	            this.image = new Image();
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
	        };
	        return Sprite;
	    })();
	    exports.Sprite = Sprite;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(10), __webpack_require__(4), __webpack_require__(16)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, physicsBlock_1, renderComponent_1, scoreComponent_1) {
	    var Player = (function (_super) {
	        __extends(Player, _super);
	        function Player(worldPosition, dimensions, color, controller, gravity, worldWidth, volume) {
	            var _this = this;
	            _super.call(this, worldPosition, dimensions, color, gravity, volume, 7, worldWidth);
	            this.bounceCount = 0;
	            this.collisionComponent.onCollide.push(function () {
	                _this.isJumping = false;
	                _this.locationComponent.rotation = 0;
	                _this.jumpRotationSpeed = 0;
	                _this.bounce.play();
	                _this.bounceCount++;
	            });
	            var backgroundLayer = new renderComponent_1.RectangleLayer(function () {
	                var xHexidecimal = Math.max(Math.round(15 - Math.abs(_this.locationComponent.xSpeed)), 0).toString(16);
	                var yHexidecimal = Math.max(Math.round(15 - Math.abs(_this.locationComponent.ySpeed)), 0).toString(16);
	                return "#" + yHexidecimal + yHexidecimal + "ff" + xHexidecimal + xHexidecimal;
	            });
	            var upSprite = renderComponent_1.SpriteLayer.FromPath("img/faceHappy.png");
	            var downSprite = renderComponent_1.SpriteLayer.FromPath("img/faceWorried.png");
	            var hoverSprite = renderComponent_1.SpriteLayer.FromPath("img/faceChill.png");
	            var layerComposer = function () {
	                var layers = [backgroundLayer];
	                if (_this.locationComponent.ySpeed > Player.faceSwapThreshold) {
	                    layers.push(downSprite);
	                }
	                else if (_this.locationComponent.ySpeed < -Player.faceSwapThreshold) {
	                    layers.push(upSprite);
	                }
	                else {
	                    layers.push(hoverSprite);
	                }
	                return layers;
	            };
	            this.renderComponent = new renderComponent_1.RenderComponent(this.locationComponent, layerComposer, 1, 1);
	            var jump = function (entity, orchestrator, deltaTime) {
	                if (_this.isJumping) {
	                    return;
	                }
	                _this.jump.play();
	                _this.locationComponent.ySpeed = Player.jumpSpeedIncrease * deltaTime;
	                _this.isJumping = true;
	                _this.jumpRotationSpeed = _this.direction === "right" ? Player.initialJumpRotationSpeed : -Player.initialJumpRotationSpeed;
	            };
	            var moveLeft = function (entity, orchestrator, deltaTime) {
	                _this.locationComponent.xSpeed -= (Player.horizontalSpeedIncrease * deltaTime);
	            };
	            var moveRight = function (entity, orchestrator, deltaTime) {
	                _this.locationComponent.xSpeed += (Player.horizontalSpeedIncrease * deltaTime);
	            };
	            this.inputComponent.getKeyHandler("up").push(jump);
	            this.inputComponent.getKeyHandler("space").push(jump);
	            this.inputComponent.getKeyHandler("w").push(jump);
	            this.inputComponent.getKeyHandler("left").push(moveLeft);
	            this.inputComponent.getKeyHandler("a").push(moveLeft);
	            this.inputComponent.getKeyHandler("right").push(moveRight);
	            this.inputComponent.getKeyHandler("d").push(moveRight);
	            this.scoreComponent = new scoreComponent_1.ScoreComponent(function () {
	                return -_this.locationComponent.top / 1000;
	            }, function () {
	                return _this.bounceCount;
	            });
	            this.isJumping = false;
	            this.jump = volume.createSound("snd/jump.wav", {});
	            this.bounce = volume.createSound("snd/blip3.wav", {});
	        }
	        Player.prototype.Tick = function (deltaTime) {
	            _super.prototype.Tick.call(this, deltaTime);
	            this.locationComponent.rotation += (this.jumpRotationSpeed * deltaTime);
	            if (this.jumpRotationSpeed > 0) {
	                this.jumpRotationSpeed = Math.max(0, this.jumpRotationSpeed - Player.jumpRotationSlowDown);
	            }
	            else if (this.jumpRotationSpeed < 0) {
	                this.jumpRotationSpeed = Math.min(0, this.jumpRotationSpeed + Player.jumpRotationSlowDown);
	            }
	            this.locationComponent.rotation += this.locationComponent.xSpeed / 2;
	        };
	        Player.prototype.Reset = function () {
	            _super.prototype.Reset.call(this);
	            this.isJumping = false;
	            this.locationComponent.rotation = 0;
	            this.jumpRotationSpeed = 0;
	            this.bounceCount = 0;
	        };
	        Player.jumpSpeedIncrease = -8;
	        Player.jumpRotationSlowDown = 0.1;
	        Player.initialJumpRotationSpeed = 15;
	        Player.horizontalSpeedIncrease = 0.5;
	        Player.faceSwapThreshold = 3.5;
	        return Player;
	    })(physicsBlock_1.PhysicsBlock);
	    exports.Player = Player;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(11)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, block_1) {
	    var PhysicsBlock = (function (_super) {
	        __extends(PhysicsBlock, _super);
	        function PhysicsBlock(worldPosition, dimensions, color, gravity, volume, xSpeedLimit, worldWidth) {
	            var _this = this;
	            _super.call(this, worldPosition, dimensions, color, xSpeedLimit);
	            this.internalGravity = gravity;
	            this.worldWidth = worldWidth;
	            this.rebound = volume.createSound("snd/blip.wav", {});
	            this.collisionComponent.onCollide.push(function () {
	                _this.skew += 10;
	            });
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
	        PhysicsBlock.prototype.Reset = function () {
	            _super.prototype.Reset.call(this);
	        };
	        return PhysicsBlock;
	    })(block_1.Block);
	    exports.PhysicsBlock = PhysicsBlock;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3), __webpack_require__(4), __webpack_require__(12), __webpack_require__(14), __webpack_require__(15)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, locationComponent_1, renderComponent_1, collisionComponent_1, inputComponent_1, emitterComponent_1) {
	    var Block = (function () {
	        function Block(worldPosition, dimensions, color, xSpeedLimit) {
	            var _this = this;
	            this.locationComponent = new locationComponent_1.LocationComponent(worldPosition.x, worldPosition.y, dimensions.x, dimensions.y, worldPosition.dX, worldPosition.dY, 0);
	            this.collisionComponent = new collisionComponent_1.CollisionComponent(this.locationComponent);
	            this.inputComponent = new inputComponent_1.InputComponent();
	            this.emitterComponent = new emitterComponent_1.EmitterComponent(function (orchestrator) {
	                var particlePosition = _this.locationComponent.Duplicate();
	                particlePosition.xSpeed = 0;
	                particlePosition.ySpeed = 0;
	                var anyColor = "red";
	                _this.renderComponent.layers.forEach(function (layer) {
	                    var possibleRectangleLayer = layer;
	                    if (possibleRectangleLayer.fillColorValue) {
	                        anyColor = possibleRectangleLayer.fillColorValue;
	                    }
	                });
	                var particleOpacity = 0.2;
	                var particle = {
	                    locationComponent: particlePosition,
	                    renderComponent: new renderComponent_1.RenderComponent(particlePosition, new renderComponent_1.RectangleLayer(anyColor), function () {
	                        particleOpacity -= 0.01;
	                        if (particleOpacity <= 0) {
	                            orchestrator.Remove(particle);
	                            return 0;
	                        }
	                        return particleOpacity;
	                    }, _this.renderComponent.zIndex - 0.1)
	                };
	                orchestrator.Add(particle);
	            });
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
	                    x: this.locationComponent.xPositionValue + (widthAdjustment / 2),
	                    y: this.locationComponent.yPositionValue - (heightAdjustment / 2)
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
	            this.locationComponent.xPosition = this.locationComponent.xPositionValue + (this.locationComponent.xSpeed * deltaTime);
	            this.locationComponent.yPosition = this.locationComponent.yPositionValue + (this.locationComponent.ySpeed * deltaTime);
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(13)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, callbackArray_1) {
	    var CollisionComponent = (function () {
	        function CollisionComponent(position) {
	            this._onCollide = new callbackArray_1.CallbackArray();
	            this._position = position;
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
	        Object.defineProperty(CollisionComponent.prototype, "onCollide", {
	            get: function () {
	                return this._onCollide;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        return CollisionComponent;
	    })();
	    exports.CollisionComponent = CollisionComponent;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    var CallbackArray = (function (_super) {
	        __extends(CallbackArray, _super);
	        function CallbackArray() {
	            _super.apply(this, arguments);
	        }
	        CallbackArray.prototype.trigger = function (entity, orchestrator, deltaTime) {
	            this.forEach(function (individualCallback) {
	                individualCallback(entity, orchestrator, deltaTime);
	            });
	        };
	        return CallbackArray;
	    })(Array);
	    exports.CallbackArray = CallbackArray;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(13)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, callbackArray_1) {
	    var InputComponent = (function () {
	        function InputComponent() {
	            this._keyHandlers = {};
	            this._onMouseOver = new callbackArray_1.CallbackArray();
	            this._onMouseOut = new callbackArray_1.CallbackArray();
	            this._onMouseClick = new callbackArray_1.CallbackArray();
	        }
	        Object.defineProperty(InputComponent.prototype, "definedKeyHandlers", {
	            get: function () {
	                return this._keyHandlers;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        InputComponent.prototype.getKeyHandler = function (key) {
	            var foundHandler = this._keyHandlers[key];
	            if (!foundHandler) {
	                foundHandler = new callbackArray_1.CallbackArray();
	                this._keyHandlers[key] = foundHandler;
	            }
	            return foundHandler;
	        };
	        Object.defineProperty(InputComponent.prototype, "onMouseOver", {
	            get: function () {
	                return this._onMouseOver;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(InputComponent.prototype, "onMouseOut", {
	            get: function () {
	                return this._onMouseOut;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(InputComponent.prototype, "onMouseClick", {
	            get: function () {
	                return this._onMouseClick;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(InputComponent.prototype, "isMouseOver", {
	            get: function () {
	                return this._isMouseOver;
	            },
	            set: function (newValue) {
	                this._isMouseOver = newValue;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(InputComponent.prototype, "isMouseDown", {
	            get: function () {
	                return this._isMouseDown;
	            },
	            set: function (newValue) {
	                this._isMouseDown = newValue;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        return InputComponent;
	    })();
	    exports.InputComponent = InputComponent;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    var EmitterComponent = (function () {
	        function EmitterComponent(emitter) {
	            this._emitter = emitter;
	        }
	        Object.defineProperty(EmitterComponent.prototype, "emitter", {
	            get: function () {
	                return this._emitter;
	            },
	            set: function (newEmitter) {
	                this._emitter = newEmitter;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        return EmitterComponent;
	    })();
	    exports.EmitterComponent = EmitterComponent;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    var ScoreComponent = (function () {
	        function ScoreComponent(points, multiplier) {
	            this._points = points;
	            this._multiplier = multiplier;
	        }
	        Object.defineProperty(ScoreComponent.prototype, "points", {
	            get: function () {
	                return this._points;
	            },
	            set: function (newPoints) {
	                this._points = newPoints;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(ScoreComponent.prototype, "pointsValue", {
	            get: function () {
	                if (typeof this._points === "function") {
	                    return this._points();
	                }
	                else {
	                    return this._points;
	                }
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(ScoreComponent.prototype, "multiplier", {
	            get: function () {
	                return this._multiplier;
	            },
	            set: function (newMultiplier) {
	                this._multiplier = newMultiplier;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(ScoreComponent.prototype, "multiplierValue", {
	            get: function () {
	                if (typeof this._multiplier === "function") {
	                    return this._multiplier();
	                }
	                else {
	                    return this._multiplier;
	                }
	            },
	            enumerable: true,
	            configurable: true
	        });
	        return ScoreComponent;
	    })();
	    exports.ScoreComponent = ScoreComponent;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    var Viewport = (function () {
	        function Viewport(renderContext, orchestrator) {
	            this.renderContext = renderContext;
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
	            if (fps) {
	                this.renderContext.fillStyle = "#FFFFFF";
	                this.renderContext.fillText("FPS: " + fps.toString(), 0, 10);
	            }
	        };
	        Viewport.prototype.Reset = function () {
	            this.renderOffset = 0;
	            this.orchestrator.GetSystem("render").offsetY = 0;
	        };
	        return Viewport;
	    })();
	    exports.Viewport = Viewport;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    var Menu = (function () {
	        function Menu(renderDimensions, controller, onStartGame, volume) {
	            this.renderDimensions = renderDimensions;
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
	            var horizontalCenter = (this.renderDimensions.x / 2);
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
	            this.opacity = Math.min(1, this.opacity + Menu.fadeInRate);
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
	        Menu.playFontSizeInPx = 50;
	        Menu.buttonWidth = 225;
	        Menu.buttonHeight = 100;
	        Menu.fadeInRate = 0.02;
	        return Menu;
	    })();
	    exports.Menu = Menu;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(10), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, physicsBlock_1, renderComponent_1) {
	    var Platform = (function (_super) {
	        __extends(Platform, _super);
	        function Platform(worldPosition, dimensions, color, gravity, volume, worldWidth) {
	            var _this = this;
	            _super.call(this, worldPosition, dimensions, color, gravity, volume, 10, worldWidth);
	            this.collisionComponent.onCollide.push(function () {
	                if (_this.locationComponent.ySpeed < Platform.minimumReboundSpeed) {
	                    _this.locationComponent.ySpeed = Platform.minimumReboundSpeed;
	                }
	            });
	            this.renderComponent = new renderComponent_1.RenderComponent(this.locationComponent, new renderComponent_1.RectangleLayer(color), 1, 1);
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
	            if (this.offscreenAmount > 0) {
	                renderContext.save();
	                renderContext.fillStyle = this.fillColor;
	                renderContext.globalAlpha = 0.2;
	                renderContext.fillRect(this.locationComponent.left, this.bottomOfScreen - this.locationComponent.height, this.locationComponent.width, this.locationComponent.height);
	                renderContext.globalAlpha = 1;
	                renderContext.fillRect(this.locationComponent.left, this.bottomOfScreen - this.locationComponent.height, ((this.offscreenAmount / 10) % this.locationComponent.width), this.locationComponent.height);
	                renderContext.restore();
	            }
	        };
	        Platform.platformSpeedIncrease = 1000;
	        Platform.minimumReboundSpeed = 10;
	        return Platform;
	    })(physicsBlock_1.PhysicsBlock);
	    exports.Platform = Platform;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 20 */
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
/* 21 */
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
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, system_1) {
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
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, system_1) {
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
	            var entityAPreviousLeft = entityA.locationComponent.xPositionValue - entityA.locationComponent.xSpeed;
	            var entityAPreviousRight = entityAPreviousLeft + entityA.locationComponent.width;
	            var entityBPreviousLeft = entityB.locationComponent.xPositionValue - entityA.locationComponent.xSpeed;
	            var entityBPreviousRight = entityBPreviousLeft + entityB.locationComponent.width;
	            var wasHorizontalOverlap = (entityAPreviousLeft < entityBPreviousRight)
	                && (entityAPreviousRight > entityBPreviousLeft);
	            if (!wasHorizontalOverlap) {
	                entityA.locationComponent.xSpeed = -entityA.locationComponent.xSpeed;
	                entityB.locationComponent.xSpeed = -entityB.locationComponent.xSpeed;
	            }
	            entityA.collisionComponent.onCollide.trigger(entityA, orchestrator, deltaTime);
	            entityB.collisionComponent.onCollide.trigger(entityB, orchestrator, deltaTime);
	        };
	        return CollisionSystem;
	    })(system_1.System);
	    exports.CollisionSystem = CollisionSystem;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, system_1) {
	    var InputSystem = (function (_super) {
	        __extends(InputSystem, _super);
	        function InputSystem(controller) {
	            _super.call(this);
	            this._controller = controller;
	        }
	        InputSystem.prototype.Run = function (entities, orchestrator, deltaTime) {
	            var _this = this;
	            system_1.System.ApplyToIndividuals(entities, function (entity) {
	                return !!entity.inputComponent;
	            }, function (entity) {
	                if (entity.locationComponent) {
	                    _this.TriggerMouseHandlers(entity, orchestrator, deltaTime);
	                }
	                _this.TriggerKeyHandlers(entity, orchestrator, deltaTime);
	            });
	            this._controller.clearClick();
	        };
	        InputSystem.prototype.TriggerMouseHandlers = function (entity, orchestrator, deltaTime) {
	            var inputHandlers = entity.inputComponent;
	            var hoverLocation = this._controller.getMousePosition();
	            var clickLocation = this._controller.getClickPosition();
	            var detectOverlap = function (position) {
	                if (!hoverLocation) {
	                    return false;
	                }
	                var location = entity.locationComponent;
	                var isHorizontalOverlap = position.x > location.left && position.x < location.right;
	                var isVerticalOverlap = position.y > location.top && position.y < location.bottom;
	                return isHorizontalOverlap && isVerticalOverlap;
	            };
	            if (!detectOverlap(hoverLocation)) {
	                if (inputHandlers.isMouseOver) {
	                    inputHandlers.isMouseOver = false;
	                    inputHandlers.onMouseOut.trigger(entity, orchestrator, deltaTime);
	                }
	                if (inputHandlers.isMouseDown) {
	                    inputHandlers.isMouseDown = false;
	                }
	                return;
	            }
	            if (!inputHandlers.isMouseOver) {
	                inputHandlers.onMouseOver.trigger(entity, orchestrator, deltaTime);
	                inputHandlers.isMouseOver = true;
	            }
	            if (!inputHandlers.isMouseDown && clickLocation) {
	                inputHandlers.onMouseClick.trigger(entity, orchestrator, deltaTime);
	                inputHandlers.isMouseDown = true;
	            }
	        };
	        InputSystem.prototype.TriggerKeyHandlers = function (entity, orchestrator, deltaTime) {
	            for (var key in entity.inputComponent.definedKeyHandlers) {
	                if (this._controller.isKeyPressed(key)) {
	                    entity.inputComponent.getKeyHandler(key).trigger(entity, orchestrator, deltaTime);
	                }
	            }
	        };
	        return InputSystem;
	    })(system_1.System);
	    exports.InputSystem = InputSystem;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, system_1) {
	    var ScoreSystem = (function (_super) {
	        __extends(ScoreSystem, _super);
	        function ScoreSystem() {
	            _super.call(this);
	            this.ResetScore();
	        }
	        Object.defineProperty(ScoreSystem.prototype, "points", {
	            get: function () {
	                return ScoreSystem.round(this._points);
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(ScoreSystem.prototype, "multiplier", {
	            get: function () {
	                return ScoreSystem.round(this._multiplier);
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(ScoreSystem.prototype, "totalScore", {
	            get: function () {
	                return ScoreSystem.round(this._points * this._multiplier);
	            },
	            enumerable: true,
	            configurable: true
	        });
	        ScoreSystem.round = function (target) {
	            return Math.round(target * 100) / 100;
	        };
	        ScoreSystem.prototype.Run = function (entities, orchestrator, deltaTime) {
	            var currentPoints = 0;
	            var currentMultiplier = 0;
	            system_1.System.ApplyToIndividuals(entities, function (entity) {
	                return !!entity.scoreComponent;
	            }, function (entity) {
	                currentPoints += entity.scoreComponent.pointsValue;
	                currentMultiplier += entity.scoreComponent.multiplierValue;
	            });
	            if (currentPoints > this._points) {
	                this._points = currentPoints;
	            }
	            if (currentMultiplier > this._multiplier) {
	                this._multiplier = currentMultiplier;
	            }
	        };
	        ScoreSystem.prototype.ResetScore = function () {
	            this._points = 0;
	            this._multiplier = 0;
	        };
	        return ScoreSystem;
	    })(system_1.System);
	    exports.ScoreSystem = ScoreSystem;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, system_1) {
	    (function (GameState) {
	        GameState[GameState["None"] = 0] = "None";
	        GameState[GameState["Menu"] = 1] = "Menu";
	        GameState[GameState["Game"] = 2] = "Game";
	    })(exports.GameState || (exports.GameState = {}));
	    var GameState = exports.GameState;
	    var GameStateSystem = (function (_super) {
	        __extends(GameStateSystem, _super);
	        function GameStateSystem() {
	            _super.call(this);
	            this._removables = [];
	            this._state = GameState.None;
	            this._nextState = GameState.Menu;
	        }
	        Object.defineProperty(GameStateSystem.prototype, "OnMenuState", {
	            get: function () {
	                return this._onMenuState;
	            },
	            set: function (newHandler) {
	                this._onMenuState = newHandler;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(GameStateSystem.prototype, "OnGameState", {
	            get: function () {
	                return this._onGameState;
	            },
	            set: function (newHandler) {
	                this._onGameState = newHandler;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        GameStateSystem.prototype.Run = function (entities, orchestrator, deltaTime) {
	            var nextState = this._nextState;
	            this._nextState = undefined;
	            if (this._state === nextState || !nextState) {
	                return;
	            }
	            this._state = nextState;
	            this._removables.forEach(function (entity) {
	                orchestrator.Remove(entity);
	            });
	            this._removables = [];
	            switch (nextState) {
	                case GameState.Game:
	                    this._onGameState(this._removables);
	                    break;
	                case GameState.Menu:
	                    this._onMenuState(this._removables);
	                    break;
	                default:
	                    break;
	            }
	        };
	        GameStateSystem.prototype.StartGame = function () {
	            this._nextState = GameState.Game;
	        };
	        GameStateSystem.prototype.EndGame = function () {
	            this._nextState = GameState.Menu;
	        };
	        return GameStateSystem;
	    })(system_1.System);
	    exports.GameStateSystem = GameStateSystem;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, system_1) {
	    var EmitterSystem = (function (_super) {
	        __extends(EmitterSystem, _super);
	        function EmitterSystem() {
	            _super.call(this);
	        }
	        EmitterSystem.prototype.Run = function (entities, orchestrator, deltaTime) {
	            var _this = this;
	            system_1.System.ApplyToIndividuals(entities, function (entity) {
	                return !!entity.emitterComponent;
	            }, function (entity) {
	                _this.Emit(entity, orchestrator, deltaTime);
	            });
	        };
	        EmitterSystem.prototype.Emit = function (entity, orchestrator, deltaTime) {
	            entity.emitterComponent.emitter(orchestrator, deltaTime);
	        };
	        return EmitterSystem;
	    })(system_1.System);
	    exports.EmitterSystem = EmitterSystem;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map