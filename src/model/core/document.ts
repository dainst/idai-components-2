import {Resource} from './resource';
import {to} from 'tsfun';
import {NewDocument} from './new-document';
import {Action} from './action';
import {subtractObj} from '../../util/utils';


export type RevisionId = string;
export type DocumentId = string;

export interface Document extends NewDocument {

    _id: DocumentId;
    _rev?: RevisionId; // we could take out the ? later, too
    _conflicts?: Array<RevisionId>;
    resource : Resource;
    modified: Array<Action>;
    created: Action;
}


export const toResourceId = (doc: Document): Resource.Id => to('resource.id')(doc);


/**
 * Companion module
 */
export module Document {

    export const RESOURCE = 'resource';
    export const _REV = '_rev';

    export function getLastModified(document: Document): Action {

        return (document.modified && document.modified.length > 0)
            ? document.modified[document.modified.length - 1]
            : document.created as Action;
    }


    export function isValid(document: Document|NewDocument, newDocument = false): boolean {

        if (!document.resource) return false;
        if (!document.resource.id && !newDocument) return false;
        if (!document.resource.relations) return false;
        if (!newDocument && !(document as Document).created) return false;
        if (!newDocument && !(document as Document).modified) return false;

        return true;
    }


    export function removeFields<D extends Document>(fields: Array<string>) {

        return (document: D): D => {

            const result = {...document};
            result.resource = subtractObj(fields)(document.resource) as Resource;
            return result as D;
        };
    }


    export function removeRelations<D extends Document>(relations: Array<string>) {

        return (document: D): D => {

            const result = {...document};
            result.resource = {...document.resource};
            result.resource.relations = subtractObj(relations)(result.resource.relations);
            return result as D;
        };
    }


    export function hasRelationTarget(document: Document, relationName: string, targetId: string): boolean {

        return Resource.hasRelationTarget(document.resource, relationName, targetId);
    }


    export function hasRelations(document: Document, relationName: string): boolean {

        return Resource.hasRelations(document.resource, relationName);
    }
}