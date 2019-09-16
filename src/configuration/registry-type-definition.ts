import {TypeDefinition} from "./type-definition";

/**
 * TypeDefinition, as used in TypeRegistry
 *
 * @author Daniel de Oliveira
 */
export interface RegistryTypeDefinition {

    color?: string,
    parent: string,
    derives?: string;
    description: {[language: string]: string},
    createdBy: string
    fields: any;
}

export type RegistryTypeDefinitions = {[typeName: string]: RegistryTypeDefinition };