import {Injectable} from '@angular/core';
import {Datastore} from '../datastore/datastore';
import {Document} from '../model/document';
import {Resource} from '../model/resource';
import {ProjectConfiguration} from '../configuration/project-configuration';
import {ConfigLoader} from '../configuration/config-loader';
import {MDInternal} from '../messages/md-internal';
import {ConnectedDocsResolver} from "./connected-docs-resolver";

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

    private connectedDocsResolver;

    constructor(
        private datastore: Datastore,
        private configLoader: ConfigLoader
    ) {
        this.ready = new Promise<string>((resolve) => {
            this.configLoader.getProjectConfiguration().then(projectConfiguration => {
                this.projectConfiguration = projectConfiguration;
                this.connectedDocsResolver = new ConnectedDocsResolver(projectConfiguration);
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
     * If the document is
     *
     *   { resource: { id: 1, relations: { includes: [2] } } },
     *
     * this means that also another document is updated, namely
     *
     *   { resource: { id: 2 } } },
     *
     * which gets updated to
     *
     *   { resource: { id: 2, relations: { belongsTo: [1] } } }.
     *
     * This happens based on a configuration which includes
     *
     *   { name: includes, inverse: belongsTo }.
     *
     * If the configuration looks like this
     *
     *   { name: includes, inverse: NO-INVERSE }
     *
     * the other documents back relation gets not set. If no other relation gets
     * persisted on that document, it does not get updated at all.
     *
     * @returns {Promise<string>} If all objects could get stored,
     *   the promise will resolve to <code>undefined</code>. If one or more
     *   objects could not get stored properly, the promise will get rejected
     *   with msgWithParams.
     */
    public persist(document: Document, user: string = 'anonymous',
                   oldVersions: Array<Document> = this.oldVersions): Promise<any> {

        if (document == undefined) return Promise.resolve();

        let persistedDocument: Document;

        return this.ready
            .then(() => this.persistIt(document, user))
            .then(persistedDoc => {
                persistedDocument = persistedDoc;
                return Promise.all(this.getConnectedDocs(document, oldVersions))
                    .catch(() => Promise.reject([MDInternal.PERSISTENCE_ERROR_TARGETNOTFOUND]));
            })
            .then(connectedDocs => this.updateDocs(document, connectedDocs, true, user))
            .then(() => {
                this.oldVersions = [document];
                return Promise.resolve(persistedDocument);
            });
    }

    private updateDocs(document: Document, connectedDocs: Array<Document>, setInverseRelations: boolean, user: string) {

        const promises = [];
        const docsToUpdate = this.connectedDocsResolver.determineDocsToUpdate(document, connectedDocs, setInverseRelations);
        for (let docToUpdate of docsToUpdate) {
            promises.push(this.persistIt(docToUpdate,user));
        }
        return Promise.all(promises);
    }

    /**
     * Removes the document from the datastore and deletes all corresponding reverse relations.
     *
     * @param document
     * @param oldVersions
     * @return {any}
     *   Rejects with
     *     [DatastoreErrors.DOCUMENT_NO_RESOURCE_ID] - if document has no resource id
     *     [DatastoreErrors.DOCUMENT_DOES_NOT_EXIST_ERROR] - if document has a resource id, but does not exist in the db
     *     [DatastoreErrors.GENERIC_DELETE_ERROR] - if cannot delete for another reason
     */
    public remove(document: Document, user: string = 'anonymous', oldVersions: Array<Document> = this.oldVersions): Promise<any> {

        if (document == undefined) return Promise.resolve();

        return this.ready
                .then(() => Promise.all(this.getConnectedDocs(document, oldVersions)))
                .then(connectedDocs => this.updateDocs(document,connectedDocs,false,user))
                .then(() => this.datastore.remove(document))
                .then(() => { this.oldVersions = []; });
    }

    private getConnectedDocs(document: Document, oldVersions: Array<Document>) {

        let promisesToGetObjects: Promise<Document>[] = [];
        let ids: string[] = [];

        let documents = [ document ].concat(oldVersions);

        for (let doc of documents) {
            for (let id of this.extractRelatedObjectIDs(doc.resource)) {
                if (ids.indexOf(id) == -1) {
                    promisesToGetObjects.push(this.datastore.get(id));
                    ids.push(id);
                }
            }
        }

        return promisesToGetObjects;
    }

    private extractRelatedObjectIDs(resource: Resource): Array<string> {

        const relatedObjectIDs = [];

        for (let prop in resource.relations) {
            if (!resource.relations.hasOwnProperty(prop)) continue;
            if (!this.projectConfiguration.isRelationProperty(prop)) continue;

            for (let id of resource.relations[prop]) {
                relatedObjectIDs.push(id);
            }
        }
        return relatedObjectIDs;
    }

    /**
     * Saves the document to the local datastore.
     * @param document
     * @param user
     */
    private persistIt(document: Document, user: string): Promise<any> {
        
        if (document.resource.id) {
            if (!document.modified || document.modified.constructor !== Array)
                document.modified = [];
            document.modified.push({ user: user, date: new Date() });
            return this.datastore.update(document);
        } else {
            document.created = { user: user, date: new Date() };
            document.modified = [{ user: user, date: new Date() }];
            // TODO isn't it a problem that create resolves to object id?
            // wouldn't persistChangedObjects() interpret it as an error?
            // why does this not happen?
            return this.datastore.create(document);
        }
    }
}
