import {Resource} from './resource';
import {copy} from 'tsfun';
import {subtract} from 'tsfun/objects';
import {NewDocument} from "./new-document";
import {Action} from './action';


export interface Document extends NewDocument {

    resource : Resource;
    modified: Action[];
    created: Action;
}


/**
 * Companion module
 */
export module Document {


    export function getLastModified(document: Document): Action {

        return (document.modified && document.modified.length > 0)
            ? document.modified[document.modified.length - 1]
            : document.created as Action;
    }


    export function isValid(document: Document, missingIdLegal = false): boolean {

        if (!document.resource) return false;
        if (!document.resource.id && !missingIdLegal) return false;
        if (!document.resource.relations) return false;
        if (!document.created) return false;
        if (!document.modified || document.modified.length === 0) return false;

        return true;
    }


    export function removeFields<D extends Document>(fields: Array<string>) {
        return (document: D): D => {

            const result = copy(document);
            result.resource = subtract(fields)(document.resource) as Resource;
            return result as D;
        };
    }


    export function removeRelations<D extends Document>(relations: Array<string>) {
        return (document: D): D => {

            const result = copy(document);
            result.resource.relations = subtract(relations)(result.resource.relations);
            return result as D;
        };
    }
}