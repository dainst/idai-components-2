import {Resource} from "../core-services/resource"

/**
 * @author Daniel de Oliveira
 */
export abstract class ValidationInterceptor {

    /**
     * @param resource should be treated as immutable and should not get changed
     *   from within implementations of this method.
     * @return {string} a message key of MD or a message if validation not passed and
     *   <undefined> otherwise
     */
    abstract validate(resource:Resource) : string;
}