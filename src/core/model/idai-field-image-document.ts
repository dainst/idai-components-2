import {Document} from './core/document';
import {IdaiFieldImageResource} from './idai-field-image-resource';

/**
 * @author Daniel de Oliveira
 */
export interface IdaiFieldImageDocument extends Document {

    id?: string;
    resource: IdaiFieldImageResource;
}