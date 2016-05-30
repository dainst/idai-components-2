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
    var Indexeddb;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            /**
             * @author Sebastian Cuy
             * @author Daniel M. de Oliveira
             */
            Indexeddb = (function () {
                function Indexeddb() {
                }
                Indexeddb.prototype.db = function () {
                    return new Promise(function (resolve, reject) {
                        var request = indexedDB.open("IdaiFieldClient", 13);
                        request.onerror = function (event) {
                            console.error("Could not create IndexedDB! Error: ", request.error.name);
                            reject(request.error);
                        };
                        request.onsuccess = function (event) {
                            request.result.put = function (name, what) {
                                return request.result.transaction([name], 'readwrite')
                                    .objectStore(name).put(what);
                            };
                            request.result.remove = function (name, what) {
                                return request.result.transaction([name], 'readwrite')
                                    .objectStore(name).delete(what);
                            };
                            request.result.clear = function (name) {
                                return request.result.transaction([name], 'readwrite')
                                    .objectStore(name).clear();
                            };
                            request.result.get = function (name, what) {
                                return request.result.transaction([name], 'readwrite')
                                    .objectStore(name).get(what);
                            };
                            request.result.openCursor = function (name, index, what, what2) {
                                return request.result.transaction([name], 'readwrite')
                                    .objectStore(name).index(index).openCursor(what, what2);
                            };
                            resolve(request.result);
                        };
                        request.onupgradeneeded = function (event) {
                            var db = request.result;
                            if (db.objectStoreNames.length > 0) {
                                db.deleteObjectStore("idai-field-object");
                                db.deleteObjectStore("fulltext");
                            }
                            var objectStore = db.createObjectStore("idai-field-object", { keyPath: "id" });
                            objectStore.createIndex("identifier", "identifier", { unique: true });
                            objectStore.createIndex("synced", "synced", { unique: false });
                            objectStore.createIndex("modified", "modified");
                            objectStore.createIndex("created", "created");
                            objectStore.createIndex("title", "title");
                            var fulltextStore = db.createObjectStore("fulltext", { keyPath: "id" });
                            fulltextStore.createIndex("terms", "terms", { multiEntry: true });
                        };
                    });
                };
                Indexeddb = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], Indexeddb);
                return Indexeddb;
            }());
            exports_1("Indexeddb", Indexeddb);
        }
    }
});
//# sourceMappingURL=indexeddb.js.map