import {Component, OnInit} from '@angular/core';
import {ConfigLoader} from '../../src/ts/core/configuration/config-loader';
import {IdaiType} from '../../src/ts/core/configuration/idai-type';
import {Datastore} from '../../src/ts/core/datastore/datastore';
import {Document} from '../../src/ts/core/model/document';
import {PersistenceManager} from '../../src/ts/core/persist/persistence-manager';

@Component({
    selector: 'document-edit-demo',
    templateUrl: 'demo/app/document-edit-demo.html'
})
export class DocumentEditDemoComponent implements OnInit {

    private documents = new Array();
    private selectedDocument: Document;

    private types: IdaiType[];

    constructor(
        private configLoader: ConfigLoader,
        private datastore: Datastore,
        private persistenceManager: PersistenceManager) {
    }

    public clicked(id) {
        if (!this.selectedDocument) return this.changeTo(id);

        this.persistenceManager.persist(this.selectedDocument).then(
            () => {
                this.changeTo(id);
            }, msgWithParams => {
                console.error('error while persisting object', msgWithParams);
                this.changeTo(id);
            });
    }

    private changeTo(id) {
        this.datastore.get(id).then((document) => {
            this.selectedDocument = JSON.parse(JSON.stringify(document));
        });
    }

    ngOnInit() {
        this.configLoader.getProjectConfiguration().then(projectConfiguration => {
            this.types = projectConfiguration.getTypesTreeList();
        });

        this.datastore.find({q: ''}).then(docs => {
            this.documents = docs as Document[];
        });
    }
}