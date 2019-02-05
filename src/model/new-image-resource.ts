import {ImageRelations} from './image-relations';
import {ImageResourceBase} from './image-resource-base';
import {NewResource} from './core/new-resource';

export interface NewImageResource extends NewResource, ImageResourceBase {

    relations: ImageRelations;
}