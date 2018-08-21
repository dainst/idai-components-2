"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var resource_1 = require("../../model/core/resource");
var project_configuration_1 = require("../../configuration/project-configuration");
var tsfun_1 = require("tsfun");
var predicates_1 = require("tsfun/src/predicates");
var FieldsViewComponent = FieldsViewComponent_1 = (function () {
    function FieldsViewComponent(projectConfiguration) {
        this.projectConfiguration = projectConfiguration;
    }
    FieldsViewComponent.prototype.ngOnChanges = function () {
        this.fields = [];
        if (this.resource)
            this.processFields(this.resource);
    };
    FieldsViewComponent.prototype.isBoolean = function (value) {
        return typeof value === 'boolean';
    };
    FieldsViewComponent.prototype.processFields = function (resource) {
        var fieldNames = this.projectConfiguration
            .getFieldDefinitions(resource.type)
            .map(tsfun_1.to('name'))
            .concat(['hasPeriodBeginning', 'hasPeriodEnd']);
        for (var _i = 0, fieldNames_1 = fieldNames; _i < fieldNames_1.length; _i++) {
            var fieldName = fieldNames_1[_i];
            if (fieldName === 'relations')
                continue;
            if (resource[fieldName] === undefined)
                continue;
            if (fieldName === 'hasPeriod') {
                this.fields.push({
                    name: ('Grobdatierung' + (!predicates_1.isUndefinedOrEmpty(resource['hasPeriodEnd']) ? ' (von)' : '')),
                    value: FieldsViewComponent_1.getValue(resource, fieldName),
                    isArray: false
                });
                continue;
            }
            if (fieldName === 'hasPeriodBeginning') {
                this.fields.push({
                    name: ('Grobdatierung' + (!predicates_1.isUndefinedOrEmpty(resource['hasPeriodEnd']) ? ' (von)' : '')),
                    value: FieldsViewComponent_1.getValue(resource, fieldName),
                    isArray: false
                });
                continue;
            }
            if (fieldName === 'hasPeriodEnd') {
                this.fields.push({
                    name: 'Grobdatierung (bis)',
                    value: FieldsViewComponent_1.getValue(resource, fieldName),
                    isArray: false
                });
                continue;
            }
            if (!this.projectConfiguration.isVisible(resource.type, fieldName))
                continue;
            this.fields.push({
                name: this.projectConfiguration.getFieldDefinitionLabel(resource.type, fieldName),
                value: FieldsViewComponent_1.getValue(resource, fieldName),
                isArray: Array.isArray(resource[fieldName])
            });
        }
    };
    FieldsViewComponent.getValue = function (resource, fieldName) {
        if (typeof resource[fieldName] === 'string') {
            return resource[fieldName]
                .replace(/^\s+|\s+$/g, '')
                .replace(/\n/g, '<br>');
        }
        else {
            return resource[fieldName];
        }
    };
    return FieldsViewComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], FieldsViewComponent.prototype, "resource", void 0);
FieldsViewComponent = FieldsViewComponent_1 = __decorate([
    core_1.Component({
        selector: 'fields-view',
        moduleId: module.id,
        templateUrl: './fields-view.html'
    })
    /**
     * Shows fields of a document.
     *
     * @author Thomas Kleinke
     * @author Sebastian Cuy
     */
    ,
    __metadata("design:paramtypes", [project_configuration_1.ProjectConfiguration])
], FieldsViewComponent);
exports.FieldsViewComponent = FieldsViewComponent;
var FieldsViewComponent_1;
//# sourceMappingURL=fields-view.component.js.map