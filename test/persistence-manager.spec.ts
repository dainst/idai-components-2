import {fdescribe,describe,expect,fit,it,xit, inject, beforeEach,beforeEachProviders} from '@angular/core/testing';
import {provide} from "@angular/core";
import {Entity} from "../app/core-services/entity";
import {PersistenceManager} from "../app/core-services/persistence-manager";
import {Datastore} from "../app/datastore/datastore";
import {Messages} from "../app/core-services/messages";
import {MD} from "../app/md";

/**
 * @author Daniel M. de Oliveira
 * @author Thomas Kleinke
 */
export function main() {
    describe('PersistenceManager', () => {

        beforeEachProviders(() => [
            provide(Messages, {useClass: Messages}),
            provide(MD, {useClass: MD})
        ]);

        var mockDatastore;
        var mockRelationsProvider;
        var persistenceManager;
        var id = "abc";

        var object;
        var relatedObject : Entity;
        var anotherRelatedObject : Entity;

        var getFunction = function (id) {
            return {
                then: function (suc, err) {
                    if (id == relatedObject.id) {
                        suc(relatedObject);
                    }
                    else {
                        suc(anotherRelatedObject);
                    }
                }
            };
        };

        var successFunction = function () {
            return {
                then: function (suc, err) {
                    suc("ok");
                }
            };
        };

        var errorFunction = function () {
            return new Promise<any>((resolve, reject) => {
                reject("objectlist/idexists");
            });
        };

        var relF = function(n) {
            if (n=="BelongsTo") return true;
            if (n=="Contains") return true;
            return false;
        }


        beforeEach(function () {

            mockRelationsProvider = jasmine.createSpyObj('mockRelationsProvider',['isRelationProperty','getInverse'])
            mockDatastore = jasmine.createSpyObj('mockDatastore', ['get', 'create', 'update', 'refresh']);
            persistenceManager = new PersistenceManager(mockDatastore,mockRelationsProvider);
            mockRelationsProvider.isRelationProperty.and.callFake(relF);
            mockRelationsProvider.getInverse.and.returnValue("Contains");
            mockDatastore.get.and.callFake(getFunction);
            mockDatastore.update.and.callFake(successFunction);
            mockDatastore.create.and.callFake(successFunction);

            object = {
                "id" :"1", "identifier": "ob1", "title": "Title1",
                "type": "Object", "synced" : 0
            };

            relatedObject = {
                "id": "2" , "identifier": "ob2", "title": "Title2",
                "type": "Object"
            }

            anotherRelatedObject = {
                "id": "3" , "identifier": "ob3", "title": "Title3",
                "type": "Object"
            }

        });

        it('save the base object',
            function (done) {

                persistenceManager.load(object);
                persistenceManager.persist().then(()=>{
                    expect(mockDatastore.update).toHaveBeenCalledWith(object);
                    done();
                },(err)=>{fail(err);done();});
            }
        );

        it('save the related object',
            function (done) {

                object["BelongsTo"]=["2"];

                persistenceManager.load(object);
                persistenceManager.persist().then(()=>{

                    expect(mockDatastore.update).toHaveBeenCalledWith(relatedObject);
                    expect(relatedObject['Contains'][0]).toBe("1");
                    done();

                },(err)=>{fail(err);done();});
            }
        );

        it('add two relations of the same type',
            function (done) {

                object["BelongsTo"]=["2","3"];

                persistenceManager.load(object);
                persistenceManager.persist().then(()=>{

                    // expect(mockDatastore.update).toHaveBeenCalledWith(relatedObject); // right now it is not possible to test both objects due to problems with the return val of promise.all
                    expect(mockDatastore.update).toHaveBeenCalledWith(anotherRelatedObject);
                    // expect(relatedObject['Contains'][0]).toBe("1");
                    expect(anotherRelatedObject['Contains'][0]).toBe("1");
                    done();

                },(err)=>{fail(err);done();});
            }
        );


        it('delete a relation',
            function (done) {

                var oldVersion = {
                    "id" :"1", "identifier": "ob1", "title": "Title1", "BelongsTo" : [ "2" ],
                    "type": "Object", "synced" : 0
                }

                relatedObject['Contains']=["1"];

                persistenceManager.setOldVersion(oldVersion);
                persistenceManager.load(object);
                persistenceManager.persist().then(()=>{

                    expect(mockDatastore.update).toHaveBeenCalledWith(object);
                    expect(mockDatastore.update).toHaveBeenCalledWith(relatedObject);

                    expect(object['BelongsTo']).toBe(undefined);
                    expect(relatedObject['Contains']).toBe(undefined);


                    done();

                },(err)=>{fail(err);done();});
            }
        );
    })
}