System.register(["@angular/core", "../datastore/datastore", "../object-edit/relations-provider", "../md"], function(exports_1, context_1) {
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
    var core_1, datastore_1, relations_provider_1, md_1;
    var PersistenceManager;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (datastore_1_1) {
                datastore_1 = datastore_1_1;
            },
            function (relations_provider_1_1) {
                relations_provider_1 = relations_provider_1_1;
            },
            function (md_1_1) {
                md_1 = md_1_1;
            }],
        execute: function() {
            /**
             * @author Daniel de Oliveira
             */
            PersistenceManager = (function () {
                function PersistenceManager(datastore, relationsProvider) {
                    this.datastore = datastore;
                    this.relationsProvider = relationsProvider;
                    this.object = undefined;
                    this.oldVersion = undefined;
                }
                PersistenceManager.prototype.setOldVersion = function (oldVersion) {
                    this.oldVersion = JSON.parse(JSON.stringify(oldVersion));
                };
                PersistenceManager.prototype.load = function (object) {
                    this.object = object;
                };
                PersistenceManager.prototype.unload = function () {
                    this.object = undefined;
                };
                PersistenceManager.prototype.isLoaded = function () {
                    return (this.object != undefined);
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
                        if (_this.object == undefined)
                            return resolve();
                        _this.persistIt(_this.object).then(function () {
                            Promise.all(_this.makeGetPromises(_this.object, _this.oldVersion)).then(function (targetObjects) {
                                Promise.all(_this.makeSavePromises(_this.object, targetObjects)).then(function (targetObjects) {
                                    _this.unload();
                                    resolve();
                                }, function (err) { return reject(err); });
                            }, function (err) { return reject(err); });
                        }, function (err) { reject(_this.toStringArray(err)); });
                    });
                };
                PersistenceManager.prototype.makeGetPromises = function (object, oldVersion) {
                    var promisesToGetObjects = new Array();
                    for (var _i = 0, _a = this.extractRelatedObjectIDs(object); _i < _a.length; _i++) {
                        var id = _a[_i];
                        promisesToGetObjects.push(this.datastore.get(id));
                    }
                    for (var _b = 0, _c = this.extractRelatedObjectIDs(oldVersion); _b < _c.length; _b++) {
                        var id = _c[_b];
                        promisesToGetObjects.push(this.datastore.get(id));
                    }
                    return promisesToGetObjects;
                };
                PersistenceManager.prototype.makeSavePromises = function (object, targetObjects) {
                    var promisesToSaveObjects = new Array();
                    for (var _i = 0, targetObjects_1 = targetObjects; _i < targetObjects_1.length; _i++) {
                        var targetObject = targetObjects_1[_i];
                        this.pruneInverseRelations(this.object, targetObject);
                        this.setInverseRelations(this.object, targetObject);
                        promisesToSaveObjects.push(this.datastore.update(targetObject));
                    }
                    return promisesToSaveObjects;
                };
                PersistenceManager.prototype.pruneInverseRelations = function (object, targetObject) {
                    for (var prop in targetObject) {
                        if (!targetObject.hasOwnProperty(prop))
                            continue;
                        if (!this.relationsProvider.isRelationProperty(prop))
                            continue;
                        var index = targetObject[prop].indexOf(object.id);
                        if (index != -1) {
                            targetObject[prop].splice(index, 1);
                        }
                        if (targetObject[prop].length == 0)
                            delete targetObject[prop];
                    }
                };
                PersistenceManager.prototype.setInverseRelations = function (object, targetObject) {
                    for (var prop in object) {
                        if (!object.hasOwnProperty(prop))
                            continue;
                        if (!this.relationsProvider.isRelationProperty(prop))
                            continue;
                        for (var _i = 0, _a = object[prop]; _i < _a.length; _i++) {
                            var id = _a[_i];
                            if (id != targetObject.id)
                                continue;
                            var inverse = this.relationsProvider.getInverse(prop);
                            if (targetObject[inverse] == undefined)
                                targetObject[inverse] = [];
                            var index = targetObject[inverse].indexOf(object.id);
                            if (index != -1) {
                                targetObject[inverse].splice(index, 1);
                            }
                            targetObject[inverse].push(object.id);
                        }
                    }
                };
                PersistenceManager.prototype.extractRelatedObjectIDs = function (object) {
                    var relatedObjectIDs = new Array();
                    for (var prop in object) {
                        if (!object.hasOwnProperty(prop))
                            continue;
                        if (!this.relationsProvider.isRelationProperty(prop))
                            continue;
                        for (var _i = 0, _a = object[prop]; _i < _a.length; _i++) {
                            var id = _a[_i];
                            relatedObjectIDs.push(id);
                        }
                    }
                    return relatedObjectIDs;
                };
                /**
                 * Saves the object to the local datastore.
                 * @param object
                 */
                PersistenceManager.prototype.persistIt = function (object) {
                    // Replace with proper validation
                    if (!object.identifier || object.identifier.length == 0) {
                        return new Promise(function (resolve, reject) { reject(md_1.MD.OBJLIST_IDMISSING); });
                    }
                    object['synced'] = 0; // TODO this must go out of the library
                    if (object.id) {
                        return this.datastore.update(object);
                    }
                    else {
                        // TODO isn't it a problem that create resolves to object id?
                        // wouldn't persistChangedObjects() interpret it as an error?
                        // why does this not happen?
                        return this.datastore.create(object);
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
                    __metadata('design:paramtypes', [datastore_1.Datastore, relations_provider_1.RelationsProvider])
                ], PersistenceManager);
                return PersistenceManager;
            }());
            exports_1("PersistenceManager", PersistenceManager);
        }
    }
});
