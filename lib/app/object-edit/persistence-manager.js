System.register(["@angular/core", "../datastore/datastore"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, datastore_1;
    var PersistenceManager;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (datastore_1_1) {
                datastore_1 = datastore_1_1;
            }],
        execute: function() {
            /**
             * This class is intended to be used only from within the library.
             * Clients outside this library are advised to use the load-and-service
             * to load and save objects.
             *
             * @author Daniel de Oliveira
             */
            PersistenceManager = (function () {
                function PersistenceManager(datastore) {
                    this.datastore = datastore;
                    this.document = undefined;
                    this.oldVersion = undefined;
                    this.relationsConfiguration = undefined;
                }
                PersistenceManager.prototype.setRelationsConfiguration = function (relationsConfiguration) {
                    this.relationsConfiguration = relationsConfiguration;
                };
                PersistenceManager.prototype.setOldVersion = function (oldVersion) {
                    this.oldVersion = JSON.parse(JSON.stringify(oldVersion));
                };
                PersistenceManager.prototype.load = function (document) {
                    this.document = document;
                };
                PersistenceManager.prototype.unload = function () {
                    this.document = undefined;
                };
                PersistenceManager.prototype.isLoaded = function () {
                    return (this.document != undefined);
                };
                /**
                 * Persists the loaded object and all the objects that are or have been in relation
                 * with the object before the method call.
                 *
                 * @returns {Promise<string[]>} If all objects could get stored,
                 *   the promise will just resolve to <code>undefined</code>. If one or more
                 *   objects could not get stored properly, the promise will resolve to
                 *   <code>string[]</code>, containing ids of M where possible,
                 *   and error messages where not.
                 */
                PersistenceManager.prototype.persist = function () {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        if (!_this.relationsConfiguration)
                            return reject("no relations configuration available");
                        if (_this.document == undefined)
                            return resolve();
                        _this.persistIt(_this.document).then(function () {
                            Promise.all(_this.makeGetPromises(_this.document, _this.oldVersion)).then(function (targetObjects) {
                                Promise.all(_this.makeSavePromises(_this.document, targetObjects)).then(function (targetObjects) {
                                    _this.unload();
                                    resolve();
                                }, function (err) { return reject(err); });
                            }, function (err) { return reject(err); });
                        }, function (err) { reject(_this.toStringArray(err)); });
                    });
                };
                PersistenceManager.prototype.makeGetPromises = function (document, oldVersion) {
                    var promisesToGetObjects = new Array();
                    for (var _i = 0, _a = this.extractRelatedObjectIDs(document['resource']); _i < _a.length; _i++) {
                        var id = _a[_i];
                        promisesToGetObjects.push(this.datastore.get(id));
                    }
                    for (var _b = 0, _c = this.extractRelatedObjectIDs(oldVersion['resource']); _b < _c.length; _b++) {
                        var id = _c[_b];
                        promisesToGetObjects.push(this.datastore.get(id));
                    }
                    return promisesToGetObjects;
                };
                PersistenceManager.prototype.makeSavePromises = function (document, targetDocuments) {
                    var promisesToSaveObjects = new Array();
                    for (var _i = 0, targetDocuments_1 = targetDocuments; _i < targetDocuments_1.length; _i++) {
                        var targetDocument = targetDocuments_1[_i];
                        this.pruneInverseRelations(this.document['resource'], targetDocument['resource']);
                        this.setInverseRelations(this.document['resource'], targetDocument['resource']);
                        promisesToSaveObjects.push(this.datastore.update(targetDocument));
                    }
                    return promisesToSaveObjects;
                };
                PersistenceManager.prototype.pruneInverseRelations = function (resource, targetResource) {
                    for (var prop in targetResource) {
                        if (!targetResource.hasOwnProperty(prop))
                            continue;
                        if (!this.relationsConfiguration.isRelationProperty(prop))
                            continue;
                        var index = targetResource[prop].indexOf(resource.id);
                        if (index != -1) {
                            targetResource[prop].splice(index, 1);
                        }
                        if (targetResource[prop].length == 0)
                            delete targetResource[prop];
                    }
                };
                PersistenceManager.prototype.setInverseRelations = function (resource, targetResource) {
                    for (var prop in resource) {
                        if (!resource.hasOwnProperty(prop))
                            continue;
                        if (!this.relationsConfiguration.isRelationProperty(prop))
                            continue;
                        for (var _i = 0, _a = resource[prop]; _i < _a.length; _i++) {
                            var id = _a[_i];
                            if (id != targetResource.id)
                                continue;
                            var inverse = this.relationsConfiguration.getInverse(prop);
                            if (targetResource[inverse] == undefined)
                                targetResource[inverse] = [];
                            var index = targetResource[inverse].indexOf(resource.id);
                            if (index != -1) {
                                targetResource[inverse].splice(index, 1);
                            }
                            targetResource[inverse].push(resource.id);
                        }
                    }
                };
                PersistenceManager.prototype.extractRelatedObjectIDs = function (resource) {
                    var relatedObjectIDs = new Array();
                    for (var prop in resource) {
                        if (!resource.hasOwnProperty(prop))
                            continue;
                        if (!this.relationsConfiguration.isRelationProperty(prop))
                            continue;
                        for (var _i = 0, _a = resource[prop]; _i < _a.length; _i++) {
                            var id = _a[_i];
                            relatedObjectIDs.push(id);
                        }
                    }
                    return relatedObjectIDs;
                };
                /**
                 * Saves the document to the local datastore.
                 * @param document
                 */
                PersistenceManager.prototype.persistIt = function (document) {
                    if (document['resource'].id) {
                        return this.datastore.update(document);
                    }
                    else {
                        // TODO isn't it a problem that create resolves to object id?
                        // wouldn't persistChangedObjects() interpret it as an error?
                        // why does this not happen?
                        return this.datastore.create(document);
                    }
                };
                PersistenceManager.prototype.toStringArray = function (str) {
                    if ((typeof str) == "string")
                        return [str];
                    else
                        return str;
                };
                PersistenceManager = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [datastore_1.Datastore])
                ], PersistenceManager);
                return PersistenceManager;
            }());
            exports_1("PersistenceManager", PersistenceManager);
        }
    }
});
//# sourceMappingURL=persistence-manager.js.map