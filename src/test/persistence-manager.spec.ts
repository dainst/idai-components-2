/// <reference path="../../typings/globals/jasmine/index.d.ts" />
import {PersistenceManager} from "../app/documents/persistence-manager";
import {ProjectConfiguration} from "../app/configuration/project-configuration";
import {Messages} from "../app/messages/messages";
import {MD} from "../app/messages/md";
import {TestBed} from "@angular/core/testing";

/**
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
export function main() {
    describe('PersistenceManager', () => {

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [],
                imports: [],
                providers: [Messages, MD]
            });
        });

        var mockDatastore;
        var persistenceManager;
        var id = "abc";

        var doc;
        var relatedDoc : any;
        var anotherRelatedObject : any;

        var getFunction = function (id) {
            return {
                then: function (suc, err) {
                    if (id == relatedDoc['resource']['id']) {
                        suc(relatedDoc);
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
            persistenceManager.setProjectConfiguration(new ProjectConfiguration({
                "types": [
                    {
                        "type": "FirstLevelType",
                        "fields": [
                            {
                                "field": "fieldA"
                            }
                        ]
                    },
                    {
                        "type": "SecondLevelType",
                        "parent" : "FirstLevelType",
                        "fields": [
                            {
                                "field": "fieldB"
                            }
                        ]
                    }
                ],
                "relations": [
                    {
                        "name":"BelongsTo",
                        "inverse":"Contains",
                        "label":"Enthalten in"
                    },
                    {
                        "name":"Contains",
                        "inverse":"BelongsTo",
                        "label":"Enthält"
                    }
                ]})
            );
            mockDatastore.get.and.callFake(getFunction);
            mockDatastore.update.and.callFake(successFunction);
            mockDatastore.create.and.callFake(successFunction);

            doc = { "resource" : {
                "id" :"1", "identifier": "ob1",
                "type": "object",
                "relations" : {}
            }, "synced" : 0};

            relatedDoc = { "resource" : {
                "id": "2" , "identifier": "ob2", 
                "type": "object",
                "relations" : {}
            }};

            anotherRelatedObject = { "resource" : {
                "id": "3" , "identifier": "ob3",
                "type": "object",
                "relations" : {}
            }};

        });

        it('save the base object',
            function (done) {

                persistenceManager.persist(doc).then(()=>{
                    expect(mockDatastore.update).toHaveBeenCalledWith(doc);
                    done();
                },(err)=>{fail(err);done();});
            }
        );

        it('save the related object',
            function (done) {

                doc['resource']['relations']["BelongsTo"]=["2"];

                persistenceManager.persist(doc).then(()=>{

                    expect(mockDatastore.update).toHaveBeenCalledWith(relatedDoc);
                    expect(relatedDoc['resource']['relations']['Contains'][0]).toBe("1");
                    done();

                },(err)=>{fail(err);done();});
            }
        );

        it('add two relations of the same type',
            function (done) {

                doc['resource']['relations']["BelongsTo"]=["2","3"];

                persistenceManager.persist(doc).then(()=>{

                    // expect(mockDatastore.update).toHaveBeenCalledWith(relatedObject); // right now it is not possible to test both objects due to problems with the return val of promise.all
                    expect(mockDatastore.update).toHaveBeenCalledWith(anotherRelatedObject);
                    // expect(relatedObject['Contains'][0]).toBe("1");
                    expect(anotherRelatedObject['resource']['relations']['Contains'][0]).toBe("1");
                    done();

                },(err)=>{fail(err);done();});
            }
        );


        it('delete a relation which is not present in the new version of the doc anymore',
            function (done) {

                var oldVersion = { "resource" : {
                    "id" :"1", "identifier": "ob1", 
                    "type": "Object",
                    "relations" : { "BelongsTo" : [ "2" ] }
                }, "synced" : 0};

                relatedDoc['resource']['relations']['Contains']=["1"];

                persistenceManager.setOldVersion(oldVersion);
                persistenceManager.persist(doc).then(()=>{

                    expect(mockDatastore.update).toHaveBeenCalledWith(doc);
                    expect(mockDatastore.update).toHaveBeenCalledWith(relatedDoc);

                    expect(doc['resource']['relations']['BelongsTo']).toBe(undefined);
                    expect(relatedDoc['resource']['relations']['Contains']).toBe(undefined);


                    done();

                },(err)=>{fail(err);done();});
            }
        );

        it('should return an array of error messages when projectConfiguration was not set',
            function (done) {
                persistenceManager.setProjectConfiguration(undefined);
                persistenceManager.persist(doc).then(()=>{
                    fail();
                },(err)=>{
                    expect(Array.isArray(err)).toBeTruthy();
                    done();
                });
            }
        );


    })
}