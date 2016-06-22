import {Component, OnInit, Inject} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {DocumentEditComponent} from '../../src/app/object-edit/document-edit.component';
import {ConfigLoader} from '../../src/app/object-edit/config-loader'
import {Datastore} from '../../src/app/datastore/datastore'
import {OBJECTS} from "./sample-objects";
import {Document} from "../../src/app/core-services/document"

@Component({
    selector: 'object-edit-demo',

    templateUrl: 'demo/templates/object-edit-demo.html',

    directives: [ ROUTER_DIRECTIVES, DocumentEditComponent ]
})
export class ObjectEditDemoComponent implements OnInit {

    private static PROJECT_CONFIGURATION_PATH='demo/config/Configuration.json';
    private static RELATIONS_CONFIGURATION_PATH='demo/config/Relations.json';
    
    private documents = new Array();
    private selectedDocument : Document;

    constructor(
        private configLoader:ConfigLoader,
        private datastore: Datastore) {
    }

    public clicked(id) {
        this.datastore.get(id).then((document)=> {
            console.log("doc ",document)
            this.selectedDocument = JSON.parse(JSON.stringify(document));
        });
    }

    ngOnInit() {
        this.loadSampleData();
        this.configLoader.setProjectConfiguration(ObjectEditDemoComponent.PROJECT_CONFIGURATION_PATH);
        this.configLoader.setRelationsConfiguration(ObjectEditDemoComponent.RELATIONS_CONFIGURATION_PATH);
    }

    loadSampleData(): void {
        for (var item of OBJECTS) {
            this.documents.push(item);
            this.datastore.update(item);
        }
    }
}