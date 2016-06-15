System.register(["@angular/core", "../core-services/md", "./persistence-manager", "../core-services/messages", "./validation-interceptor"], function(exports_1, context_1) {
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
    var core_1, md_1, persistence_manager_1, messages_1, validation_interceptor_1;
    var LoadAndSaveService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (md_1_1) {
                md_1 = md_1_1;
            },
            function (persistence_manager_1_1) {
                persistence_manager_1 = persistence_manager_1_1;
            },
            function (messages_1_1) {
                messages_1 = messages_1_1;
            },
            function (validation_interceptor_1_1) {
                validation_interceptor_1 = validation_interceptor_1_1;
            }],
        execute: function() {
            /**
             * The purpose of this is to have a place
             * for the calls to setOldVersion, to validate,
             * and to convert errors to messages.
             *
             * @author Daniel de Oliveira
             */
            LoadAndSaveService = (function () {
                function LoadAndSaveService(messages, persistenceManager, loadAndSaveInterceptor) {
                    this.messages = messages;
                    this.persistenceManager = persistenceManager;
                    this.loadAndSaveInterceptor = loadAndSaveInterceptor;
                }
                LoadAndSaveService.prototype.load = function (document) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        _this.persistenceManager.setOldVersion(document);
                        resolve();
                    });
                };
                LoadAndSaveService.prototype.save = function (document) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        _this.messages.clear();
                        var result = _this.loadAndSaveInterceptor.validate(document);
                        if (result != undefined) {
                            _this.messages.add(result);
                            return reject();
                        }
                        _this.persistenceManager.load(document);
                        _this.persistenceManager.persist().then(function () {
                            _this.persistenceManager.setOldVersion(document);
                            _this.messages.add(md_1.MD.OBJLIST_SAVE_SUCCESS);
                            resolve();
                        }, function (errors) {
                            if (errors) {
                                for (var i in errors) {
                                    _this.messages.add(errors[i]);
                                }
                            }
                            reject();
                        });
                    });
                };
                LoadAndSaveService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [messages_1.Messages, persistence_manager_1.PersistenceManager, validation_interceptor_1.ValidationInterceptor])
                ], LoadAndSaveService);
                return LoadAndSaveService;
            }());
            exports_1("LoadAndSaveService", LoadAndSaveService);
        }
    }
});
//# sourceMappingURL=load-and-save-service.js.map