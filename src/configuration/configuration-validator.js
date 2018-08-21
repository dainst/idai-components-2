"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var configuration_errors_1 = require("./configuration-errors");
/**
 * @author F.Z.
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
var ConfigurationValidator = (function () {
    function ConfigurationValidator() {
    }
    /**
     * Searches for missing mandatory types or duplicate types.
     * Returns on the first occurrence of either one.
     *
     * @param configuration
     * @returns {Array<string>} msgWithParams. undefined if no error.
     */
    ConfigurationValidator.prototype.go = function (configuration) {
        var msgs = [];
        var invalidTypeErrors = ConfigurationValidator.findInvalidType(configuration.types);
        if (invalidTypeErrors)
            msgs = msgs.concat(invalidTypeErrors);
        var duplicateTypeErrors = ConfigurationValidator.findDuplicateType(configuration.types);
        if (duplicateTypeErrors)
            msgs = msgs.concat(duplicateTypeErrors);
        var missingParentTypeErrors = ConfigurationValidator.findMissingParentType(configuration.types);
        if (missingParentTypeErrors)
            msgs = msgs.concat(missingParentTypeErrors);
        var missingRelationTypeErrors = ConfigurationValidator.findMissingRelationType(configuration.relations, configuration.types);
        if (missingRelationTypeErrors)
            msgs = msgs.concat(missingRelationTypeErrors);
        var fieldError = ConfigurationValidator.validateFieldDefinitions(configuration.types);
        if (fieldError.length)
            msgs = msgs.concat(fieldError);
        return msgs.concat(this.custom(configuration));
    };
    ConfigurationValidator.prototype.custom = function (configuration) {
        return [];
    };
    /**
     * Check if all necessary fields are given and have the right type
     * (Might be refactored to use some kind of runtime type checking)
     *
     * @param types
     * @returns {string} invalidType. undefined if no error.
     */
    ConfigurationValidator.findInvalidType = function (types) {
        return types
            .filter(function (type) { return !type.type || !(typeof type.type == 'string'); })
            .reduce(this.addErrMsg(this.invalidType), []);
    };
    ConfigurationValidator.findDuplicateType = function (types) {
        var o = {};
        return types
            .filter(function (type) {
            if (o[type.type])
                return true;
            o[type.type] = true;
            return false;
        })
            .reduce(this.addErrMsg(this.duplicateType), []);
    };
    ConfigurationValidator.findMissingParentType = function (types) {
        return types
            .filter(function (type) {
            return type.parent &&
                types.map(function (type) { return type.type; }).indexOf(type.parent) == -1;
        })
            .reduce(this.addErrMsg(this.missingParentType), []);
    };
    ConfigurationValidator.findMissingRelationType = function (relations, types) {
        var msgs = [];
        var typeNames = types.map(function (type) { return type.type; });
        if (relations)
            for (var _i = 0, relations_1 = relations; _i < relations_1.length; _i++) {
                var relation = relations_1[_i];
                for (var _a = 0, _b = relation.domain; _a < _b.length; _a++) {
                    var type = _b[_a];
                    if (typeNames.indexOf(type) == -1)
                        msgs.push([configuration_errors_1.ConfigurationErrors.INVALID_CONFIG_MISSINGRELATIONTYPE, type]);
                }
                for (var _c = 0, _d = relation.range; _c < _d.length; _c++) {
                    var type = _d[_c];
                    if (typeNames.indexOf(type) == -1 && type != 'Project')
                        msgs.push([configuration_errors_1.ConfigurationErrors.INVALID_CONFIG_MISSINGRELATIONTYPE, type]);
                }
            }
        return msgs;
    };
    ConfigurationValidator.validateFieldDefinitions = function (types) {
        var msgs = [];
        var fieldDefs = [].concat.apply([], types.map(function (type) { return type.fields; }));
        for (var _i = 0, fieldDefs_1 = fieldDefs; _i < fieldDefs_1.length; _i++) {
            var fieldDef = fieldDefs_1[_i];
            if (!fieldDef.hasOwnProperty('name'))
                msgs.push([configuration_errors_1.ConfigurationErrors.INVALID_CONFIG_MISSINGFIELDNAME, JSON.stringify(fieldDef)]);
            if (!fieldDef.hasOwnProperty('inputType'))
                fieldDef.inputType = 'input';
            if (ConfigurationValidator.VALID_INPUT_TYPES.indexOf(fieldDef.inputType) == -1)
                msgs.push([configuration_errors_1.ConfigurationErrors.VALIDATION_ERROR_INVALIDINPUTTYPE, fieldDef.name,
                    fieldDef.inputType, ConfigurationValidator.VALID_INPUT_TYPES.join(', ')]);
            if (ConfigurationValidator.VALUELIST_INPUT_TYPES.indexOf(fieldDef.inputType) != -1
                && (!fieldDef.hasOwnProperty('valuelist')
                    || !Array.isArray(fieldDef.valuelist)
                    || fieldDef.valuelist.length == 0)) {
                msgs.push([configuration_errors_1.ConfigurationErrors.INVALID_CONFIG_MISSINGVALUELIST, fieldDef.name]);
            }
        }
        return msgs;
    };
    return ConfigurationValidator;
}());
ConfigurationValidator.VALID_INPUT_TYPES = ['input', 'inputs', 'text', 'dropdown', 'dropdownRange', 'radio', 'checkboxes',
    'multiselect', 'unsignedInt', 'float', 'unsignedFloat', 'dating', 'hasPeriod', 'dimension', 'boolean', 'date'];
ConfigurationValidator.VALUELIST_INPUT_TYPES = ['dropdown', 'radio', 'checkboxes', 'multiselect'];
ConfigurationValidator.addErrMsg = function (errFun) {
    return function (msgs, type) {
        msgs.push(errFun(type));
        return msgs;
    };
};
ConfigurationValidator.missingParentType = function (type) {
    return [configuration_errors_1.ConfigurationErrors.INVALID_CONFIG_MISSINGPARENTTYPE, type.parent];
};
ConfigurationValidator.duplicateType = function (type) {
    return [configuration_errors_1.ConfigurationErrors.INVALID_CONFIG_DUPLICATETYPE, type.type];
};
ConfigurationValidator.multipleUseOfDating = function (type) {
    return [configuration_errors_1.ConfigurationErrors.INVALID_CONFIG_MULTIPLEUSEOFDATING, type.type];
};
ConfigurationValidator.invalidType = function (type) {
    return [configuration_errors_1.ConfigurationErrors.INVALID_CONFIG_INVALIDTYPE, JSON.stringify(type)];
};
exports.ConfigurationValidator = ConfigurationValidator;
//# sourceMappingURL=configuration-validator.js.map