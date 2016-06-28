System.register(['@angular/core', "@angular/common", "./document-edit-change-monitor"], function(exports_1, context_1) {
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
    var core_1, common_1, document_edit_change_monitor_1;
    var FieldlistComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (document_edit_change_monitor_1_1) {
                document_edit_change_monitor_1 = document_edit_change_monitor_1_1;
            }],
        execute: function() {
            /**
             * @author Daniel de Oliveira
             */
            FieldlistComponent = (function () {
                function FieldlistComponent(saveService) {
                    this.saveService = saveService;
                }
                FieldlistComponent.prototype.markAsChanged = function () {
                    this.saveService.setChanged();
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], FieldlistComponent.prototype, "resource", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], FieldlistComponent.prototype, "fieldDefinition", void 0);
                FieldlistComponent = __decorate([
                    core_1.Component({
                        selector: 'fieldlist',
                        template: "<div>\n        <ul>\n            <li *ngFor=\"let item of resource[fieldDefinition.field]; let i=index\">\n                <div>{{item}}</div>\n            </li>\n      \n        </ul>\n    </div>",
                        directives: [common_1.CORE_DIRECTIVES, common_1.COMMON_DIRECTIVES, common_1.FORM_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [document_edit_change_monitor_1.DocumentEditChangeMonitor])
                ], FieldlistComponent);
                return FieldlistComponent;
            }());
            exports_1("FieldlistComponent", FieldlistComponent);
        }
    }
});
//# sourceMappingURL=fieldlist.component.js.map