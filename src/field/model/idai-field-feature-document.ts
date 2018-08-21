import {IdaiFieldFeatureResource} from './idai-field-feature-resource';
import {IdaiFieldDocument} from './idai-field-document';

/**
 * @author Daniel de Oliveira
 */
export interface IdaiFieldFeatureDocument extends IdaiFieldDocument {

    resource: IdaiFieldFeatureResource;
}