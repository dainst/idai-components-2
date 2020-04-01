import {FeatureRelations} from './feature-relations';
import {FieldResource} from './field-resource';
import {Dating} from './dating';
import {ValOptionalEndVal} from './val-optional-end-val';


export interface FeatureResource extends FieldResource {

    relations: FeatureRelations;
    period: ValOptionalEndVal<string>|undefined;
    dating: Dating
}


export module FeatureResource {

    export const PERIOD = 'period';
}

