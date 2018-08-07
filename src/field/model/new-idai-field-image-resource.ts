import {IdaiFieldImageRelations} from './idai-field-image-relations';
import {IdaiFieldImageResourceBase} from "./idai-field-image-resource-base";
import {NewResource} from '../../core/model/new-resource';

export interface NewIdaiFieldImageResource
    extends NewResource, IdaiFieldImageResourceBase {

    relations: IdaiFieldImageRelations;
}