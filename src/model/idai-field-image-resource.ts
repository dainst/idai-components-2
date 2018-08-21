import {IdaiFieldImageRelations} from './idai-field-image-relations';
import {IdaiFieldImageResourceBase} from "./idai-field-image-resource-base";
import {Resource} from './core/resource';


export interface IdaiFieldImageResource
    extends Resource, IdaiFieldImageResourceBase {

    relations: IdaiFieldImageRelations;
}