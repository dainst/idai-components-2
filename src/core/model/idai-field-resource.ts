import {Resource} from './core/resource';
import {IdaiFieldGeometry} from './idai-field-geometry';
import {IdaiFieldRelations} from './idai-field-relations';


export interface IdaiFieldResource extends Resource {

    identifier: string;
    shortDescription: string;
    geometry?: IdaiFieldGeometry;
    relations: IdaiFieldRelations;
}