import {Component} from '@angular/core';
import {Messages} from '../../src/core/messages/messages';
import {ConfigLoader} from '../../src/core/configuration/config-loader';
import {OBJECTS} from './sample-objects';
import {Datastore} from '../../src/core/datastore/datastore';

@Component({
    selector: 'idai-components-demo-app',
    templateUrl: 'demo/app/app.html'
})
/**
 * @author Daniel de Oliveira
 */
export class AppComponent {

    constructor(
        private configLoader: ConfigLoader,
        private messages: Messages,
        private datastore: Datastore
    ) {
        for (let item of OBJECTS) {
            this.datastore.update(item);
        }
    }
}