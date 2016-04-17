import {Orchestrator} from "entitySystem/orchestrator";

export interface Renderable {
	isAlive: boolean;
	Render(renderContext: CanvasRenderingContext2D, orchestrator: Orchestrator): Renderable[];
}
