import {Resource} from './resource'
import {Action} from './action'

export interface Document {
    resource : Resource;
    modified?: Action[];
    created?: Action;
}


/**
 * Companion object
 */
export class Document {

    public static isValid(document: Document, missingIdLegal = false): boolean {

        if (!document.resource) return false;
        if (!document.resource.id && !missingIdLegal) return false;
        if (!document.resource.relations) return false;
        if (!document.created) return false;

        return true;
    }
}