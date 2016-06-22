import {fdescribe,describe,expect,fit,it,xit, inject, beforeEach,beforeEachProviders} from '@angular/core/testing';
import {provide} from "@angular/core";
import {Document} from "../app/core-services/document";
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
        var relatedObject : any;
        var anotherRelatedObject : any;

        var getFunction = function (id) {
            return {
                then: function (suc, err) {
                    if (id == relatedObject['resource']['@id']) {
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
            persistenceManager.setOldVersion({"resource":{}});
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

            object = { "resource" : {
                "@id" :"1", "identifier": "ob1",
                "type": "Object", "synced" : 0
            }};

            relatedObject = { "resource" : {
                "@id": "2" , "identifier": "ob2", 
                "type": "Object"
            }};

            anotherRelatedObject = { "resource" : {
                "@id": "3" , "identifier": "ob3",
                "type": "Object"
            }};

        });

        it('save the base object',
            function (done) {

                persistenceManager.persist(object).then(()=>{
                    expect(mockDatastore.update).toHaveBeenCalledWith(object);
                    done();
                },(err)=>{fail(err);done();});
            }
        );

        it('save the related object',
            function (done) {

                object['resource']["BelongsTo"]=["2"];

                persistenceManager.persist(object).then(()=>{

                    expect(mockDatastore.update).toHaveBeenCalledWith(relatedObject);
                    expect(relatedObject['resource']['Contains'][0]).toBe("1");
                    done();

                },(err)=>{fail(err);done();});
            }
        );

        it('add two relations of the same type',
            function (done) {

                object['resource']["BelongsTo"]=["2","3"];

                persistenceManager.persist(object).then(()=>{

                    // expect(mockDatastore.update).toHaveBeenCalledWith(relatedObject); // right now it is not possible to test both objects due to problems with the return val of promise.all
                    expect(mockDatastore.update).toHaveBeenCalledWith(anotherRelatedObject);
                    // expect(relatedObject['Contains'][0]).toBe("1");
                    expect(anotherRelatedObject['resource']['Contains'][0]).toBe("1");
                    done();

                },(err)=>{fail(err);done();});
            }
        );


        it('delete a relation',
            function (done) {

                var oldVersion = { "resource" : {
                    "@id" :"1", "identifier": "ob1", "BelongsTo" : [ "2" ],
                    "type": "Object", "synced" : 0
                }};

                relatedObject['Contains']=["1"];

                persistenceManager.setOldVersion(oldVersion);
                persistenceManager.persist(object).then(()=>{

                    expect(mockDatastore.update).toHaveBeenCalledWith(object);
                    expect(mockDatastore.update).toHaveBeenCalledWith(relatedObject);

                    expect(object['resource']['BelongsTo']).toBe(undefined);
                    expect(relatedObject['resource']['Contains']).toBe(undefined);


                    done();

                },(err)=>{fail(err);done();});
            }
        );
    })
}