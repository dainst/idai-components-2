import {Injectable} from "@angular/core";
import {MD} from "../../lib/app/core-services/md";
import {LoadAndSaveInterceptor} from "../../lib/app/object-edit/load-and-save-interceptor"
import {Entity} from "../../lib/app/core-services/entity"

/**
 * @author Daniel de Oliveira
 */
@Injectable()
export class DemoLoadAndSaveInterceptor extends LoadAndSaveInterceptor {

    interceptLoad(object:Entity) : string {
        return undefined;
    }

    interceptSave(object:Entity) : string {
        return undefined;
    }
}