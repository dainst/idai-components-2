import {Component, OnInit} from '@angular/core';
import {IdaiType} from '../../src/core/configuration/idai-type';
import {Datastore} from '../../src/core/datastore/datastore';
import {Document} from '../../src/core/model/document';
import {ProjectConfiguration} from '../../src/core/configuration/project-configuration';

@Component({
    selector: 'document-edit-demo',
    templateUrl: 'demo/app/document-edit-demo.html'
})
export class DocumentEditDemoComponent implements OnInit {

    public documents: Array<Document> = [];
    private selectedDocument: Document;

    public types: Array<IdaiType>;

    constructor(
        private projectConfiguration: ProjectConfiguration,
        private datastore: Datastore) {
    }

    ngOnInit() {

        this.types = this.projectConfiguration.getTypesTreeList();
        this.datastore.find({ q: '' }).then(result => this.documents = result.documents);
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