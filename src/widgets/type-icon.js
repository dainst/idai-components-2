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
var project_configuration_1 = require("../configuration/project-configuration");
var TypeIconComponent = /** @class */ (function () {
    function TypeIconComponent(projectConfiguration) {
        this.projectConfiguration = projectConfiguration;
    }
    TypeIconComponent_1 = TypeIconComponent;
    TypeIconComponent.isColorTooBright = function (c) {
        c = c.substring(1); // strip #
        var rgb = parseInt(c, 16); // convert rrggbb to decimal
        var r = (rgb >> 16) & 0xff; // extract red
        var g = (rgb >> 8) & 0xff; // extract green
        var b = (rgb >> 0) & 0xff; // extract blue
        var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
        return luma > 200;
    };
    TypeIconComponent.prototype.ngOnChanges = function () {
        this.character = this.projectConfiguration.getLabelForType(this.type).substr(0, 1);
        this.color = this.projectConfiguration.getColorForType(this.type);
        this.textColor = TypeIconComponent_1.isColorTooBright(this.color) ? 'black' : 'white';
        this.pxSize = this.size + 'px';
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], TypeIconComponent.prototype, "size", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], TypeIconComponent.prototype, "type", void 0);
    TypeIconComponent = TypeIconComponent_1 = __decorate([
        core_1.Component({
            selector: 'type-icon',
            template: '<div class="type-icon" [style.width]="pxSize" [style.height]="pxSize" [style.font-size]="pxSize" [style.line-height]="pxSize" [style.background-color]="color">' +
                '<span class="character" [style.color]="textColor">{{character}}</span>' +
                '</div>'
        })
        /**
         * @author Sebastian Cuy
         */
        ,
        __metadata("design:paramtypes", [project_configuration_1.ProjectConfiguration])
    ], TypeIconComponent);
    return TypeIconComponent;
    var TypeIconComponent_1;
}());
exports.TypeIconComponent = TypeIconComponent;
//# sourceMappingURL=type-icon.js.map