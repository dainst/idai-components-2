import {Component, OnInit, OnChanges, Input, EventEmitter, Output} from "@angular/core";
import {Resource} from "../model/resource";
import {ReadDatastore} from "../datastore/read-datastore";
import {ConfigLoader} from "../configuration/config-loader";
import {WithConfiguration} from "../configuration/with-configuration";

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
export class RelationsViewComponent extends WithConfiguration implements OnInit, OnChanges {

    protected relations: Array<any>;

    @Input() doc;
    @Output() relationClicked = new EventEmitter();

    constructor(
        private datastore: ReadDatastore,
        configLoader: ConfigLoader
    ) {
        super(configLoader);
    }

    private init() {
        this.relations = [];
        if (!this.doc) return;
        this.initializeRelations(this.doc.resource);
    }

    ngOnInit() {
        this.init();
    }

    ngOnChanges() {
        this.init();
    }

    private clickRelation(doc) {
        this.relationClicked.emit(doc);
    }

    private initializeRelations(resource: Resource) {

        for (var relationName in resource.relations) {
            if (resource.relations.hasOwnProperty(relationName)) {
                if (!this.projectConfiguration.isVisibleRelation(relationName)) continue;

                var relationTargets = resource.relations[relationName];

                var relation = {
                    name: this.projectConfiguration.getRelationDefinitionLabel(relationName),
                    targets: []
                };
                this.relations.push(relation);

                this.initializeRelation(relation, relationTargets);
            }
        }
    }

    private initializeRelation(relation: any, targets: Array<string>) {

        for (var i in targets) {
            var targetId = targets[i];
            this.datastore.get(targetId).then(
                targetDocument => {
                    relation.targets.push(targetDocument);
                },
                err => { console.error(err); }
            )
        }
    }


}