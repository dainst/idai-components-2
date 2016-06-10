import {Entity} from "../core-services/entity"

export abstract class LoadAndSaveInterceptor {
    
    abstract interceptLoad(object:Entity) : Entity;
    abstract interceptSave(object:Entity) : Entity;
}