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
var configuration_validator_1 = require("../../core/configuration/configuration-validator");
var configuration_errors_1 = require("../../core/configuration/configuration-errors");
/**
 * @author Thomas Kleinke
 * @author Daniel de Oliveira
 */
var IdaiFieldConfigurationValidator = (function (_super) {
    __extends(IdaiFieldConfigurationValidator, _super);
    function IdaiFieldConfigurationValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IdaiFieldConfigurationValidator.prototype.custom = function (configuration) {
        var msgs = [];
        var mandatoryRelationsError = IdaiFieldConfigurationValidator.
            validateMandatoryRelations(configuration.relations, configuration.types);
        if (mandatoryRelationsError.length)
            msgs = msgs.concat(mandatoryRelationsError);
        return msgs;
    };
    /**
     * idai-field projects must have one or more types whose isRecordedIn relation
     * points to the Project Type. For each of these types, there must be at least
     * one type pointing to it with the isRecordedIn relation. This is nececarry
     * for the views to work
     *
     * @param relations
     * @param types
     * @returns {Array}
     */
    IdaiFieldConfigurationValidator.validateMandatoryRelations = function (relations, types) {
        var msgs = [];
        var recordedInRelations = {};
        if (relations)
            for (var _i = 0, relations_1 = relations; _i < relations_1.length; _i++) {
                var relation = relations_1[_i];
                if (relation.name == 'isRecordedIn') {
                    for (var _a = 0, _b = relation.range; _a < _b.length; _a++) {
                        var type = _b[_a];
                        recordedInRelations[type] = relation.domain;
                    }
                }
            }
        if ('Project' in recordedInRelations) {
            for (var _c = 0, _d = recordedInRelations['Project']; _c < _d.length; _c++) {
                var type = _d[_c];
                var isAbstract = false;
                for (var _e = 0, types_1 = types; _e < types_1.length; _e++) {
                    var t = types_1[_e];
                    if (t.type == type && t.abstract) {
                        isAbstract = true;
                    }
                }
                if (isAbstract)
                    continue;
                if (!(type in recordedInRelations) || !recordedInRelations[type]
                    || recordedInRelations[type].length == 0) {
                    msgs.push([configuration_errors_1.ConfigurationErrors.VALIDATION_ERROR_INCOMPLETERECORDEDIN, type]);
                }
            }
        }
        else {
            msgs.push([configuration_errors_1.ConfigurationErrors.VALIDATION_ERROR_NOPROJECTRECORDEDIN]);
        }
        return msgs;
    };
    return IdaiFieldConfigurationValidator;
}(configuration_validator_1.ConfigurationValidator));
exports.IdaiFieldConfigurationValidator = IdaiFieldConfigurationValidator;
//# sourceMappingURL=idai-field-configuration-validator.js.map