import {Document} from "../model/document";
import {Query} from "./query";

/**
 * The interface providing read access methods 
 * for datastores supporting the idai-components-2 document model.
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
     * @param resourceId the desired document's resource id
     * @returns {Promise<Document>} a document (rejects with msgWithParams in case of error)
     *  Rejects with
     *     [DOCUMENT_NOT_FOUND] - in case document is missing
     */ 
    abstract get(resourceId: string): Promise<Document>;

    /**
     * Perform a fulltext query
     
     * @param query the query object
     * @returns {Promise<Document[]>} an array of documents
     *   Rejects with
     *     [GENERIC_ERROR (, cause: any)] - in case of error, optionally including a cause
     */
    abstract find(query: Query): Promise<Document[]>;
}
