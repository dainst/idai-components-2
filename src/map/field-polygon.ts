import {FieldDocument} from '../model/field-document';

export interface FieldPolygon extends L.Polygon {

    document?: FieldDocument;
}