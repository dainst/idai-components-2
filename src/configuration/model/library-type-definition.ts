import {assertFieldsAreValid} from "../util";
import {ConfigurationErrors} from "../configuration-errors";
import {BaseFieldDefinition, BaseTypeDefinition} from "./base-type-definition";


/**
 * TypeDefinition, as used in TypeLibrary
 *
 * @author Daniel de Oliveira
 */
export interface LibraryTypeDefinition extends BaseTypeDefinition {

    color?: string,
    commons?: string[]; // TODO make mandatory
    parent?: string,
    typeFamily: string;
    description: {[language: string]: string},
    createdBy: string,
    creationDate: string;
    fields: LibraryFieldDefinitions;
}

export type LibraryTypeDefinitions = {[typeName: string]: LibraryTypeDefinition };


export interface LibraryFieldDefinition extends BaseFieldDefinition {

    valuelistId?: string;
    inputType?: string;
    positionValues?: string;
}


export type LibraryFieldDefinitions = { [fieldName: string]: LibraryFieldDefinition };


export module LibraryTypeDefinition {

    export function makeAssertIsValid(builtinTypes: string[]) {

        return function assertIsValid([typeName, type]: [string, LibraryTypeDefinition]) {

            if (!type.description) throw [ConfigurationErrors.MISSING_TYPE_PROPERTY, 'description', typeName];
            if (type.creationDate === undefined) throw [ConfigurationErrors.MISSING_TYPE_PROPERTY, 'creationDate', typeName];
            if (type.createdBy === undefined) throw [ConfigurationErrors.MISSING_TYPE_PROPERTY, 'createdBy', typeName];
            if (type.typeFamily === undefined) throw [ConfigurationErrors.MISSING_TYPE_PROPERTY, 'typeFamily', typeName];

            if (!builtinTypes.includes(type.typeFamily) && !type.parent) throw [ConfigurationErrors.MISSING_TYPE_PROPERTY, 'parent', typeName];

            if (!type.fields) throw [ConfigurationErrors.MISSING_TYPE_PROPERTY, 'creationDate', typeName];
            assertFieldsAreValid(type.fields);
        }
    }
}