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
     * @returns {Promise<Document|string>} a document | a key of M for an error desription
     */ 
    abstract get(resourceId: string): Promise<Document|string>;

    /**
     * Perform a fulltext query
     
     * @param query the query object
     * @param offset the number of documents to skip before returning
     * @param limit the maximum number of documents to be returned
     * @returns {Promise<Document[]|string>} an array of documents | a key of M for an error desription
     */
    abstract find(query: Query, offset?:number, limit?:number): Promise<Document[]|string>;

    /**
     * Returns all documents ordered by modification date (descending)
     
     * @param type only return documents for the given type
     * @param offset the number of documents to skip before returning
     * @param limit the maximum number of documents to be returned
     * @returns {Promise<Document[]|string>} an array of documents | a key of M for an error desription
     */
    abstract all(type?:string, offset?:number,
                 limit?:number): Promise<Document[]|string>;

    /**
     * Updates <code>doc</code> so that it reflects
     * the current state of the doc in the database.
     *
     * @param doc
     * @returns {Promise<Document|string>} an array of documents | a key of M for an error desription
     */
    abstract refresh(doc: Document): Promise<Document|string>;

}
