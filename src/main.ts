/// <reference path="../typings/tsd.d.ts" />
/// <reference path="renderer.ts" />
/// <reference path="controller.ts" />

let canvas: HTMLCanvasElement = document.getElementById("viewport") as HTMLCanvasElement;

let controller: Controller = new Controller();

let renderer: Renderer = new Renderer(canvas, controller);

renderer.Start();