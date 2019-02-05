import {FieldDocument} from '../model/field-document';

export interface FieldMarker extends L.Marker {

    document?: FieldDocument;
}