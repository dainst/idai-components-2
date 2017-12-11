import {Component, OnInit} from '@angular/core';
import {ConfigLoader} from '../../src/app/configuration/config-loader';
import {IdaiType} from '../../src/app/configuration/idai-type';
import {Datastore} from '../../src/app/datastore/datastore';
import {Document} from '../../src/app/model/document';

@Component({
    selector: 'document-edit-demo',
    templateUrl: 'demo/app/document-edit-demo.html'
})
export class DocumentEditDemoComponent implements OnInit {

    private documents: Array<Document> = [];
    private selectedDocument: Document;

    private types: Array<IdaiType>;


    constructor(
        private configLoader: ConfigLoader,
        private datastore: Datastore) {
    }


    ngOnInit() {

        (this.configLoader.getProjectConfiguration() as any).then(projectConfiguration => {
            this.types = projectConfiguration.getTypesTreeList();
        });

        this.datastore.find({ q: '' }).then(result => {
            this.documents = result.documents;
        });
    }


    public clicked(id: string) {

        this.changeTo(id);
    }


    private changeTo(id: string) {

        this.datastore.get(id).then(document => {
            this.selectedDocument = JSON.parse(JSON.stringify(document));
        });
    }
}