import {Document} from "../core-services/document";
import {Observable} from "rxjs/Observable";

/**
 * The interface providing read access methods 
 * for datastores supporting the idai-components document model.
 * For full access see <code>Datastore</code>
 *
 * Implementations guarantee that any of methods declared here
 * have no effect on any of the documents within the datastore.
 * 
 * @author Sebastian Cuy
 * @author Daniel de Oliveira
 */
export abstract class ReadDatastore  {

    /**
     * @param query
     * @returns {Promise<T>} resolve -> {Document},
     *   reject -> the error message or a message key.
     */ 
    abstract get(resourceId: string): Promise<Document>;

    /**
     * @param query
     * @returns {Promise<T>} resolve -> {Document[]},
     *   reject -> the error message or a message key.
     */ 
    abstract find(query: string): Promise<Document[]>;

    abstract all(options: any): Promise<Document[]>;
}
