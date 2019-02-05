import {Document} from './core/document';
import {ImageResource} from './image-resource';

/**
 * @author Daniel de Oliveira
 */
export interface ImageDocument extends Document {

    id?: string;
    resource: ImageResource;
}