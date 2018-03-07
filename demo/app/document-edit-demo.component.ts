import {Component, OnInit} from '@angular/core';
import {ConfigLoader} from '../../src/core/configuration/config-loader';
import {IdaiType} from '../../src/core/configuration/idai-type';
import {Datastore} from '../../src/core/datastore/datastore';
import {Document} from '../../src/core/model/document';

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