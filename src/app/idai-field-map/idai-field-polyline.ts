import {IdaiFieldDocument} from '../idai-field-model/idai-field-document';

export interface IdaiFieldPolyline extends L.Polyline {

    document?: IdaiFieldDocument;
}