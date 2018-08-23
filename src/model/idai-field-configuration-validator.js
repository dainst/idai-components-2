"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var configuration_validator_1 = require("../configuration/configuration-validator");
/**
 * @author Thomas Kleinke
 * @author Daniel de Oliveira
 */
var IdaiFieldConfigurationValidator = /** @class */ (function (_super) {
    __extends(IdaiFieldConfigurationValidator, _super);
    function IdaiFieldConfigurationValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IdaiFieldConfigurationValidator.prototype.custom = function (configuration) {
        return [];
    };
    return IdaiFieldConfigurationValidator;
}(configuration_validator_1.ConfigurationValidator));
exports.IdaiFieldConfigurationValidator = IdaiFieldConfigurationValidator;
//# sourceMappingURL=idai-field-configuration-validator.js.map