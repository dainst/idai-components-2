import {Injectable} from "@angular/core";
import {Datastore} from "../datastore/datastore";
import {Document} from "../model/document";
import {Resource} from "../model/resource";
import {ProjectConfiguration} from "../configuration/project-configuration";
import {ConfigLoader} from "../configuration/config-loader";

/**
 * With a document to persist, it determines which other documents are 
 * affected by being related to the document in its current or previous state.
 * When persisting, it maintains a consistent state of relations between the objects
 * by also persisting the related documents with updated target relations.
 * 
 * This class is intended to be used only from within the library. 
 * Clients outside this library are advised to use the load-and-service 
 * to load and save objects.
 * 
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
@Injectable() export class PersistenceManager {
    
    private oldVersion: Document = undefined;
    private projectConfiguration: ProjectConfiguration = undefined;
    private ready: Promise<any>;

    constructor(
        private datastore: Datastore,
        private configLoader: ConfigLoader
    ) {
        this.ready = new Promise<string>((resolve)=>{
            this.configLoader.getProjectConfiguration().then(projectConfiguration => {
                this.projectConfiguration = projectConfiguration;
                resolve();
            })
        });
    }

    /**
     * Package private.
     * 
     * @param oldVersion
     */
    setOldVersion(oldVersion) {
        this.oldVersion = JSON.parse(JSON.stringify(oldVersion));
    }
    
    /**
     * Persists the loaded object and all the objects that are or have been in relation
     * with the object before the method call.
     *
     * @returns {Promise<string>} If all objects could get stored,
     *   the promise will resolve to <code>undefined</code>. If one or more
     *   objects could not get stored properly, the promise will get rejected
     *   containing an id of M (or an error message).
     */
    public persist(document: Document, oldVersion: Document = this.oldVersion): Promise<any> {

        if (document == undefined) return Promise.resolve();

        return this.ready
                .then(() => this.persistIt(document))
                .then(() => Promise.all(this.getConnectedDocs(document, oldVersion)))
                .then(connectedDocs => Promise.all(this.updateConnectedDocs(document.resource, connectedDocs, true)))
                .then(() => {
                    this.setOldVersion(document);
                });
    }

    /**
     * Removes the document from the datastore and deletes all corresponding reverse relations.
     */
    public remove(document: Document, oldVersion: Document = this.oldVersion): Promise<any> {

        if (document == undefined) return Promise.resolve();

        return this.ready
                .then(() => Promise.all(this.getConnectedDocs(document, oldVersion)))
                .then(connectedDocs => Promise.all(this.updateConnectedDocs(document.resource, connectedDocs, false)))
                .then(() => this.datastore.remove(document.resource.id));
    }

    private getConnectedDocs(document: Document, oldVersion: Document) {

        var promisesToGetObjects: Promise<Document>[] = [];
        var ids: string[] = [];

        for (var id of this.extractRelatedObjectIDs(document['resource'])) {
            if (ids.indexOf(id) == -1) {
                promisesToGetObjects.push(this.datastore.get(id));
                ids.push(id);
            }
        }
        for (var id of this.extractRelatedObjectIDs(oldVersion['resource'])) {
            if (ids.indexOf(id) == -1) {
                promisesToGetObjects.push(this.datastore.get(id));
                ids.push(id);
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


    private extractRelatedObjectIDs(resource: Resource) : Array<string> {

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
    private persistIt(document: Document): Promise<any> {
        
        if (document['resource']['id']) {
            return this.datastore.update(document);
        } else {
            // TODO isn't it a problem that create resolves to object id?
            // wouldn't persistChangedObjects() interpret it as an error?
            // why does this not happen?
            return this.datastore.create(document);
        }
    }

    private toStringArray(str : any) : string[] {
        if ((typeof str)=="string") return [str]; else return str;
    }
}
