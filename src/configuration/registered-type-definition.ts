/**
 * TypeDefinition, as used in TypeRegistry
 *
 * @author Daniel de Oliveira
 */
export interface RegisteredTypeDefinition {

    color?: string,
    parent: string,
    extends?: string;
    description: {[language: string]: string},
    createdBy: string
    fields: any;
}

export type RegisteredTypeDefinitions = {[typeName: string]: RegisteredTypeDefinition };
