System.register(['@angular/core', '@angular/router-deprecated', './object-edit/object-edit.component', './core-services/config-loader', './datastore/datastore', "./datastore/sample-objects"], function(exports_1, context_1) {
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
    var AppComponent;
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
            AppComponent = (function () {
                function AppComponent(configLoader, datastore) {
                    this.configLoader = configLoader;
                    this.datastore = datastore;
                    this.e = {};
                }
                AppComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.loadSampleData();
                    this.configLoader.getProjectConfiguration().then(function (pc) {
                        _this.projectConfiguration = pc;
                    });
                };
                AppComponent.prototype.loadSampleData = function () {
                    var promises = [];
                    this.e = sample_objects_1.OBJECTS[0];
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'idai-field-app',
                        templateUrl: 'templates/app.html',
                        directives: [router_deprecated_1.ROUTER_DIRECTIVES, object_edit_component_1.ObjectEditComponent]
                    }), 
                    __metadata('design:paramtypes', [config_loader_1.ConfigLoader, datastore_1.Datastore])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
