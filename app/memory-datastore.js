System.register(["@angular/core"], function(exports_1, context_1) {
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
    var core_1;
    var MemoryDatastore;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            /**
             * @author Daniel de Oliveira
             */
            MemoryDatastore = (function () {
                function MemoryDatastore() {
                    this.observers = [];
                    this.objectCache = {};
                }
                MemoryDatastore.prototype.getUnsyncedObjects = function () {
                    return undefined;
                };
                ;
                MemoryDatastore.prototype.create = function (object) {
                    return new Promise(function (resolve, reject) {
                        resolve();
                    });
                };
                MemoryDatastore.prototype.update = function (entity) {
                    this.objectCache[entity.id] = entity;
                    return new Promise(function (resolve, reject) {
                        resolve();
                    });
                };
                MemoryDatastore.prototype.refresh = function (id) {
                    return this.fetchObject(id);
                };
                MemoryDatastore.prototype.get = function (id) {
                    var _this = this;
                    if (this.objectCache[id]) {
                        return new Promise(function (resolve, reject) { return resolve(_this.objectCache[id]); });
                    }
                    else {
                        return this.fetchObject(id);
                    }
                };
                MemoryDatastore.prototype.remove = function (id) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        _this.db.then(function (db) {
                            resolve();
                        });
                    });
                };
                MemoryDatastore.prototype.clear = function () {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        _this.db.then(function (db) {
                            resolve();
                        });
                    });
                };
                MemoryDatastore.prototype.find = function (query) {
                    query = query.toLowerCase();
                    var results = [];
                    for (var i in this.objectCache) {
                        if (this.objectCache[i].identifier.indexOf(query) != -1)
                            results.push(this.objectCache[i]);
                    }
                    console.log("results ", results);
                    return new Promise(function (resolve, reject) {
                        resolve(results);
                    });
                };
                MemoryDatastore.prototype.all = function () {
                    return new Promise(function (resolve, reject) {
                        resolve();
                    });
                };
                MemoryDatastore.prototype.fetchObject = function (id) {
                    return new Promise(function (resolve, reject) {
                        resolve();
                    });
                };
                MemoryDatastore.prototype.saveObject = function (object) {
                    return new Promise(function (resolve, reject) {
                        resolve();
                    });
                };
                MemoryDatastore.prototype.saveFulltext = function (object) {
                    return new Promise(function (resolve, reject) {
                        resolve();
                    });
                };
                MemoryDatastore.IDAIFIELDOBJECT = 'idai-field-object';
                MemoryDatastore.FULLTEXT = 'fulltext';
                MemoryDatastore = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], MemoryDatastore);
                return MemoryDatastore;
            }());
            exports_1("MemoryDatastore", MemoryDatastore);
        }
    }
});
//# sourceMappingURL=memory-datastore.js.map