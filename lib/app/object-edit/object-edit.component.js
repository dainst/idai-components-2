System.register(['@angular/core', "./persistence-manager", "@angular/common", "./edit-form.component", "./relations-form.component", "./config-loader", "./load-and-save-service"], function(exports_1, context_1) {
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
    var core_1, persistence_manager_1, common_1, edit_form_component_1, relations_form_component_1, config_loader_1, load_and_save_service_1;
    var ObjectEditComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (persistence_manager_1_1) {
                persistence_manager_1 = persistence_manager_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (edit_form_component_1_1) {
                edit_form_component_1 = edit_form_component_1_1;
            },
            function (relations_form_component_1_1) {
                relations_form_component_1 = relations_form_component_1_1;
            },
            function (config_loader_1_1) {
                config_loader_1 = config_loader_1_1;
            },
            function (load_and_save_service_1_1) {
                load_and_save_service_1 = load_and_save_service_1_1;
            }],
        execute: function() {
            /**
             * @author Jan G. Wieners
             * @author Thomas Kleinke
             * @author Daniel de Oliveira
             */
            ObjectEditComponent = (function () {
                function ObjectEditComponent(persistenceManager, configLoader, loadAndSaveService) {
                    this.persistenceManager = persistenceManager;
                    this.configLoader = configLoader;
                    this.loadAndSaveService = loadAndSaveService;
                }
                ObjectEditComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.configLoader.relationsConfiguration().subscribe(function (relationsConfiguration) {
                        _this.relationsConfiguration = relationsConfiguration;
                        _this.persistenceManager.setRelationsConfiguration(relationsConfiguration);
                        _this.relationFields = relationsConfiguration.getRelationFields();
                    });
                    this.configLoader.projectConfiguration().subscribe(function (projectConfiguration) {
                        _this.projectConfiguration = projectConfiguration;
                        _this.setFieldsForObjectType(_this.object, _this.projectConfiguration);
                    });
                };
                ObjectEditComponent.prototype.setType = function (type) {
                    this.object.type = type;
                    this.setFieldsForObjectType(this.object, this.projectConfiguration);
                };
                ObjectEditComponent.prototype.setFieldsForObjectType = function (object, projectConfiguration) {
                    if (object == undefined)
                        return;
                    if (!projectConfiguration)
                        return;
                    this.fieldsForObjectType = projectConfiguration.getFields(object.type);
                    this.types = this.projectConfiguration.getTypes();
                };
                ObjectEditComponent.prototype.ngOnChanges = function () {
                    var _this = this;
                    if (this.object) {
                        this.loadAndSaveService.load(this.object).then(function () {
                            _this.setFieldsForObjectType(_this.object, _this.projectConfiguration);
                        }, function (err) { });
                    }
                };
                ObjectEditComponent.prototype.save = function () {
                    this.loadAndSaveService.save(this.object).then(function () { }, function (err) { });
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ObjectEditComponent.prototype, "object", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], ObjectEditComponent.prototype, "primary", void 0);
                ObjectEditComponent = __decorate([
                    core_1.Component({
                        directives: [
                            common_1.FORM_DIRECTIVES,
                            common_1.CORE_DIRECTIVES,
                            common_1.COMMON_DIRECTIVES,
                            edit_form_component_1.EditFormComponent,
                            relations_form_component_1.RelationsFormComponent
                        ],
                        selector: 'object-edit',
                        templateUrl: 'lib/templates/object-edit.html'
                    }), 
                    __metadata('design:paramtypes', [persistence_manager_1.PersistenceManager, config_loader_1.ConfigLoader, load_and_save_service_1.LoadAndSaveService])
                ], ObjectEditComponent);
                return ObjectEditComponent;
            }());
            exports_1("ObjectEditComponent", ObjectEditComponent);
        }
    }
});
//# sourceMappingURL=object-edit.component.js.map