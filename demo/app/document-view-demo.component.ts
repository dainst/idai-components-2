import {Component, OnInit} from '@angular/core';
import {ConfigLoader} from '../../src/ts/core/configuration/config-loader';
import {FieldDefinition} from '../../src/ts/core/configuration/field-definition';
import {IdaiType} from '../../src/ts/core/configuration/idai-type';
import {Datastore} from '../../src/ts/core/datastore/datastore';
import {Document} from '../../src/ts/core/model/document';

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

    public deselect() {

        this.selectedDocument = undefined;
    }

    public showRelationTargetClickedMessage(relationTarget: Document) {

        alert('Relation-Target ausgewählt: ' + relationTarget.resource.identifier);
    }
}