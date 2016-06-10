import {Entity} from "../core-services/entity"

export abstract class LoadAndSaveInterceptor {
    
    abstract interceptLoad(object:Entity) : string;
    abstract interceptSave(object:Entity) : string;
}