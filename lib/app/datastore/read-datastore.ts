import {Document} from "../core-services/document";
import {Observable} from "rxjs/Observable";

/**
 * This interface provides read access methods to a datastore
 * maintaining Documents.
 *
 * Implementations guarantee that any of methods declared here
 * have no effect on any of the documents within the datastore.
 */
export abstract class ReadDatastore  {

    abstract get(id: string): Promise<Document>;

    abstract find(query: string, options: any): Promise<Document[]>;

    abstract all(options: any): Promise<Document[]>;

    abstract getUnsyncedObjects(): Observable<Document>;
}