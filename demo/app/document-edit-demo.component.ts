import {Component, OnInit} from '@angular/core';
import {ConfigLoader} from '../../src/app/configuration/config-loader';
import {IdaiType} from '../../src/app/configuration/idai-type';
import {Datastore} from '../../src/app/datastore/datastore';
import {Document} from "../../src/app/model/document";
import {PersistenceManager} from "../../src/app/persist/persistence-manager";

@Component({
    selector: 'document-edit-demo',
    templateUrl: 'demo/app/document-edit-demo.html'
})
export class DocumentEditDemoComponent implements OnInit {

    private documents = new Array();
    private selectedDocument : Document;

    private types : IdaiType[];

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
        this.configLoader.getProjectConfiguration().then(projectConfiguration=>{
            this.types = projectConfiguration.getTypesTreeList();
        });

        this.datastore.find('').then(docs => {
            this.documents = docs as Document[];
        })
    }
}