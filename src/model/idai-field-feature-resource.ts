import {IdaiFieldFeatureRelations} from './idai-field-feature-relations';
import {IdaiFieldResource} from './idai-field-resource';


export interface IdaiFieldFeatureResource extends IdaiFieldResource {

    relations: IdaiFieldFeatureRelations;
    period: string|undefined;
}