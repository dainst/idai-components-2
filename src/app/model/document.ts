import {Resource} from './resource';
import {Action} from './action';
import {subtractO} from 'tsfun';


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


    public static removeFields<D extends Document>(document: D, fields: Array<string>): D {

        const result = subtractO([])(document) as D; // TODO implement shallow copy method
        result.resource = subtractO(fields)(document.resource) as Resource;
        return result;
    }


    public static removeRelations<D extends Document>(document: D, relations: Array<string>): D {

        const result = subtractO([])(document) as D; // TODO implement shallow copy method
        result.resource.relations = subtractO(relations)(result.resource.relations);
        return result;
    }
}