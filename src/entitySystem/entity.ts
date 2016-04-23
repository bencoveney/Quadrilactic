import {LocationComponent} from "entitySystem/locationComponent";
import {RenderComponent} from "entitySystem/renderComponent";
import {CollisionComponent} from "entitySystem/collisionComponent";
import {InputComponent} from "entitySystem/inputComponent";

export interface Entity {
	locationComponent?: LocationComponent;
	renderComponent?: RenderComponent;
	collisionComponent?: CollisionComponent;
	inputComponent?: InputComponent;
}
