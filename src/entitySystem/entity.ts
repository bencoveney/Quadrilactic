import {LocationComponent} from "entitySystem/locationComponent";
import {RenderComponent} from "entitySystem/renderComponent";

export interface Entity {
	locationComponent?: LocationComponent;
	renderComponent?: RenderComponent;
}
