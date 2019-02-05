import {Resource} from './core/resource';
import {FieldGeometry} from './field-geometry';
import {FieldRelations} from './field-relations';


export interface FieldResource extends Resource {

    identifier: string;
    shortDescription: string;
    geometry?: FieldGeometry;
    relations: FieldRelations;
}