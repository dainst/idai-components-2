import {Injectable} from "@angular/core";
import {ValidationInterceptor} from "../../lib/app/object-edit/validation-interceptor"
import {Entity} from "../../lib/app/core-services/entity"

/**
 * @author Daniel de Oliveira
 */
@Injectable()
export class DemoValidationInterceptor extends ValidationInterceptor {

    validate(object:Entity) : string {
        return undefined;
    }
}