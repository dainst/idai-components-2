import {NewIdaiFieldImageResource} from "./new-idai-field-image-resource";
import {NewDocument} from '../../core/model/core/new-document';

/**
 * @author Daniel de Oliveira
 */
export interface NewIdaiFieldImageDocument extends NewDocument {

    id?: string;
    resource: NewIdaiFieldImageResource;
}