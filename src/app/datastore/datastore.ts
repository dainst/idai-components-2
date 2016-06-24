import {Document} from "../core-services/document";
import {ReadDatastore} from "./read-datastore";
import {Observable} from "rxjs/Observable";

/**
 * The interface for datastores supporting 
 * the idai-components document model.
 * 
 * @author Sebastian Cuy
 * @author Daniel de Oliveira
 */ 
export abstract class Datastore extends ReadDatastore {

    /**
     * @param doc
     * @returns {Promise<T>} resolve -> (),
     *   reject -> the error message or a message key.
     */
    abstract create(doc: Document): Promise<string>;

    /**
     * @param doc
     * @returns {Promise<T>} resolve -> (),
     *   reject -> the error message or a message key.
     */ 
    abstract update(doc: Document): Promise<any>;

    /**
     * @param resourceId document['resource']['id']
     */
    abstract remove(resourceId: string): Promise<any>;

    /**
     * Subscription enables clients to get notified
     * when documents get modified via one of the accessor
     * methods defined here.
     */
    abstract documentChangesNotifications():Observable<Document>;
}
