import {Document} from '../../core/model/core/document';
import {IdaiFieldResource} from './idai-field-resource';


export interface IdaiFieldDocument extends Document {

    resource: IdaiFieldResource;
    id?: string;
}