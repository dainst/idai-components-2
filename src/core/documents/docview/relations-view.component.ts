import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {Document} from '../../model/document';
import {Resource} from '../../model/resource';
import {ReadDatastore} from '../../datastore/read-datastore';
import {ProjectConfiguration} from '../../configuration/project-configuration';


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
 * @author Daniel de Oliveira
 */
export class RelationsViewComponent implements OnChanges {

    protected relations: Array<any>;

    @Input() resource: Resource;
    @Input() hideRelations: Array<string> = [];
    @Output() onRelationTargetClicked: EventEmitter<Document> = new EventEmitter<Document>();

    public collapsed: boolean = false;


    constructor(private datastore: ReadDatastore, private projectConfiguration: ProjectConfiguration) {}


    ngOnChanges() {
        
        this.relations = [];
        if (this.resource) this.processRels(this.resource);
    }


    public clickRelation(document: Document) {

        this.onRelationTargetClicked.emit(document);
    }


    private async processRels(resource: Resource) {

        Object.keys(resource.relations)
            .filter(name => this.projectConfiguration.isVisibleRelation(name, this.resource.type))
            .filter(name => this.hideRelations.indexOf(name) === -1)
            .forEach(name =>
                this.addRel(resource, name, this.projectConfiguration.getRelationDefinitionLabel(name)));
    }


    private async addRel(resource: Resource, relationName: string, relLabel: string) {

        const relationGroup = {
            name: relLabel,
            targets: (await this.getTargetDocuments(resource.relations[relationName])) as any
        };

        if (relationGroup.targets.length > 0) this.relations.push(relationGroup);
    }


    private getTargetDocuments(targetIds: Array<string>): Promise<Array<Document>> {

        const promises = [] as any;
        const targetDocuments = [] as any;

        for (let i in targetIds) {
            let targetId = targetIds[i];
            promises.push(this.datastore.get(targetId).then(
                targetDocument => {
                    targetDocuments.push(targetDocument as never);
                },
                err => console.error('Relation target not found', err)
            ) as never);
        }

        return Promise.all(promises).then(
            () => Promise.resolve(targetDocuments)
        );
    }
}