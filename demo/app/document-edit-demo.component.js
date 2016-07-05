System.register(['@angular/core', '@angular/router-deprecated', '../../src/app/object-edit/document-edit.component', '../../src/app/object-edit/config-loader', '../../src/app/datastore/datastore', "./sample-objects", "../../src/app/object-edit/persistence-manager"], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, document_edit_component_1, config_loader_1, datastore_1, sample_objects_1, persistence_manager_1;
    var DocumentEditDemoComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (document_edit_component_1_1) {
                document_edit_component_1 = document_edit_component_1_1;
            },
            function (config_loader_1_1) {
                config_loader_1 = config_loader_1_1;
            },
            function (datastore_1_1) {
                datastore_1 = datastore_1_1;
            },
            function (sample_objects_1_1) {
                sample_objects_1 = sample_objects_1_1;
            },
            function (persistence_manager_1_1) {
                persistence_manager_1 = persistence_manager_1_1;
            }],
        execute: function() {
            DocumentEditDemoComponent = (function () {
                function DocumentEditDemoComponent(configLoader, datastore, persistenceManager) {
                    this.configLoader = configLoader;
                    this.datastore = datastore;
                    this.persistenceManager = persistenceManager;
                    this.documents = new Array();
                }
                DocumentEditDemoComponent.prototype.clicked = function (id) {
                    var _this = this;
                    if (!this.selectedDocument)
                        return this.changeTo(id);
                    this.persistenceManager.persist(this.selectedDocument).then(function () {
                        _this.changeTo(id);
                    }, function () {
                        console.error("error while persisting object");
                    });
                };
                DocumentEditDemoComponent.prototype.changeTo = function (id) {
                    var _this = this;
                    this.datastore.get(id).then(function (document) {
                        _this.selectedDocument = JSON.parse(JSON.stringify(document));
                    });
                };
                DocumentEditDemoComponent.prototype.ngOnInit = function () {
                    this.loadSampleData();
                    this.configLoader.setProjectConfiguration(DocumentEditDemoComponent.PROJECT_CONFIGURATION_PATH);
                    this.configLoader.setRelationsConfiguration(DocumentEditDemoComponent.RELATIONS_CONFIGURATION_PATH);
                };
                DocumentEditDemoComponent.prototype.loadSampleData = function () {
                    for (var _i = 0, OBJECTS_1 = sample_objects_1.OBJECTS; _i < OBJECTS_1.length; _i++) {
                        var item = OBJECTS_1[_i];
                        this.documents.push(item);
                        this.datastore.update(item);
                    }
                };
                DocumentEditDemoComponent.PROJECT_CONFIGURATION_PATH = 'demo/config/Configuration.json';
                DocumentEditDemoComponent.RELATIONS_CONFIGURATION_PATH = 'demo/config/Relations.json';
                DocumentEditDemoComponent = __decorate([
                    core_1.Component({
                        selector: 'document-edit-demo',
                        templateUrl: 'demo/templates/document-edit-demo.html',
                        directives: [router_deprecated_1.ROUTER_DIRECTIVES, document_edit_component_1.DocumentEditComponent]
                    }), 
                    __metadata('design:paramtypes', [config_loader_1.ConfigLoader, datastore_1.Datastore, persistence_manager_1.PersistenceManager])
                ], DocumentEditDemoComponent);
                return DocumentEditDemoComponent;
            }());
            exports_1("DocumentEditDemoComponent", DocumentEditDemoComponent);
        }
    }
});
