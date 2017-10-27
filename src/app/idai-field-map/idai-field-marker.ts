import {IdaiFieldDocument} from '../idai-field-model/idai-field-document';

export interface IdaiFieldMarker extends L.Marker {

    document?: IdaiFieldDocument;
}