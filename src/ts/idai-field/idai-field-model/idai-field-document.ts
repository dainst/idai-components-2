import {Document} from '../../core/model/document';
import {IdaiFieldResource} from './idai-field-resource';


export interface IdaiFieldDocument extends Document {

    resource: IdaiFieldResource;
    id?: string;
}