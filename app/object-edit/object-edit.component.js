System.register(['@angular/core', "../core-services/persistence-manager", "@angular/common", "../core-services/project-configuration", "./relation-picker-group.component", "./valuelist.component", "../core-services/messages", "./relations-provider", "../md"], function(exports_1, context_1) {
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
    var core_1, persistence_manager_1, common_1, project_configuration_1, relation_picker_group_component_1, valuelist_component_1, messages_1, relations_provider_1, md_1;
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
            function (relations_provider_1_1) {
                relations_provider_1 = relations_provider_1_1;
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
                function ObjectEditComponent(persistenceManager, messages, relationsProvider // used from within template
                    ) {
                    this.persistenceManager = persistenceManager;
                    this.messages = messages;
                    this.relationsProvider = relationsProvider;
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
                    if (this.object && this.projectConfiguration) {
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
                ObjectEditComponent = __decorate([
                    core_1.Component({
                        directives: [common_1.FORM_DIRECTIVES, common_1.CORE_DIRECTIVES, common_1.COMMON_DIRECTIVES, relation_picker_group_component_1.RelationPickerGroupComponent, valuelist_component_1.ValuelistComponent],
                        selector: 'object-edit',
                        template: "<div *ngIf=\"object\">\n    \n    <div *ngIf=\"!object.type\" id=\"object-create\">\n        <section>\n            <header >\n                <h1 id=\"create-object-heading\">\n                    <span class=\"mdi mdi-blur\"></span>\n                    New Object\n                </h1>\n            </header>\n            <main>\n                <div class=\"panel panel-default\">\n                    <div class=\"panel-heading\">\n                        Please choose the object type.\n                    </div>\n                    <button *ngFor=\"let type of types; let index = index\" (mousedown)=\"setType(type)\"\n                            type=\"button\" id=\"create-object-option-{{index}}\" class=\"list-group-item\">{{type}}</button>\n                </div>\n            </main>\n        </section>\n    </div>\n\n    <div *ngIf=\"object.type\"\n         id=\"object-edit\">\n\n        <section>\n            <header>\n                <h1 id=\"object-type-heading\">\n                    <span class=\"mdi mdi-blur\"></span>\n                    {{object.type}}\n                    <button class=\"btn btn-default pull-right\" id=\"object-edit-button-save-object\"\n                            style=\"margin-right: 5px; margin-top: 5px;\" (click)=\"save()\">Speichern</button>\n                </h1>\n            </header>\n            <main>\n                <form>\n\n                    <!-- Basic Object Information -->\n                    <div class=\"form-group\">\n                        <label id=\"identifier\">{{object.type}} Identifier</label>\n                        <input id=\"object-edit-input-identifier\" [(ngModel)]=\"object.identifier\" (keyup)=\"markAsChanged()\"\n                               class=\"form-control\"\n                               aria-describedby=\"identifier\">\n                    </div>\n                    <div class=\"form-group\">\n                        <label id=\"title\">{{object.type}} Title</label>\n                        <input id=\"object-edit-input-title\" [(ngModel)]=\"object.title\" (keyup)=\"markAsChanged()\"\n                               class=\"form-control\"\n                               aria-describedby=\"title\">\n                    </div>\n\n                    <!-- Diverse Object Informations -->\n                    <div *ngFor=\"let field of fieldsForObjectType\">\n                        <div *ngIf=\"field\" class=\"form-group\">\n                            <label *ngIf=\"field.label\">{{field.label}}</label>\n                            <label *ngIf=\"!field.label\">{{field.field}}</label>\n                            <div *ngIf=\"!field.valuelist && !field.multiline\">\n                                <input [(ngModel)]=\"object[field.field]\" (keyup)=\"markAsChanged()\" class=\"form-control\">\n                            </div>\n                            <div *ngIf=\"field.multiline\">\n                                <textarea [(ngModel)]=\"object[field.field]\" (keyup)=\"markAsChanged()\"\n                                          class=\"form-control\" rows=\"5\"></textarea>\n                            </div>\n                            <div *ngIf=\"field.valuelist && !field.multivalue\">\n                                <select [(ngModel)]=\"object[field.field]\" (change)=\"markAsChanged()\" class=\"form-control\">\n                                    <option *ngFor=\"let item of field.valuelist\" value=\"{{item}}\">{{item}}</option>\n                                </select>\n                            </div>\n                            <valuelist *ngIf=\"field.valuelist && field.multivalue\" [(object)]=\"object\"\n                                       [field]=\"field\"></valuelist>\n                        </div>\n                    </div>\n\n                    <!-- Relations -->\n                    <div class=\"panel panel-default\">\n                        <div class=\"panel-heading\">\n                            <h3 class=\"panel-title\">Relationen</h3>\n                        </div>\n                        <ul class=\"list-group\">\n                            <li *ngFor=\"let relationField of relationsProvider.getRelationFields()\" class=\"list-group-item\">\n                                <label *ngIf=\"relationField.label\">{{relationField.label}}</label>\n                                <label *ngIf=\"!relationField.label\">{{relationField.field}}</label>\n                                <relation-picker-group [(object)]=\"object\" [field]=\"relationField\"></relation-picker-group>\n                            </li>\n                        </ul>\n                    </div>\n                </form>\n\n            </main>\n\n        </section>\n\n    </div>\n\n</div>"
                    }), 
                    __metadata('design:paramtypes', [persistence_manager_1.PersistenceManager, messages_1.Messages, relations_provider_1.RelationsProvider])
                ], ObjectEditComponent);
                return ObjectEditComponent;
            }());
            exports_1("ObjectEditComponent", ObjectEditComponent);
        }
    }
});
//# sourceMappingURL=object-edit.component.js.map