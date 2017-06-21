import {Injectable} from "@angular/core";
import {Datastore} from "../datastore/datastore";
import {Document} from "../model/document";
import {Resource} from "../model/resource";
import {ProjectConfiguration} from "../configuration/project-configuration";
import {ConfigLoader} from "../configuration/config-loader";
import {MDInternal} from "../messages/md-internal";

@Injectable()
/**
 * With a document to persist, it determines which other documents are 
 * affected by being related to the document in its current or previous state.
 * When persisting, it maintains a consistent state of relations between the objects
 * by also persisting the related documents with updated target relations.
 *
 * Also adds created and modified actions to persisted documents.
 * 
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
export class PersistenceManager {
    
    private oldVersions: Array<Document> = [];
    private projectConfiguration: ProjectConfiguration = undefined;
    private ready: Promise<any>;

    constructor(
        private datastore: Datastore,
        private configLoader: ConfigLoader
    ) {
        this.ready = new Promise<string>((resolve) => {
            this.configLoader.getProjectConfiguration().then(projectConfiguration => {
                this.projectConfiguration = projectConfiguration;
                resolve();
            })
        });
    }

    /**
     * Package private.
     * 
     * @param oldVersions
     */
    setOldVersions(oldVersions: Array<Document>) {

        this.oldVersions = [];

        for (let oldVersion of oldVersions) {
            this.addOldVersion(oldVersion);
        }
    }

    public addOldVersion(oldVersion: Document) {

        this.oldVersions.push(JSON.parse(JSON.stringify(oldVersion)));
    }
    
    /**
     * Persists the loaded object and all the objects that are or have been in relation
     * with the object before the method call.
     *
     * @returns {Promise<string>} If all objects could get stored,
     *   the promise will resolve to <code>undefined</code>. If one or more
     *   objects could not get stored properly, the promise will get rejected
     *   with msgWithParams.
     */
    public persist(document: Document, user: string = 'anonymous', oldVersions: Array<Document> = this.oldVersions): Promise<any> {

        if (document == undefined) return Promise.resolve();

        return this.ready
            .then(() => this.persistIt(document, user))
            .then(() => {
                return Promise.all(this.getConnectedDocs(document, oldVersions))
                    .catch(() => Promise.reject(MDInternal.PERSISTENCE_ERROR_TARGETNOTFOUND));
            })
            .then(connectedDocs => Promise.all(this.updateConnectedDocs(document.resource, connectedDocs, true)))
            .then(() => { this.oldVersions = [document]; });
    }

    /**
     * Removes the document from the datastore and deletes all corresponding reverse relations.
     * @param document
     * @param oldVersions
     * @return {any}
     *   Rejects with
     *     [DatastoreErrors.DOCUMENT_NO_RESOURCE_ID] - if document has no resource id
     *     [DatastoreErrors.DOCUMENT_DOES_NOT_EXIST_ERROR] - if document has a resource id, but does not exist in the db
     */
    public remove(document: Document, oldVersions: Array<Document> = this.oldVersions): Promise<any> {

        if (document == undefined) return Promise.resolve();

        return this.ready
                .then(() => Promise.all(this.getConnectedDocs(document, oldVersions)))
                .then(connectedDocs => Promise.all(this.updateConnectedDocs(document.resource, connectedDocs, false)))
                .then(() => this.datastore.remove(document))
                .then(() => { this.oldVersions = []; });
    }

    private getConnectedDocs(document: Document, oldVersions: Array<Document>) {

        let promisesToGetObjects: Promise<Document>[] = [];
        let ids: string[] = [];

        let documents = [ document ].concat(oldVersions);

        for (let doc of documents) {
            for (let id of this.extractRelatedObjectIDs(doc['resource'])) {
                if (ids.indexOf(id) == -1) {
                    promisesToGetObjects.push(this.datastore.get(id));
                    ids.push(id);
                }
            }
        }

        return promisesToGetObjects;
    }

    private updateConnectedDocs(resource: Resource, targetDocuments: Document[], setInverseRelations: boolean) {

        var promisesToSaveObjects = new Array();
        for (var targetDocument of targetDocuments) {
            this.pruneInverseRelations(resource['id'], targetDocument['resource']['relations']);
            if (setInverseRelations) this.setInverseRelations(resource, targetDocument['resource']);
            promisesToSaveObjects.push(this.datastore.update(targetDocument));
        }
        return promisesToSaveObjects;
    }

    private pruneInverseRelations(id: string, targetRelations) {

        for (var relation in targetRelations) {
            if (!this.projectConfiguration.isRelationProperty(relation)) continue;

            var index = targetRelations[relation].indexOf(id);
            if (index != -1) {
                targetRelations[relation].splice(index, 1)
            }

            if (targetRelations[relation].length == 0)
                delete targetRelations[relation];
        }
    }

    private setInverseRelations(resource: Resource, targetResource: Resource) {

        for (var relation in resource['relations']) {
            if (!this.projectConfiguration.isRelationProperty(relation)) continue;

            for (var id of resource['relations'][relation]) {
                if (id != targetResource['id']) continue;

                var inverse = this.projectConfiguration.getInverseRelations(relation);

                if (targetResource['relations'][inverse] == undefined)
                    targetResource['relations'][inverse] = [];

                var index = targetResource['relations'][inverse].indexOf(resource['id']);
                if (index != -1) {
                    targetResource['relations'][inverse].splice(index, 1);
                }

                targetResource['relations'][inverse].push(resource['id']);
            }
        }
    }


    private extractRelatedObjectIDs(resource: Resource): Array<string> {

        var relatedObjectIDs = new Array();

        for (var prop in resource['relations']) {
            if (!resource['relations'].hasOwnProperty(prop)) continue;
            if (!this.projectConfiguration.isRelationProperty(prop)) continue;

            for (var id of resource['relations'][prop]) {
                relatedObjectIDs.push(id);
            }
        }
        return relatedObjectIDs;
    }
    

    /**
     * Saves the document to the local datastore.
     * @param document
     */
    private persistIt(document: Document, user: string): Promise<any> {
        
        if (document['resource']['id']) {
            if (!document.modified || document.modified.constructor !== Array)
                document.modified = [];
            document.modified.push({ user: user, date: new Date() });
            return this.datastore.update(document);
        } else {
            document.created = { user: user, date: new Date() };
            document.modified = [];
            // TODO isn't it a problem that create resolves to object id?
            // wouldn't persistChangedObjects() interpret it as an error?
            // why does this not happen?
            return this.datastore.create(document);
        }
    }
}
