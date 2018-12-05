import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {Document} from '../../model/core/document';
import {Resource} from '../../model/core/resource';
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

    public relations: Array<any>;

    @Input() resource: Resource;
    @Input() hideRelations: Array<string> = [];
    @Output() onRelationTargetClicked: EventEmitter<Document> = new EventEmitter<Document>();


    constructor(private datastore: ReadDatastore, private projectConfiguration: ProjectConfiguration) {}


    async ngOnChanges() {
        
        this.relations = [];
        if (this.resource) await this.processRelations(this.resource);
    }


    public clickRelation(document: Document) {

        this.onRelationTargetClicked.emit(document);
    }


    private async processRelations(resource: Resource) {

        Object.keys(resource.relations)
            .filter(name => this.projectConfiguration.isVisibleRelation(name, this.resource.type))
            .filter(name => this.hideRelations.indexOf(name) === -1)
            .forEach(name =>
                this.addRel(resource, name, this.projectConfiguration.getRelationDefinitionLabel(name))
            );
    }


    private async addRel(resource: Resource, relationName: string, relLabel: string) {

        const relationGroup = {
            name: relLabel,
            targets: (await this.getTargetDocuments(resource.relations[relationName])) as any
        };

        if (relationGroup.targets.length > 0) this.relations.push(relationGroup);
    }


    private getTargetDocuments(targetIds: Array<string>): Promise<Array<Document>> {

        return this.datastore.getMultiple(targetIds);
    }
}