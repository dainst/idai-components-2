System.register(['@angular/core', "@angular/common", "./relation-picker.component"], function(exports_1, context_1) {
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
    var core_1, common_1, relation_picker_component_1;
    var RelationPickerGroupComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (relation_picker_component_1_1) {
                relation_picker_component_1 = relation_picker_component_1_1;
            }],
        execute: function() {
            /**
             * @author Thomas Kleinke
             */
            RelationPickerGroupComponent = (function () {
                function RelationPickerGroupComponent() {
                }
                RelationPickerGroupComponent.prototype.createRelation = function () {
                    if (!this.object[this.field.field])
                        this.object[this.field.field] = [];
                    this.object[this.field.field].push("");
                };
                RelationPickerGroupComponent.prototype.validateNewest = function () {
                    var index = this.object[this.field.field].length - 1;
                    if (!this.object[this.field.field][index] || this.object[this.field.field][index].length == 0) {
                        return false;
                    }
                    else {
                        return true;
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], RelationPickerGroupComponent.prototype, "object", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], RelationPickerGroupComponent.prototype, "field", void 0);
                RelationPickerGroupComponent = __decorate([
                    core_1.Component({
                        selector: 'relation-picker-group',
                        template: "<div *ngFor=\"let relation of object[field.field]; let i = index\">\n    <relation-picker [(object)]=\"object\" [field]=\"field\" [relationIndex]=\"i\"></relation-picker>\n</div>\n<div class=\"circular-button add-relation\"\n     *ngIf=\"!object[field.field] || object[field.field].length == 0 || validateNewest()\"\n     type=\"button\"\n     (click)=\"createRelation()\">+</div>\n\n<!-- Button disabled when waiting for input -->\n<div class=\"circular-button add-relation-disabled\"\n     *ngIf=\"object[field.field] && object[field.field].length > 0 && !validateNewest()\"\n     type=\"button\">+</div>",
                        directives: [common_1.CORE_DIRECTIVES, common_1.COMMON_DIRECTIVES, common_1.FORM_DIRECTIVES, relation_picker_component_1.RelationPickerComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], RelationPickerGroupComponent);
                return RelationPickerGroupComponent;
            }());
            exports_1("RelationPickerGroupComponent", RelationPickerGroupComponent);
        }
    }
});
//# sourceMappingURL=relation-picker-group.component.js.map