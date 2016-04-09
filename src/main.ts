/// <reference path="../typings/tsd.d.ts" />
/// <reference path="renderer.ts" />
/// <reference path="controller.ts" />

let canvas: HTMLCanvasElement = document.getElementById("viewport") as HTMLCanvasElement;

let controller: Controller = new Controller(canvas);

let renderer: Renderer = new Renderer(canvas, controller);

// Ensure keyboard events when loaded in an iframe (fix for itch.io)
window.onload = function(){
	window.focus();
}
window.onclick = function(){
	window.focus();
}