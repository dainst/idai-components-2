import {FeatureRelations} from './feature-relations';
import {FieldResource} from './field-resource';


export interface FeatureResource extends FieldResource {

    relations: FeatureRelations;
    period: string|undefined;
}