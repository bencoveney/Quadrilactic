import {Renderer} from "renderer";
import {Controller} from "controller";
import {Orchestrator} from "entitySystem/orchestrator";
import {LocationSystem} from "entitySystem/locationSystem";
import {RenderSystem} from "entitySystem/renderSystem";
import {CollisionSystem} from "entitySystem/collisionSystem";
import {InputSystem} from "entitySystem/inputSystem";
import {ScoreSystem} from "entitySystem/scoreSystem";

let canvas: HTMLCanvasElement = document.getElementById("viewport") as HTMLCanvasElement;

let controller: Controller = new Controller(canvas);

let orchestrator: Orchestrator = new Orchestrator(
	[],
	{
		"location": new LocationSystem()
	},
	{
		"input": new InputSystem(controller),
		"collision": new CollisionSystem(),
		"score": new ScoreSystem()
	},
	{
		"render": new RenderSystem(canvas.getContext("2d"))
	});

new Renderer(canvas, controller, orchestrator).Start();

// Ensure keyboard events when loaded in an iframe (fix for itch.io)
window.onload = function(): void {
	window.focus();
};
window.onclick = function(): void {
	window.focus();
};
