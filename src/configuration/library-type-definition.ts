import {assertFieldsAreValid} from "./util";

/**
 * TypeDefinition, as used in TypeRegistry
 *
 * @author Daniel de Oliveira
 */
export interface LibraryTypeDefinition {

    color?: string,


    parent?: string,
    typeFamily?: string;


    description: {[language: string]: string},
    createdBy: string,
    creationDate: string;
    fields: LibraryFieldDefinitions;
}

export type LibraryTypeDefinitions = {[typeName: string]: LibraryTypeDefinition };


export interface LibraryFieldDefinition {

    valuelistId?: string;
    inputType?: string;
    positionValues?: string;
}


export type LibraryFieldDefinitions = { [fieldName: string]: LibraryFieldDefinition };


export module LibraryTypeDefinition {
    
    export function assertIsValid(type: LibraryTypeDefinition) {

        if (!type.description) throw ['type has no description', JSON.stringify(type)];
        if (type.creationDate === undefined) throw ['type has no creationDate', JSON.stringify(type)];
        if (type.createdBy === undefined) throw ['type has no createdBy', JSON.stringify(type)];

        //if (type.extends && type.parent) throw ['extends and parent cannot be set at the same time'];
        //if (!type.extends && !type.parent) throw ['either extends or parent must be set'];

        if (!type.fields) throw ['type has not fields', type];
        assertFieldsAreValid(type.fields);
    }
}