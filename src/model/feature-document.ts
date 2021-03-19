import {FeatureResource} from './feature-resource';
import {FieldDocument} from './field-document';

/**
 * @author Daniel de Oliveira
 */
export interface FeatureDocument<T> extends FieldDocument {

    resource: FeatureResource<T>;
}
