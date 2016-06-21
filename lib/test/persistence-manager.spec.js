System.register(['@angular/core/testing', "@angular/core", "../app/object-edit/persistence-manager", "../app/object-edit/relations-configuration", "../app/core-services/messages", "../app/core-services/md"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var testing_1, core_1, persistence_manager_1, relations_configuration_1, messages_1, md_1;
    /**
     * @author Daniel de Oliveira
     * @author Thomas Kleinke
     */
    function main() {
        testing_1.describe('PersistenceManager', function () {
            testing_1.beforeEachProviders(function () { return [
                core_1.provide(messages_1.Messages, { useClass: messages_1.Messages }),
                core_1.provide(md_1.MD, { useClass: md_1.MD })
            ]; });
            var mockDatastore;
            var persistenceManager;
            var id = "abc";
            var object;
            var relatedObject;
            var anotherRelatedObject;
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
                return new Promise(function (resolve, reject) {
                    reject("objectlist/idexists");
                });
            };
            testing_1.beforeEach(function () {
                mockDatastore = jasmine.createSpyObj('mockDatastore', ['get', 'create', 'update', 'refresh']);
                persistenceManager = new persistence_manager_1.PersistenceManager(mockDatastore);
                persistenceManager.setOldVersion({ "resource": {} });
                persistenceManager.setRelationsConfiguration(new relations_configuration_1.RelationsConfiguration([
                    {
                        "field": "BelongsTo",
                        "inverse": "Contains",
                        "label": "Enthalten in"
                    },
                    {
                        "field": "Contains",
                        "inverse": "BelongsTo",
                        "label": "Enthält"
                    }
                ]));
                mockDatastore.get.and.callFake(getFunction);
                mockDatastore.update.and.callFake(successFunction);
                mockDatastore.create.and.callFake(successFunction);
                object = { "resource": {
                        "@id": "1", "identifier": "ob1",
                        "type": "Object", "synced": 0
                    } };
                relatedObject = { "resource": {
                        "@id": "2", "identifier": "ob2",
                        "type": "Object"
                    } };
                anotherRelatedObject = { "resource": {
                        "@id": "3", "identifier": "ob3",
                        "type": "Object"
                    } };
            });
            testing_1.it('save the base object', function (done) {
                persistenceManager.persist(object).then(function () {
                    testing_1.expect(mockDatastore.update).toHaveBeenCalledWith(object);
                    done();
                }, function (err) { fail(err); done(); });
            });
            testing_1.it('save the related object', function (done) {
                object['resource']["BelongsTo"] = ["2"];
                persistenceManager.persist(object).then(function () {
                    testing_1.expect(mockDatastore.update).toHaveBeenCalledWith(relatedObject);
                    testing_1.expect(relatedObject['resource']['Contains'][0]).toBe("1");
                    done();
                }, function (err) { fail(err); done(); });
            });
            testing_1.it('add two relations of the same type', function (done) {
                object['resource']["BelongsTo"] = ["2", "3"];
                persistenceManager.persist(object).then(function () {
                    // expect(mockDatastore.update).toHaveBeenCalledWith(relatedObject); // right now it is not possible to test both objects due to problems with the return val of promise.all
                    testing_1.expect(mockDatastore.update).toHaveBeenCalledWith(anotherRelatedObject);
                    // expect(relatedObject['Contains'][0]).toBe("1");
                    testing_1.expect(anotherRelatedObject['resource']['Contains'][0]).toBe("1");
                    done();
                }, function (err) { fail(err); done(); });
            });
            testing_1.it('delete a relation', function (done) {
                var oldVersion = { "resource": {
                        "@id": "1", "identifier": "ob1", "BelongsTo": ["2"],
                        "type": "Object", "synced": 0
                    } };
                relatedObject['Contains'] = ["1"];
                persistenceManager.setOldVersion(oldVersion);
                persistenceManager.persist(object).then(function () {
                    testing_1.expect(mockDatastore.update).toHaveBeenCalledWith(object);
                    testing_1.expect(mockDatastore.update).toHaveBeenCalledWith(relatedObject);
                    testing_1.expect(object['resource']['BelongsTo']).toBe(undefined);
                    testing_1.expect(relatedObject['resource']['Contains']).toBe(undefined);
                    done();
                }, function (err) { fail(err); done(); });
            });
        });
    }
    exports_1("main", main);
    return {
        setters:[
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (persistence_manager_1_1) {
                persistence_manager_1 = persistence_manager_1_1;
            },
            function (relations_configuration_1_1) {
                relations_configuration_1 = relations_configuration_1_1;
            },
            function (messages_1_1) {
                messages_1 = messages_1_1;
            },
            function (md_1_1) {
                md_1 = md_1_1;
            }],
        execute: function() {
        }
    }
});
