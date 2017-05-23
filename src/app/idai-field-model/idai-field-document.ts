import {Document} from '../model/document';
import {IdaiFieldResource} from './idai-field-resource';

export interface IdaiFieldDocument extends Document {

    synced: number;
    resource: IdaiFieldResource;
    id?: string;
}