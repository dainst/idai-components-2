import {TypeDefinition} from './type-definition';
import {RelationDefinition} from './relation-definition';
import {ViewDefinition} from '../../idai-field/idai-field-model/view-definition';

/**
 * @author Daniel de Oliveira
 */
export interface ConfigurationDefinition {
    identifier: string
    types: Array<TypeDefinition>;
    relations?: Array<RelationDefinition>;
    views?: Array<ViewDefinition>;
}