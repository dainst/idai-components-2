/**
 * @author Daniel de Oliveira
 */
import {IdaiFieldRelations} from './idai-field-relations';

export interface IdaiFieldFeatureRelations extends IdaiFieldRelations {

    isContemporaryWith: string[];
    isAfter: string[];
    isBefore: string[];
}