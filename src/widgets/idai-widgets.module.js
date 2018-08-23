"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var type_icon_1 = require("./type-icon");
var IdaiWidgetsModule = /** @class */ (function () {
    function IdaiWidgetsModule() {
    }
    IdaiWidgetsModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                ng_bootstrap_1.NgbModule,
                forms_1.FormsModule
            ],
            declarations: [
                type_icon_1.TypeIconComponent
            ],
            exports: [
                type_icon_1.TypeIconComponent
            ]
        })
    ], IdaiWidgetsModule);
    return IdaiWidgetsModule;
}());
exports.IdaiWidgetsModule = IdaiWidgetsModule;
//# sourceMappingURL=idai-widgets.module.js.map