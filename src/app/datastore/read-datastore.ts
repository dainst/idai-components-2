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
     * @returns {Promise<Document|string>} either a document or an error message, possibly a key of M
     */ 
    abstract get(id: string): Promise<Document|string>;

    /**
     * @param query <code>query</code> or <code>query.q</code> may be undefined,
     *   which is the same as using <code>*</code>, <code>query.filterSets</code> may be undefined,
     *   which is the same as using no <code>query.filterSet</code>
     * @param fieldName the field name of the documents' resources over which the search should be performed.
     *   if the fieldName does not match any of the datastores documents' resources fields, or the datastore can not
     *   perform a search over <code>fieldName</code>, <code>find</code> will resolve to [].
     * @returns {Promise<Document[]|string>} an array of documents or an error message, possibly a key of M
     */ 
    abstract find(query: Query,fieldName?:string): Promise<Document[]|string>;

    /**
     * @param options
     * @returns {Promise<Document[]|string>} an array of documents or an error message, possibly a key of M
     */
    abstract all(options: any): Promise<Document[]|string>;

    /**
     * Updates <code>doc</code> so that it reflects the current state of the doc in the database.
     *
     * @param doc
     * @returns {Promise<Document|string>} an array of documents or an error message, possibly a key of M
     */
    abstract refresh(doc: Document): Promise<Document|string>;

}
