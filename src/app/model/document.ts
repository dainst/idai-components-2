import {Resource} from './resource';
import {Action} from './action';
import {copy, subtractO} from 'tsfun';


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


    public static removeFields = <D extends Document>(fields: Array<string>) =>
        (document: D): D => {

            const result = copy(document);
            result.resource = subtractO(fields)(document.resource) as Resource;
            return result as D;
        };


    public static removeRelations = <D extends Document>(relations: Array<string>) =>
        (document: D): D => {

            const result = copy(document);
            result.resource.relations = subtractO(relations)(result.resource.relations);
            return result as D;
        };
}