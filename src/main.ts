import {Renderer} from "renderer";
import {Controller} from "controller";
import {Orchestrator} from "entitySystem/orchestrator";
import {LocationSystem} from "entitySystem/LocationSystem";
import {RenderSystem} from "entitySystem/RenderSystem";

let canvas: HTMLCanvasElement = document.getElementById("viewport") as HTMLCanvasElement;

let controller: Controller = new Controller(canvas);

let orchestrator: Orchestrator = new Orchestrator(
	[],
	{},
	{
		"location": new LocationSystem(),
	},
	{
		"render": new RenderSystem(),
	});

new Renderer(canvas, controller, orchestrator).Start();

// Ensure keyboard events when loaded in an iframe (fix for itch.io)
window.onload = function(): void {
	window.focus();
};
window.onclick = function(): void {
	window.focus();
};
