import {fdescribe,describe,expect,fit,it,xit, inject, beforeEach,beforeEachProviders} from '@angular/core/testing';
import {provide} from "@angular/core";
import {Entity} from "../app/core-services/entity";
import {PersistenceManager} from "../app/object-edit/persistence-manager";
import {RelationsConfiguration} from "../app/object-edit/relations-configuration";
import {Messages} from "../app/core-services/messages";
import {MD} from "../app/core-services/md";

/**
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
export function main() {
    describe('PersistenceManager', () => {

        beforeEachProviders(() => [
            provide(Messages, {useClass: Messages}),
            provide(MD, {useClass: MD})
        ]);

        var mockDatastore;
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

        beforeEach(function () {

            mockDatastore = jasmine.createSpyObj('mockDatastore', ['get', 'create', 'update', 'refresh']);
            persistenceManager = new PersistenceManager(mockDatastore);
            persistenceManager.setRelationsConfiguration(new RelationsConfiguration(
                [
                    {
                        "field":"BelongsTo",
                        "inverse":"Contains",
                        "label":"Enthalten in"
                    },
                    {
                        "field":"Contains",
                        "inverse":"BelongsTo",
                        "label":"Enthält"
                    }
                ]));
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