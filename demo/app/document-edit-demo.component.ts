import {Component, OnInit} from '@angular/core';
import {ConfigLoader} from '../../src/app/object-edit/config-loader'
import {Datastore} from '../../src/app/datastore/datastore'
import {OBJECTS} from "./sample-objects";
import {Document} from "../../src/app/core-services/document"
import {PersistenceManager} from "../../src/app/object-edit/persistence-manager";


import {IdaiType} from "../../src/app/core-services/idai-type";

@Component({
    selector: 'document-edit-demo',
    templateUrl: 'demo/templates/document-edit-demo.html'
})
export class DocumentEditDemoComponent implements OnInit {

    private static PROJECT_CONFIGURATION_PATH='demo/config/Configuration.json';

    private documents = new Array();
    private selectedDocument : Document;

    private types : IdaiType[]

    constructor(
        private configLoader:ConfigLoader,
        private datastore: Datastore,
        private persistenceManager: PersistenceManager) {
    }

    public clicked(id) {
        if (!this.selectedDocument) return this.changeTo(id);

        this.persistenceManager.persist(this.selectedDocument).then(
            ()=>{
                this.changeTo(id)
            },()=>{
                console.error("error while persisting object");
            });
    }

    private changeTo(id) {
        this.datastore.get(id).then((document)=> {
            this.selectedDocument = JSON.parse(JSON.stringify(document));
        });
    }

    ngOnInit() {
        this.loadSampleData();
        
        this.configLoader.setConfigurationPath(DocumentEditDemoComponent.PROJECT_CONFIGURATION_PATH);

        this.configLoader.configuration().subscribe((result)=>{
            if(result.error == undefined) {
                this.types = result.projectConfiguration.getTypesTreeList();
            }
        });
    }

    loadSampleData(): void {
        for (var item of OBJECTS) {
            this.documents.push(item);
            this.datastore.update(item);
        }
    }
}