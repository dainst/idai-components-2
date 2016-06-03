System.register(['@angular/core', "./persistence-manager", "@angular/common", "./project-configuration", "./relation-picker-group.component", "./valuelist.component", "../core-services/messages", "./relations-configuration", "../core-services/md"], function(exports_1, context_1) {
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
    var core_1, persistence_manager_1, common_1, project_configuration_1, relation_picker_group_component_1, valuelist_component_1, messages_1, relations_configuration_1, md_1;
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
            function (project_configuration_1_1) {
                project_configuration_1 = project_configuration_1_1;
            },
            function (relation_picker_group_component_1_1) {
                relation_picker_group_component_1 = relation_picker_group_component_1_1;
            },
            function (valuelist_component_1_1) {
                valuelist_component_1 = valuelist_component_1_1;
            },
            function (messages_1_1) {
                messages_1 = messages_1_1;
            },
            function (relations_configuration_1_1) {
                relations_configuration_1 = relations_configuration_1_1;
            },
            function (md_1_1) {
                md_1 = md_1_1;
            }],
        execute: function() {
            /**
             * @author Jan G. Wieners
             * @author Thomas Kleinke
             * @author Daniel de Oliveira
             */
            ObjectEditComponent = (function () {
                function ObjectEditComponent(persistenceManager, messages) {
                    this.persistenceManager = persistenceManager;
                    this.messages = messages;
                }
                ObjectEditComponent.prototype.ngOnInit = function () {
                    this.setFieldsForObjectType(); // bad, this is necessary for testing
                };
                ObjectEditComponent.prototype.setType = function (type) {
                    this.object.type = type;
                    this.setFieldsForObjectType();
                };
                ObjectEditComponent.prototype.setFieldsForObjectType = function () {
                    if (this.object == undefined)
                        return;
                    if (!this.projectConfiguration)
                        return;
                    this.fieldsForObjectType = this.projectConfiguration.getFields(this.object.type);
                };
                ObjectEditComponent.prototype.ngOnChanges = function () {
                    if (this.object && this.projectConfiguration && this.relationsConfiguration) {
                        this.persistenceManager.setRelationsConfiguration(this.relationsConfiguration);
                        this.persistenceManager.setOldVersion(this.object);
                        this.setFieldsForObjectType();
                        this.types = this.projectConfiguration.getTypes();
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
                    __metadata('design:type', project_configuration_1.ProjectConfiguration)
                ], ObjectEditComponent.prototype, "projectConfiguration", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', relations_configuration_1.RelationsConfiguration)
                ], ObjectEditComponent.prototype, "relationsConfiguration", void 0);
                ObjectEditComponent = __decorate([
                    core_1.Component({
                        directives: [common_1.FORM_DIRECTIVES, common_1.CORE_DIRECTIVES, common_1.COMMON_DIRECTIVES, relation_picker_group_component_1.RelationPickerGroupComponent, valuelist_component_1.ValuelistComponent],
                        selector: 'object-edit',
                        templateUrl: 'lib/templates/object-edit.html'
                    }), 
                    __metadata('design:paramtypes', [persistence_manager_1.PersistenceManager, messages_1.Messages])
                ], ObjectEditComponent);
                return ObjectEditComponent;
            }());
            exports_1("ObjectEditComponent", ObjectEditComponent);
        }
    }
});
//# sourceMappingURL=object-edit.component.js.map