"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsfun_1 = require("tsfun");
/**
 * Used to validate to configuration in the form it comes from the user, i.e.
 * as Configuration.json. This means before the preprocess step has been executed,
 * where additional hardcoded definitions from app configurators may come in.
 *
 * @author Daniel de Oliveira
 */
var IdaiFieldPrePreprocessConfigurationValidator = /** @class */ (function () {
    function IdaiFieldPrePreprocessConfigurationValidator() {
    }
    /**
     * Starting with 2.1.8 of idai-field we forbid visible and editable
     * to be configured by the user directly via Configuration.json.
     * Instead we offer to configure that separately wie Hidden.json.
     *
     * This is to reduce the necessity to have different configurations which have to be
     * tracked, when the only thing they differ in is the visitiliy/editability settings.
     */
    IdaiFieldPrePreprocessConfigurationValidator.prototype.go = function (appConfiguration) {
        if (!appConfiguration.types)
            return [];
        return IdaiFieldPrePreprocessConfigurationValidator.checkForForbiddenIsRecordedIns(appConfiguration)
            .concat(IdaiFieldPrePreprocessConfigurationValidator.checkForExtraneousFieldsInRelations(appConfiguration))
            .concat(IdaiFieldPrePreprocessConfigurationValidator.checkForExtraneousFieldsInTypes(appConfiguration));
    };
    IdaiFieldPrePreprocessConfigurationValidator.checkForExtraneousFieldsInTypes = function (appConfiguration) {
        var allowedFields = ['inputType', 'name', 'valuelist', 'positionValues', 'unitSuffix'];
        var errs = [];
        for (var _i = 0, _a = Object.keys(appConfiguration.types); _i < _a.length; _i++) {
            var typeName = _a[_i];
            var type = appConfiguration.types[typeName];
            if (type.fields) {
                for (var _b = 0, _c = Object.keys(type.fields); _b < _c.length; _b++) {
                    var fieldName = _c[_b];
                    var field = type.fields[fieldName];
                    var diff = tsfun_1.subtract(allowedFields)(Object.keys(field));
                    if (diff.length > 0)
                        errs.push(['field(s) not allowed:', diff]);
                }
            }
        }
        return errs;
    };
    IdaiFieldPrePreprocessConfigurationValidator.checkForExtraneousFieldsInRelations = function (appConfiguration) {
        var allowedFields = ['domain', 'range', 'name', 'inverse', 'sameOperation'];
        return appConfiguration.relations
            .reduce(function (errs, relation) {
            if (tsfun_1.subtract(allowedFields)(Object.keys(relation)).length > 0) {
                errs.push(['relation field not allowed in ', relation.name]);
            }
            return errs;
        }, []);
    };
    IdaiFieldPrePreprocessConfigurationValidator.checkForForbiddenIsRecordedIns = function (appConfiguration) {
        var _this = this;
        var errs = appConfiguration.relations
            .filter(function (relation) { return relation.name === 'isRecordedIn'; })
            .reduce(function (errs, relation) {
            var err = _this.evaluateRelationDomain(relation, appConfiguration);
            if (err)
                errs.push(err);
            return errs;
        }, []);
        return errs ? errs : [];
    };
    IdaiFieldPrePreprocessConfigurationValidator.evaluateRelationDomain = function (relation, appConfiguration) {
        if (tsfun_1.intersection([relation.domain, this.imageTypes(appConfiguration)]).length > 0) {
            return ['image type/ isRecordedIn must not be defined manually', relation];
        }
        else if (tsfun_1.intersection([relation.domain, this.operationSubtypes(appConfiguration)]).length > 0) {
            return ['operation subtype as domain type/ isRecordedIn must not be defined manually', relation];
        }
        else {
            if (tsfun_1.subtract(this.operationSubtypes(appConfiguration))(relation.domain).length > 0) {
                for (var _i = 0, _a = relation.range; _i < _a.length; _i++) {
                    var rangeType = _a[_i];
                    if (!this.operationSubtypes(appConfiguration).includes(rangeType)) {
                        return ['isRecordedIn - only operation subtypes allowed in range', relation];
                    }
                }
            }
        }
    };
    IdaiFieldPrePreprocessConfigurationValidator.operationSubtypes = function (appConfiguration) {
        return Object.keys(appConfiguration.types)
            .filter(function (typeName) { return appConfiguration.types[typeName].parent === 'Operation'; });
    };
    IdaiFieldPrePreprocessConfigurationValidator.imageTypes = function (appConfiguration) {
        return Object.keys(appConfiguration.types)
            .filter(function (typeName) { return appConfiguration.types[typeName].parent === 'Image'; })
            .concat(['Image']);
    };
    return IdaiFieldPrePreprocessConfigurationValidator;
}());
exports.IdaiFieldPrePreprocessConfigurationValidator = IdaiFieldPrePreprocessConfigurationValidator;
//# sourceMappingURL=idai-field-pre-preprocess-configuration-validator.js.map