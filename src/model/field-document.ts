import {Document} from './core/document';
import {FieldResource} from './field-resource';


export interface FieldDocument extends Document {

    resource: FieldResource;
    id?: string;
}