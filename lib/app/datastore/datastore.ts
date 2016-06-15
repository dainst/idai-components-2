import {Document} from "../core-services/document";
import {ReadDatastore} from "./read-datastore";

export abstract class Datastore extends ReadDatastore {

    abstract create(doc: Document): Promise<string>;

    abstract update(object: Document): Promise<any>;

    abstract remove(id: string): Promise<any>;

    abstract clear(): Promise<any>;

    abstract refresh(id:string):Promise<Document>;
}