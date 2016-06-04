import {LocationComponent} from "entitySystem/locationComponent";
import {RenderComponent} from "entitySystem/renderComponent";
import {CollisionComponent} from "entitySystem/collisionComponent";
import {InputComponent} from "entitySystem/inputComponent";
import {ScoreComponent} from "entitySystem/scoreComponent";
import {EmitterComponent} from "entitySystem/emitterComponent";

export interface Entity {
	locationComponent?: LocationComponent;
	renderComponent?: RenderComponent;
	collisionComponent?: CollisionComponent;
	inputComponent?: InputComponent;
	scoreComponent?: ScoreComponent;
	emitterComponent?: EmitterComponent;
}
