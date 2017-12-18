import {Component, OnInit} from '@angular/core';
import {Messages} from '../../src/app/messages/messages';
import {ConfigLoader} from '../../src/app/configuration/config-loader';
import {ConfigurationValidator} from '../../src/app/configuration/configuration-validator';
import {ConfigurationPreprocessor} from '../../src/app/configuration/configuration-preprocessor';
import {OBJECTS} from './sample-objects';
import {Datastore} from '../../src/app/datastore/datastore';

@Component({
    selector: 'idai-components-demo-app',
    templateUrl: 'demo/app/app.html'
})
/**
 * @author Daniel de Oliveira
 */
export class AppComponent implements OnInit {

    private static PROJECT_CONFIGURATION_PATH = 'demo/config/Configuration.json';

    constructor(
        private configLoader: ConfigLoader,
        private messages: Messages,
        private datastore: Datastore
    ) {

        this.configLoader.go(
            AppComponent.PROJECT_CONFIGURATION_PATH,
            new ConfigurationPreprocessor(
                [
                    { 'type': 'Image', 'fields': [ { 'name': 'dimensions' } ] }
                ],
                [
                    { 'name': 'shortDescription' },
                    { 'name': 'identifier' }
                ],
                [
                    { name: 'depicts', domain: ['Image:inherit'], inverse: 'isDepictedBy', visible: false,
                        editable: false},
                    { name: 'isDepictedBy', range: ['Image:inherit'], inverse: 'depicts', visible: false,
                        editable: false}
                ]
            ),
            new ConfigurationValidator([])
        );

        (configLoader.getProjectConfiguration() as any).catch(
            msgsWithParams => {
                msgsWithParams.forEach(msg => messages.add(msg));
            }
        )
    }

    ngOnInit() {
        this.loadSampleData();
    }

    loadSampleData(): void {
        for (let item of OBJECTS) {
            this.datastore.update(item);
        }
    }
}