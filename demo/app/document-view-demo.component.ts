import {Component, OnInit} from '@angular/core';
import {ConfigLoader} from '../../src/app/configuration/config-loader';
import {FieldDefinition} from '../../src/app/configuration/field-definition';
import {IdaiType} from '../../src/app/configuration/idai-type';
import {Datastore} from '../../src/app/datastore/datastore';
import {Document} from '../../src/app/model/document';

@Component({
    selector: 'document-edit-demo',
    templateUrl: 'demo/app/document-view-demo.html'
})
export class DocumentViewDemoComponent implements OnInit {

    private documents = new Array();
    private selectedDocument: Document;
    private fieldDefinitions: Array<FieldDefinition>;

    private types : IdaiType[];

    constructor(
        private configLoader: ConfigLoader,
        private datastore: Datastore) {
    }

    ngOnInit() {

        this.configLoader.getProjectConfiguration().then(projectConfiguration=>{
            this.types = projectConfiguration.getTypesTreeList();
        });

        this.datastore.find({q:''}).then(docs => {
            this.documents = docs as Document[];
        })
    }

    public clicked(id) {

        this.changeTo(id);
    }

    private changeTo(id) {

        this.configLoader.getProjectConfiguration().then(projectConfiguration => {
            this.datastore.get(id).then(document => {
                this.selectedDocument = JSON.parse(JSON.stringify(document));
                this.fieldDefinitions = projectConfiguration.getFieldDefinitions(this.selectedDocument.resource.type);
            });
        });
    }

    public startEdit(doc: Document) {

        alert("User wants to edit the document");
    }

    public deselect() {

        this.selectedDocument = undefined;
    }

    public showRelationTargetClickedMessage(relationTarget: Document) {

        alert('Relation-Target ausgewählt: ' + relationTarget.resource.identifier);
    }
}