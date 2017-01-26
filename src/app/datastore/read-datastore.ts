import {Document} from "../model/document";
import {Query} from "./query";

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
     * @param id the desired document's id
     * @returns {Promise<T>} resolve -> {Document},
     *   reject -> the error message or a message key.
     */ 
    abstract get(id: string): Promise<Document>;

    /**
     * @param query
     * @returns {Promise<T>} resolve -> {Document[]},
     *   reject -> the error message or a message key.
     */ 
    abstract find(query: Query): Promise<Document[]>;

    abstract all(options: any): Promise<Document[]>;

    /**
     * Gets the specified object without using the cache
     * @param id the desired document's id
     * @returns {Promise<T>} resolve -> {Document},
     *   reject -> the error message or a message key.
     */
    abstract refresh(id: string): Promise<Document>;

}
