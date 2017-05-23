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

    private documents: Array<IdaiFieldDocument> = [
        {
            "resource": {
                "id": "obj1",
                "identifier": "object1",
                "shortDescription": "Ressource 1",
                "relations": {},
                "geometry": {
                    "type": "Point",
                    "coordinates": [ 27.1892609283, 39.1411810096 ],
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
                    "coordinates": [[[27.189218354962215, 39.14132050335332], [27.189276375601313, 39.14133824217116],
                        [27.18928181180254, 39.14132438323931], [27.189226035114622, 39.141306298358316],
                        [27.189218354962215, 39.14132050335332]]],
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