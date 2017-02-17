import {Document} from "../../src/app/model/document";
import {Query} from "../../src/app/datastore/query";
import {Datastore} from "../../src/app/datastore/datastore";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";

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
    
    constructor(){};

    // NOT IMPLEMENTED
    public documentChangesNotifications():Observable<Document> {
        return undefined;
    }

    public create(document:Document):Promise<string> {
        return Promise.resolve('');
    }

    public update(document:Document):Promise<any> {
        
        this.objectCache[document['resource']['id']]=document;
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    public refresh(document:Document):Promise<Document>  {

        return this.fetchObject(document.resource.id);
    }

    public get(id:string):Promise<Document> {

        if (this.objectCache[id]) {
            return new Promise((resolve, reject) => resolve(this.objectCache[id]));
        } else {
            return this.fetchObject(id);
        }
    }

    public remove(document:Document):Promise<any> {
        return Promise.resolve();
    }

    public clear():Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.then(db => {
                resolve();
            });
        });
    }

    
    public find(query: Query): Promise<Document[]> {

        var queryString = query.q.toLowerCase();

        var results : Document[] = [];
        for (var i in this.objectCache) {
            if (this.objectCache[i]['resource']['id'].indexOf(queryString) != -1) results.push(this.objectCache[i]);
        }

        return new Promise((resolve, reject) => {
            resolve(results);
        });
    }

    public all():Promise<Document[]> {

        return new Promise<Document[]>((resolve, reject) => {
            resolve();
        });
    }

    private fetchObject(id:string): Promise<Document> {

        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    private saveObject(document:Document):Promise<any> {

        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    private saveFulltext(document:Document):Promise<any> {

        return new Promise((resolve, reject) => {
            resolve();
        })
    }
}
