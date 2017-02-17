import {Document} from "../model/document";
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
     * @returns {Promise<Document|string>} either a document or an error message, possibly a key of M
     */
    abstract create(doc: Document): Promise<Document|string>;

    /**
     * @param doc
     * @returns {Promise<Document|string>} either a document or an error message, possibly a key of M
     */ 
    abstract update(doc: Document): Promise<Document|string>;

    /**
     * @param doc
     * @returns {Promise<undefined|string>} undefined or an error message, possibly a key of M
     */
    abstract remove(doc: Document): Promise<undefined|any>;

    /**
     * Subscription enables clients to get notified
     * when documents get modified via one of the accessor
     * methods defined in <code>Datastore</code>.
     */
    abstract documentChangesNotifications():Observable<Document>;

}
