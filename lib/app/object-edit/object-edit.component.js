System.register(['@angular/core', "./persistence-manager", "@angular/common", "./relation-picker-group.component", "./valuelist.component", "./fieldlist.component", "./localized.component", "../core-services/messages", "../core-services/md", "./config-loader"], function(exports_1, context_1) {
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
    var core_1, persistence_manager_1, common_1, relation_picker_group_component_1, valuelist_component_1, fieldlist_component_1, localized_component_1, messages_1, md_1, config_loader_1;
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
            function (relation_picker_group_component_1_1) {
                relation_picker_group_component_1 = relation_picker_group_component_1_1;
            },
            function (valuelist_component_1_1) {
                valuelist_component_1 = valuelist_component_1_1;
            },
            function (fieldlist_component_1_1) {
                fieldlist_component_1 = fieldlist_component_1_1;
            },
            function (localized_component_1_1) {
                localized_component_1 = localized_component_1_1;
            },
            function (messages_1_1) {
                messages_1 = messages_1_1;
            },
            function (md_1_1) {
                md_1 = md_1_1;
            },
            function (config_loader_1_1) {
                config_loader_1 = config_loader_1_1;
            }],
        execute: function() {
            /**
             * @author Jan G. Wieners
             * @author Thomas Kleinke
             * @author Daniel de Oliveira
             */
            ObjectEditComponent = (function () {
                function ObjectEditComponent(persistenceManager, messages, configLoader) {
                    this.persistenceManager = persistenceManager;
                    this.messages = messages;
                    this.configLoader = configLoader;
                }
                ObjectEditComponent.prototype.ngOnInit = function () {
                    // this.setFieldsForObjectType(); // bad, this is necessary for testing
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
                    if (this.object) {
                        this.persistenceManager.setOldVersion(this.object);
                        this.setFieldsForObjectType(this.object, this.projectConfiguration);
                    }
                };
                /**
                 * Saves the object to the local datastore.
                 */
                ObjectEditComponent.prototype.save = function () {
                    var _this = this;
                    this.messages.clear();
                    this.persistenceManager.load(this.object);
                    this.persistenceManager.persist().then(function () {
                        _this.persistenceManager.setOldVersion(_this.object);
                        _this.messages.add(md_1.MD.OBJLIST_SAVE_SUCCESS);
                    }, function (errors) {
                        if (errors) {
                            for (var i in errors) {
                                _this.messages.add(errors[i]);
                            }
                        }
                    });
                };
                ObjectEditComponent.prototype.markAsChanged = function () {
                    this.persistenceManager.load(this.object);
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
                            relation_picker_group_component_1.RelationPickerGroupComponent,
                            valuelist_component_1.ValuelistComponent,
                            fieldlist_component_1.FieldlistComponent,
                            localized_component_1.LocalizedComponent
                        ],
                        selector: 'object-edit',
                        templateUrl: 'lib/templates/object-edit.html'
                    }), 
                    __metadata('design:paramtypes', [persistence_manager_1.PersistenceManager, messages_1.Messages, config_loader_1.ConfigLoader])
                ], ObjectEditComponent);
                return ObjectEditComponent;
            }());
            exports_1("ObjectEditComponent", ObjectEditComponent);
        }
    }
});
//# sourceMappingURL=object-edit.component.js.map