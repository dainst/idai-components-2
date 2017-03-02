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
     * @param id the desired document's resource id
     * @returns {Promise<Document|string>} either a document or
     *   an error message, possibly a key of M
     */ 
    abstract get(id: string): Promise<Document|string>;

    /**
     * perform a fulltext query
     * @param query the query string
     *   <code>query</code> may be undefined,
     *   which is the same as using no <code>query.filterSet</code>
     * @param sets the names of the sets of documents
     *   the result should be restricted to
     * @param prefix determines that prefix matching should be performed
     *   instead of exactly matching the query string to full words
     * @param offset the number of documents to skip before returning
     * @param limit the maximum number of documents to be returned
     * @returns {Promise<Document[]|string>} an array of documents or
     *   an error message, possibly a key of M
     */
    abstract find(query: Query, offset?:number, limit?:number): Promise<Document[]|string>;

    /**
     * return all documents ordered by modification date (descending)
     * @param sets the names of the sets of documents
     *   the result should be restricted to
     * @param offset the number of documents to skip before returning
     * @param limit the maximum number of documents to be returned
     * @returns {Promise<Document[]|string>} an array of documents or
     *   an error message, possibly a key of M
     */
    abstract all(sets?:string[], offset?:number,
                 limit?:number): Promise<Document[]|string>;

    /**
     * Updates <code>doc</code> so that it reflects
     * the current state of the doc in the database.
     *
     * @param doc
     * @returns {Promise<Document|string>} an array of documents or
     *   an error message, possibly a key of M
     */
    abstract refresh(doc: Document): Promise<Document|string>;

}
