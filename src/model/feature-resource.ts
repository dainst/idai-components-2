import {FeatureRelations} from './feature-relations';
import {FieldResource} from './field-resource';
import {Dating} from './dating';


export interface FeatureResource extends FieldResource {

    relations: FeatureRelations;
    period: string|undefined;
    dating: Dating
}