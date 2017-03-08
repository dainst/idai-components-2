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
     * @returns {Promise<Document>} a document (in case of error: a key of M)
     */ 
    abstract get(resourceId: string): Promise<Document>;

    /**
     * Perform a fulltext query
     
     * @param query the query object
     * @param offset the number of documents to skip before returning
     * @param limit the maximum number of documents to be returned
     * @returns {Promise<Document[]>} an array of documents (in case of error: a key of M)
     */
    abstract find(query: Query, offset?: number, limit?: number): Promise<Document[]>;

    /**
     * Returns all documents ordered by modification date (descending)
     
     * @param type only return documents for the given type
     * @param offset the number of documents to skip before returning
     * @param limit the maximum number of documents to be returned
     * @returns {Promise<Document[]>} an array of documents (in case of error: a key of M)
     */
    abstract all(type?: string, offset?: number,
                 limit?: number): Promise<Document[]>;

    /**
     * Updates <code>doc</code> so that it reflects
     * the current state of the doc in the database.
     *
     * @param doc
     * @returns {Promise<Document>} an array of documents (in case of error: a key of M)
     */
    abstract refresh(doc: Document): Promise<Document>;

}
