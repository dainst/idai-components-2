import {IdaiFieldDocument} from '../model/idai-field-document';

export interface IdaiFieldPolyline extends L.Polyline {

    document?: IdaiFieldDocument;
}