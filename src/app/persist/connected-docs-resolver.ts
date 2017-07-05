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

    /**
     * The method returns a set of the target documents which need an update.
     * The target documents will have set their relations accordingly.
     *
     * @param document
     * @param targetDocuments
     * @param setInverseRelations
     * @return {Array} the instances of targetDocuments which need an update
     */
    public determineDocsToUpdate(
        document: Document,
        targetDocuments: Document[],
        setInverseRelations: boolean) {

        const copyOfTargetDocuments = JSON.parse(JSON.stringify(targetDocuments));

        for (let targetDocument of targetDocuments) {
            this.pruneInverseRelations(document.resource.id, targetDocument);
            if (setInverseRelations) this.setInverseRelations(document, targetDocument);
        }

        return this.compare(targetDocuments,copyOfTargetDocuments);
    }

    private compare(targetDocuments,copyOfTargetDocuments) {
        const docsToUpdate = [];
        for (let i in targetDocuments) {
            let same = true;


            if (Object.keys(targetDocuments[i].resource.relations).sort().toString()
                == Object.keys(copyOfTargetDocuments[i].resource.relations).sort().toString()) {

                for (let relation in copyOfTargetDocuments[i].resource.relations) {
                    const orig = targetDocuments[i].resource.relations[relation].sort().toString();
                    const copy = copyOfTargetDocuments[i].resource.relations[relation].sort().toString();
                    if (orig != copy) { same = false; }
                }
            } else {
                same = false;
            }

            if (!same) docsToUpdate.push(targetDocuments[i]);
        }
        return docsToUpdate;
    }

    private pruneInverseRelations(resourceId: string, targetDocument: Document) {

        for (let relation in targetDocument.resource.relations) {
            if (!this.projectConfiguration.isRelationProperty(relation)) continue;

            if (this.removeRelation(resourceId,targetDocument.resource.relations,relation)) {
            }
        }
    }

    private removeRelation(resourceId,relations,relation) {
        const index = relations[relation].indexOf(resourceId);
        if (index == -1) return false;

        relations[relation].splice(index, 1);
        if (relations[relation].length == 0) delete relations[relation];
        return true;
    }

    private setInverseRelations(
        document: Document,
        targetDocument: Document) {

        for (let relation in document.resource.relations) {

            if (!this.projectConfiguration.isRelationProperty(relation)) continue;

            const inverse = this.projectConfiguration.getInverseRelations(relation);
            if (inverse == 'NO-INVERSE') continue;

            for (let id of document.resource.relations[relation]) {
                if (id != targetDocument.resource.id) continue;

                if (targetDocument.resource.relations[inverse] == undefined)
                    targetDocument.resource.relations[inverse] = [];

                const index = targetDocument.resource.relations[inverse].indexOf(document.resource.id);
                if (index != -1) {
                    targetDocument.resource.relations[inverse].splice(index, 1);
                }

                targetDocument.resource.relations[inverse].push(document.resource.id);
            }
        }
    }
}