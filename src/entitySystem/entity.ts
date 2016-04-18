import {LocationComponent} from "entitySystem/locationComponent";
import {RenderComponent} from "entitySystem/renderComponent";
import {CollisionComponent} from "entitySystem/collisionComponent";

export interface Entity {
	locationComponent?: LocationComponent;
	renderComponent?: RenderComponent;
	collisionComponent?: CollisionComponent;
}
