import {Document} from '../../src/app/model/document';
import {Query} from '../../src/app/datastore/query';
import {Datastore} from '../../src/app/datastore/datastore';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

/**
 * @author Daniel de Oliveira
 */
@Injectable()
export class MemoryDatastore implements Datastore {

    private db: Promise<any>;
    private objectCache: { [id: string]: Document } = {};

    public getUnsyncedObjects(): Observable<Document> {
        return undefined;
    }
    
    constructor() {};

    // NOT IMPLEMENTED
    public documentChangesNotifications(): Observable<Document> {
        return undefined;
    }

    public create(document: Document): Promise<Document> {
        this.objectCache[document.resource.id] = document;
        return Promise.resolve(document);
    }

    public update(document: Document): Promise<Document> {
        this.objectCache[document.resource.id] = document;
        return Promise.resolve(document);
    }

    public refresh(document: Document): Promise<Document>  {
        return Promise.resolve(undefined);
    }

    public get(id: string): Promise<Document> {
        return new Promise<Document>((resolve, reject) => {
            if (!this.objectCache[id]) reject('document not found');
            resolve(this.objectCache[id]);
        });
    }

    public remove(document: Document): Promise<any> {
        return Promise.resolve();
    }

    public clear(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.then(db => {
                resolve();
            });
        });
    }
    
    public find(query: Query): Promise<Document[]> {

        var queryString = query.q.toLowerCase();

        var results: Document[] = [];
        for (var i in this.objectCache) {
            if (this.objectCache[i].resource.id.indexOf(queryString) != -1) results.push(this.objectCache[i]);
        }

        return new Promise((resolve, reject) => {
            resolve(results);
        });
    }

    public all(): Promise<Document[]> {

        return new Promise<Document[]>((resolve, reject) => {
            resolve();
        });
    }
}
