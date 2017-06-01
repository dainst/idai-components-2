import {Component} from '@angular/core';
import {IdaiFieldDocument} from '../../src/app/idai-field-model/idai-field-document';

@Component({
    selector: 'idai-field-map-demo',
    templateUrl: 'demo/app/map-demo.html'
})

/**
 * @author Thomas Kleinke
 */
export class MapDemoComponent {

    public documents: Array<IdaiFieldDocument> = [
        {
            "resource": {
                "id": "obj1",
                "identifier": "object1",
                "shortDescription": "Ressource 1",
                "relations": {},
                "geometry": {
                    "type": "Point",
                    "coordinates": [ 1.5, 2.5 ],
                    "crs": "local"
                },
                "type": "object"
            },
            "synced": 0
        },
        {
            "resource": {
                "id": "obj2",
                "identifier": "object2",
                "shortDescription": "Ressource 2",
                "relations": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[3.0, 3.0], [4.0, 3.0], [4.5, 3.5], [4.5, 4.0], [3.5, 4.0], [3.0, 3.0]]],
                    "crs": "local"
                },
                "type": "object"
            },
            "synced": 0
        },
        {
            "resource": {
                "id": "obj3",
                "identifier": "object3",
                "shortDescription": "Ressource 3",
                "relations": {},
                "geometry": {
                    "type": "MultiPolygon",
                    "coordinates": [[[[-3.0, 3.0], [-5.0, 2.5], [-4.5, 3.0], [-4.25, 3.75], [-3.5, 4.0], [-3.0, 3.0]]],
                        [[[-3.25, 4.0], [-3.25, 4.5], [-3.5, 5.0], [-3.75, 4.0], [-3.5, 4.25], [-3.25, 4.0]]]],
                    "crs": "local"
                },
                "type": "object"
            },
            "synced": 0
        }
    ];

    private selectedDocument: IdaiFieldDocument;

    public select(document: IdaiFieldDocument) {

        this.selectedDocument = document;
    }
}