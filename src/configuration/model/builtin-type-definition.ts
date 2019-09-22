/**
 * TypeDefinition, as used in AppConfigurator
 *
 * @author Daniel de Oliveira
 */
export interface BuiltinTypeDefinition {

    superType?: boolean,
    userDefinedSubtypesAllowed?: boolean,
    fields: any;
}

export type BuiltinTypeDefinitions = {[typeName: string]: BuiltinTypeDefinition };