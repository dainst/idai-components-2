import {TypeDefinition} from './type-definition';
import {RelationDefinition} from './relation-definition';

/**
 * @author Daniel de Oliveira
 */
export interface ConfigurationDefinition {
    identifier: string
    types: Array<TypeDefinition>;
    relations: Array<RelationDefinition>;
}