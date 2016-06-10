import {Injectable} from "@angular/core";
import {LoadAndSaveInterceptor} from "../../lib/app/object-edit/load-and-save-interceptor"
import {Entity} from "../../lib/app/core-services/entity"

/**
 * @author Daniel de Oliveira
 */
@Injectable()
export class DemoLoadAndSaveInterceptor extends LoadAndSaveInterceptor {

    interceptLoad(object:Entity) : Entity {
        return object;
    }

    interceptSave(object:Entity) : Entity {
        return <Entity>JSON.parse(JSON.stringify(object));
    }
}