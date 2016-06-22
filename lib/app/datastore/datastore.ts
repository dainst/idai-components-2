import {Document} from "../core-services/document";
import {ReadDatastore} from "./read-datastore";

/**
 * The interface for datastores supporting 
 * the idai-components document model.
 * 
 * @author Sebastian Cuy
 * @author Daniel de Oliveira
 */ 
export abstract class Datastore extends ReadDatastore {

    abstract create(doc: Document): Promise<string>;

    /**
     * @param doc
     * @returns {Promise<T>} resolve -> (),
     *   reject -> the error message or a message key.
     */ 
    abstract update(doc: Document): Promise<any>;

    abstract remove(resourceId: string): Promise<any>;

    abstract clear(): Promise<any>;

    abstract refresh(resourceId:string):Promise<Document>;
}
