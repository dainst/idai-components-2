System.register(['@angular/core', '@angular/router-deprecated', '../../lib/app/object-edit/object-edit.component', '../../lib/app/object-edit/config-loader', '../../lib/app/datastore/datastore', "./sample-objects"], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, object_edit_component_1, config_loader_1, datastore_1, sample_objects_1;
    var ObjectEditDemoComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (object_edit_component_1_1) {
                object_edit_component_1 = object_edit_component_1_1;
            },
            function (config_loader_1_1) {
                config_loader_1 = config_loader_1_1;
            },
            function (datastore_1_1) {
                datastore_1 = datastore_1_1;
            },
            function (sample_objects_1_1) {
                sample_objects_1 = sample_objects_1_1;
            }],
        execute: function() {
            ObjectEditDemoComponent = (function () {
                function ObjectEditDemoComponent(configLoader, datastore) {
                    this.configLoader = configLoader;
                    this.datastore = datastore;
                    this.objects = new Array();
                }
                ObjectEditDemoComponent.prototype.clicked = function (id) {
                    var _this = this;
                    this.datastore.get(id).then(function (entity) {
                        _this.selectedObject = JSON.parse(JSON.stringify(entity));
                    });
                };
                ObjectEditDemoComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.loadSampleData();
                    var promises = [];
                    promises.push(this.configLoader.getProjectConfiguration(ObjectEditDemoComponent.PROJECT_CONFIGURATION_PATH));
                    promises.push(this.configLoader.getRelationsConfiguration(ObjectEditDemoComponent.RELATIONS_CONFIGURATION_PATH));
                    Promise.all(promises).then(function (configs) {
                        _this.projectConfiguration = configs[0];
                        _this.relationsConfiguration = configs[1];
                    }, function (errs) { console.error('errs: ', errs); });
                };
                ObjectEditDemoComponent.prototype.loadSampleData = function () {
                    for (var _i = 0, OBJECTS_1 = sample_objects_1.OBJECTS; _i < OBJECTS_1.length; _i++) {
                        var item = OBJECTS_1[_i];
                        this.objects.push(item);
                        this.datastore.update(item);
                    }
                };
                ObjectEditDemoComponent.PROJECT_CONFIGURATION_PATH = 'demo/config/Configuration.json';
                ObjectEditDemoComponent.RELATIONS_CONFIGURATION_PATH = 'demo/config/Relations.json';
                ObjectEditDemoComponent = __decorate([
                    core_1.Component({
                        selector: 'object-edit-demo',
                        templateUrl: 'demo/templates/object-edit-demo.html',
                        directives: [router_deprecated_1.ROUTER_DIRECTIVES, object_edit_component_1.ObjectEditComponent]
                    }), 
                    __metadata('design:paramtypes', [config_loader_1.ConfigLoader, datastore_1.Datastore])
                ], ObjectEditDemoComponent);
                return ObjectEditDemoComponent;
            }());
            exports_1("ObjectEditDemoComponent", ObjectEditDemoComponent);
        }
    }
});
