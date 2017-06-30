import {Injectable} from "@angular/core";
import {Document} from "../model/document";
import {Resource} from "../model/resource";
import {ProjectConfiguration} from "../configuration/project-configuration";

@Injectable()
/**
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
export class ConnectedDocsResolver {

    constructor(
        private projectConfiguration: ProjectConfiguration
    ) {

    }

    public determineDocsToUpdate(resource: Resource, targetDocuments: Document[], setInverseRelations: boolean) {

        const docsToUpdate = [];
        for (let targetDocument of targetDocuments) {
            this.pruneInverseRelations(resource.id, targetDocument);
            if (setInverseRelations) this.setInverseRelations(resource, targetDocument);

            if (targetDocument['dirty'] == true) {
                delete targetDocument['dirty'];
                docsToUpdate.push(targetDocument);
            }
        }
        return docsToUpdate;
    }

    private pruneInverseRelations(resourceId: string, targetDocument: Document) {

        for (let relation in targetDocument.resource.relations) {
            if (!this.projectConfiguration.isRelationProperty(relation)) continue;

            let index = targetDocument.resource.relations[relation].indexOf(resourceId);
            if (index != -1) {
                targetDocument['dirty'] = true;

                targetDocument.resource.relations[relation].splice(index, 1);
                if (targetDocument.resource.relations[relation].length == 0)
                    delete targetDocument.resource.relations[relation];
            }

        }
    }

    private setInverseRelations(resource: Resource, targetDocument: Document) {

        for (let relation in resource.relations) {

            if (!this.projectConfiguration.isRelationProperty(relation)) continue;

            const inverse = this.projectConfiguration.getInverseRelations(relation);
            if (inverse == 'NO-INVERSE') continue;

            for (let id of resource.relations[relation]) {
                if (id != targetDocument.resource.id) continue;

                targetDocument['dirty'] = true;

                if (targetDocument.resource.relations[inverse] == undefined)
                    targetDocument.resource.relations[inverse] = [];

                const index = targetDocument.resource.relations[inverse].indexOf(resource.id);
                if (index != -1) {
                    targetDocument.resource.relations[inverse].splice(index, 1);
                }

                targetDocument.resource.relations[inverse].push(resource.id);
            }
        }
    }
}