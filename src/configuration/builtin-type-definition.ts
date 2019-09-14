/**
 * TypeDefinition, as used in AppConfigurator
 *
 * @author Daniel de Oliveira
 */
export interface BuiltinTypeDefinition {

    fields: any;
}

export type BuiltinTypeDefinitions = {[typeName: string]: BuiltinTypeDefinition };