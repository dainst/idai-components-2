import {Entity} from "../core-services/entity"

/**
 * @author Daniel de Oliveira
 */
export abstract class ValidationInterceptor {

    /**
     * @param object should be treated as immutable and should not get changed
     *   from within implementations of this method.
     * @return {string} a message key of MD or a message if validation not passed and
     *   <undefined> otherwise
     */
    abstract validate(object:Entity) : string;
}