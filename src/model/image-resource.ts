import {ImageRelations} from './image-relations';
import {ImageResourceBase} from './image-resource-base';
import {Resource} from './core/resource';


export interface ImageResource extends Resource, ImageResourceBase {

    relations: ImageRelations;
}