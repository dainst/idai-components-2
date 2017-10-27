import {IdaiFieldDocument} from '../idai-field-model/idai-field-document';

export interface IdaiFieldPolygon extends L.Polygon {

    document?: IdaiFieldDocument;
}