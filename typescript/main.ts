/// <reference path="../typings/tsd.d.ts" />
/// <reference path="renderer.ts" />

let canvas: HTMLCanvasElement = document.getElementById("viewport") as HTMLCanvasElement;

let renderer: Renderer = new Renderer(canvas);

renderer.Start();