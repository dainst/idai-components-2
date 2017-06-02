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
     * Persists a given document. If document.resource.id is not set,
     * it will be set to a generated value. In case of an error it remains undefined.
     *
     * In case of a successful call, document.modified and document.created get set,
     * otherwise they remain undefined.
     *
     * @param doc
     * @returns {Promise<Document>} a document
     *   Rejects with
     *     [GENERIC_SAVE_ERROR] - in case of error
     */
    abstract create(doc: Document): Promise<Document>;

    /**
     * @param doc
     * @returns {Promise<Document>} a document
     *    Rejects with
     *     [GENERIC_SAVE_ERROR] - in case of error
     *     [SAVE_CONFLICT] - in case of conflict
     *     [DOCUMENT_NO_RESOURCE_ID] - if document has no resource id
     *     [DOCUMENT_DOES_NOT_EXIST_ERROR] - if document has a resource id, but does not exist in the db
     */
    abstract update(doc: Document): Promise<Document>;

    /**
     * @param doc
     * @returns {Promise<undefined>} undefined (rejects with msgWithParams in case of error)
     */
    abstract remove(doc: Document): Promise<undefined>;

    /**
     * Subscription enables clients to get notified
     * when documents get modified via one of the accessor
     * methods defined in <code>Datastore</code>.
     */
    abstract documentChangesNotifications(): Observable<Document>;

}
