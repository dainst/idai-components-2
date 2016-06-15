import {Injectable} from "@angular/core";
import {ValidationInterceptor} from "../../lib/app/object-edit/validation-interceptor"
import {Resource} from "../../lib/app/core-services/resource"

/**
 * @author Daniel de Oliveira
 */
@Injectable()
export class DemoValidationInterceptor extends ValidationInterceptor {

    validate(resource:Resource) : string {
        return undefined;
    }
}