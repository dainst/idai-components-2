import {NewImageResource} from './new-image-resource';
import {NewDocument} from './core/new-document';

/**
 * @author Daniel de Oliveira
 */
export interface NewImageDocument extends NewDocument {

    id?: string;
    resource: NewImageResource;
}