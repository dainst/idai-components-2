import {Document} from '../model/core/document';
import {Query} from './query';

/**
 * The interface providing read access methods 
 * for datastores supporting the idai-components-2 document model.
 * For full access see <code>Datastore</code>
 *
 * Implementations guarantee that any of the methods declared here
 * have no effect on any of the documents within the datastore.
 * 
 * @author Sebastian Cuy
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
export abstract class ReadDatastore {

    /**
     * @param resourceId the desired document's resource id
     * @param options to control implementation specific behaviour
     * @returns {Promise<Document>} a document (rejects with msgWithParams in case of error)
     * @throws [DOCUMENT_NOT_FOUND] - in case document is missing
     * @throws [INVALID_DOCUMENT] - in case document is not valid
     */ 
    abstract get(resourceId: string, options?: Object): Promise<Document>;


    /**
     * Perform a fulltext query
     
     * @param query the query object
     * @returns {Promise<Document[]>} an array of documents
     * @throws [GENERIC_ERROR (, cause: any)] - in case of error, optionally including a cause
     */
    abstract find(query: Query): Promise<FindResult>;
}


export interface FindResult {

    documents: Array<Document>;
    totalCount: number;
    queryId?: string;
}
