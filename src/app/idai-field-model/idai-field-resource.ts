import {Resource} from '../model/resource';
import {IdaiFieldGeometry} from './idai-field-geometry';

export interface IdaiFieldResource extends Resource {

    identifier: string;
    shortDescription: string;
    geometry?: IdaiFieldGeometry;
}