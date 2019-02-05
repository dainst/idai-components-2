import {FieldDocument} from '../model/field-document';

export interface FieldPolyline extends L.Polyline {

    document?: FieldDocument;
}