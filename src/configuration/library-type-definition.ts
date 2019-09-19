import {assertFieldsAreValid} from "./util";
import {BuiltinTypeDefinitions} from "./builtin-type-definition";

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

    export function makeAssertIsValid(builtinTypes: string[]) {

        return function assertIsValid([typeName, type]: [string, LibraryTypeDefinition]) {

            if (!type.description) throw ['type has no description', typeName];
            if (type.creationDate === undefined) throw ['type has no creationDate', typeName];
            if (type.createdBy === undefined) throw ['type has no createdBy', typeName];

            if (!type.typeFamily) {
                if (!type.parent) throw ['parent not set']; // TODO test and make proper error, make uuid part of err msg
            } else {
                if (!builtinTypes.includes(type.typeFamily) && !type.parent) throw ['parent not set', typeName];
            }

            if (!type.fields) throw ['type has not fields', typeName];
            assertFieldsAreValid(type.fields);
        }
    }
}