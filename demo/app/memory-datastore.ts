import {Entity} from "../../lib/app/core-services/entity";
import {Datastore} from "../../lib/app/datastore/datastore";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";

/**
 * @author Daniel de Oliveira
 */
@Injectable()
export class MemoryDatastore implements Datastore {

    private static IDAIFIELDOBJECT = 'idai-field-object';
    private static FULLTEXT = 'fulltext';

    private db: Promise<any>;
    private observers = [];
    private objectCache: { [id: string]: Entity } = {};

    public getUnsyncedObjects(): Observable<Entity> {
        return undefined;
    }
    
    constructor(){};

    public create(object:Entity):Promise<string> {

        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    public update(entity:Entity):Promise<any> {
        this.objectCache[entity.id]=entity;
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    public refresh(id:string):Promise<Entity>  {

        return this.fetchObject(id);
    }

    public get(id:string):Promise<Entity> {

        if (this.objectCache[id]) {
            return new Promise((resolve, reject) => resolve(this.objectCache[id]));
        } else {
            return this.fetchObject(id);
        }
    }

    public remove(id:string):Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.then(db => {
               resolve();
            });
        });
    }

    public clear():Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.then(db => {
                resolve();
            });
        });
    }

    
    public find(query:string):Promise<Entity[]> {

        query = query.toLowerCase();

        var results : Entity[] = [];
        for (var i in this.objectCache) {
            if (this.objectCache[i].id.indexOf(query)!=-1) results.push(this.objectCache[i]);
        }

        return new Promise((resolve, reject) => {
            resolve(results);
        });
    }

    public all():Promise<Entity[]> {

        return new Promise<Entity[]>((resolve, reject) => {
            resolve();
        });
    }

    private fetchObject(id:string): Promise<Entity> {

        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    private saveObject(object:Entity):Promise<any> {

        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    private saveFulltext(object:Entity):Promise<any> {

        return new Promise((resolve, reject) => {
            resolve();
        })
    }
}
