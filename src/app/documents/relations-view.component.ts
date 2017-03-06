import {Component, OnChanges, Input, EventEmitter, Output} from "@angular/core";
import {Resource} from "../model/resource";
import {ReadDatastore} from "../datastore/read-datastore";
import {ConfigLoader} from "../configuration/config-loader";

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

    isCollapsed: boolean = false;

    @Input() doc;
    @Output() relationClicked = new EventEmitter();

    constructor(
        private datastore: ReadDatastore,
        private configLoader: ConfigLoader
    ) {
    }

    ngOnChanges() {
        this.relations = [];
        if (!this.doc) return;
        this.processRelations(this.doc.resource);
    }

    private clickRelation(doc) {
        this.relationClicked.emit(doc);
    }

    private processRelations(resource: Resource) {

        this.configLoader.getProjectConfiguration().then(projectConfiguration=>{

            for (let relationName in resource.relations) {
                if (resource.relations.hasOwnProperty(relationName)) {
                    if (!projectConfiguration.isVisibleRelation(relationName)) continue;

                    let relationTargets = resource.relations[relationName];

                    let relation = {
                        name: projectConfiguration.getRelationDefinitionLabel(relationName),
                        targets: []
                    };
                    this.relations.push(relation);

                    this.processRelation(relation, relationTargets);
                }
            }
        });

    }

    private processRelation(relation: any, targets: Array<string>) {

        for (let i in targets) {
            let targetId = targets[i];
            this.datastore.get(targetId).then(
                targetDocument => {
                    relation.targets.push(targetDocument);
                },
                err => { console.error(err); }
            )
        }
    }


}