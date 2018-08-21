import {Component, OnInit} from '@angular/core';
import {FieldDefinition} from '../../src/ts/configuration/field-definition';
import {IdaiType} from '../../src/ts/configuration/idai-type';
import {Datastore} from '../../src/ts/datastore/datastore';
import {Document} from '../../src/ts/model/core/document';
import {ProjectConfiguration} from '../../src/ts/configuration/project-configuration';

@Component({
    selector: 'document-edit-demo',
    templateUrl: 'demo/app/document-view-demo.html'
})
export class DocumentViewDemoComponent implements OnInit {

    public documents: Array<Document> = [];
    private selectedDocument: Document|undefined;
    public fieldDefinitions: Array<FieldDefinition>;

    public types: IdaiType[];


    constructor(
        private projectConfiguration: ProjectConfiguration,
        private datastore: Datastore) {
    }


    ngOnInit() {

        this.types = this.projectConfiguration.getTypesTreeList();
        this.datastore.find({q:''}).then(result => this.documents = result.documents);
    }


    public clicked(id: string) {

        this.changeTo(id);
    }


    public deselect() {

        this.selectedDocument = undefined;
    }


    public showRelationTargetClickedMessage(relationTarget: Document) {

        alert('Relation-Target ausgewählt: ' + relationTarget.resource.identifier);
    }


    private changeTo(id: string) {

        this.datastore.get(id).then(document => {
            this.selectedDocument = JSON.parse(JSON.stringify(document));
            this.fieldDefinitions = this.projectConfiguration.getFieldDefinitions((this.selectedDocument as any).resource.type);
        });
    }
}