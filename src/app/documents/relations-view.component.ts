import {Component, OnChanges, Input, EventEmitter, Output} from '@angular/core';
import {Document} from '../model/document';
import {Resource} from '../model/resource';
import {ReadDatastore} from '../datastore/read-datastore';
import {ConfigLoader} from '../configuration/config-loader';

@Component({
    selector: 'relations-view',
    moduleId: module.id,
    templateUrl: './relations-view.html'
})

/**
 * Shows relations and fields of a document.
 *
 * @author Thomas Kleinke
 * @author Sebastian Cuy
 */
export class RelationsViewComponent implements OnChanges {

    protected relations: Array<any>;

    @Input() resource: Resource;
    @Output() onRelationTargetClicked: EventEmitter<Document> = new EventEmitter<Document>();

    public collapsed: boolean;

    constructor(
        private datastore: ReadDatastore,
        private configLoader: ConfigLoader
    ) {
        this.collapsed = false;
    }

    ngOnChanges() {
        
        this.relations = [];
        if (this.resource) this.processRelations(this.resource);
    }

    public clickRelation(document: Document) {

        this.onRelationTargetClicked.emit(document);
    }

    private processRelations(resource: Resource) {

        this.configLoader.getProjectConfiguration().then(projectConfiguration=>{

            for (let relationName in resource.relations) {
                if (resource.relations.hasOwnProperty(relationName)) {
                    if (!projectConfiguration.isVisibleRelation(relationName, this.resource.type)) continue;

                    let targetIds = resource.relations[relationName];

                    let relationGroup = {
                        name: projectConfiguration.getRelationDefinitionLabel(relationName),
                        targets: []
                    };

                    this.getTargetDocuments(targetIds).then(
                        targets => {
                            relationGroup.targets = targets;
                            if (relationGroup.targets.length > 0) this.relations.push(relationGroup);
                        }
                    );
                }
            }
        });

    }

    private getTargetDocuments(targetIds: Array<string>): Promise<Array<Document>> {

        const promises = [];
        const targetDocuments = [];

        for (let i in targetIds) {
            let targetId = targetIds[i];
            promises.push(this.datastore.get(targetId).then(
                targetDocument => {
                    targetDocuments.push(targetDocument);
                },
                err => console.error('Relation target not found', err)
            ));
        }

        return Promise.all(promises).then(
            () => Promise.resolve(targetDocuments)
        );
    }
}