"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
var Preprocessing;
(function (Preprocessing) {
    function addCustomFields(configuration, typeName, fields) {
        var type = configuration.types[typeName];
        if (!type)
            return;
        Object.keys(fields).forEach(function (fieldName) {
            var field = { name: fieldName };
            Object.assign(field, fields[fieldName]);
            type.fields[fieldName] = field;
        });
    }
    Preprocessing.addCustomFields = addCustomFields;
    function applyLanguage(configuration, language) {
        if (language.types) {
            for (var _i = 0, _a = Object.keys(language.types); _i < _a.length; _i++) {
                var langConfTypeName = _a[_i];
                for (var _b = 0, _c = Object.keys(configuration.types); _b < _c.length; _b++) {
                    var confTypeName = _c[_b];
                    if (confTypeName !== langConfTypeName)
                        continue;
                    var confType = configuration.types[confTypeName];
                    var langConfType = language.types[langConfTypeName];
                    if (langConfType.label)
                        confType.label = langConfType.label;
                    if (langConfType.fields) {
                        for (var _d = 0, _e = Object.keys(langConfType.fields); _d < _e.length; _d++) {
                            var langConfFieldName = _e[_d];
                            for (var _f = 0, _g = Object.keys(confType.fields); _f < _g.length; _f++) {
                                var confFieldName = _g[_f];
                                if (confFieldName !== langConfFieldName)
                                    continue;
                                var confField = confType.fields[confFieldName];
                                var langConfField = langConfType.fields[langConfFieldName];
                                if (langConfField.label)
                                    confField.label = langConfField.label;
                                if (langConfField.description)
                                    confField.description = langConfField.description;
                            }
                        }
                    }
                }
            }
        }
        if (language.relations) {
            for (var _h = 0, _j = Object.keys(language.relations); _h < _j.length; _h++) {
                var langConfRelationKey = _j[_h];
                for (var _k = 0, _l = configuration.relations; _k < _l.length; _k++) {
                    var confRelation = _l[_k];
                    if (confRelation.name !== langConfRelationKey)
                        continue;
                    var langConfRelation = language.relations[langConfRelationKey];
                    if (langConfRelation.label)
                        confRelation.label = langConfRelation.label;
                }
            }
        }
    }
    Preprocessing.applyLanguage = applyLanguage;
    function applySearchConfiguration(configuration, searchConfiguration) {
        Object.keys(searchConfiguration).forEach(function (typeName) {
            var type = configuration.types[typeName];
            if (!type)
                return;
            applySearchConfigurationForType(searchConfiguration, type, typeName, 'fulltext', 'fulltextIndexed');
            applySearchConfigurationForType(searchConfiguration, type, typeName, 'constraint', 'constraintIndexed');
        });
    }
    Preprocessing.applySearchConfiguration = applySearchConfiguration;
    function applyPeriodConfiguration(configuration, periodConfiguration) {
        Object.keys(configuration.types).forEach(function (typeName) {
            var type = configuration.types[typeName];
            if (!type)
                return;
            Object.keys(type.fields)
                .filter(function (field) { return field === 'hasPeriod'; })
                .forEach(function (field) { return type.fields[field].valuelist = periodConfiguration.valuelist; });
        });
    }
    Preprocessing.applyPeriodConfiguration = applyPeriodConfiguration;
    function applySearchConfigurationForType(searchConfiguration, type, typeName, indexType, indexFieldName) {
        var fulltextFieldNames = searchConfiguration[typeName][indexType];
        if (!fulltextFieldNames)
            return;
        fulltextFieldNames.forEach(function (fieldName) {
            var field = type.fields[fieldName];
            if (field)
                field[indexFieldName] = true;
        });
    }
    function setIsRecordedInVisibilities(configuration) {
        if (!configuration.relations)
            return;
        configuration.relations
            .filter(function (relation) { return relation.name === 'isRecordedIn'; })
            .forEach(function (relation) { return relation.editable = false; });
    }
    Preprocessing.setIsRecordedInVisibilities = setIsRecordedInVisibilities;
    function prepareSameMainTypeResource(configuration) {
        if (!configuration.relations)
            return;
        for (var _i = 0, _a = configuration.relations; _i < _a.length; _i++) {
            var relation = _a[_i];
            if (relation.name === 'isRecordedIn') {
                relation.sameMainTypeResource = false;
                continue;
            }
            relation.sameMainTypeResource = !(relation['sameOperation'] != undefined
                && relation['sameOperation'] === false);
        }
    }
    Preprocessing.prepareSameMainTypeResource = prepareSameMainTypeResource;
    function addExtraFields(configuration, extraFields) {
        for (var _i = 0, _a = Object.keys(configuration.types); _i < _a.length; _i++) {
            var typeName = _a[_i];
            var typeDefinition = configuration.types[typeName];
            if (!typeDefinition.fields)
                typeDefinition.fields = {};
            if (typeDefinition.parent == undefined) {
                _addExtraFields(typeDefinition, extraFields);
            }
            // TODO Check if this is really the right place to do this
            for (var _b = 0, _c = Object.keys(typeDefinition.fields); _b < _c.length; _b++) {
                var fieldName = _c[_b];
                var fieldDefinition = typeDefinition.fields[fieldName];
                if (fieldDefinition.editable == undefined)
                    fieldDefinition.editable = true;
                if (fieldDefinition.visible == undefined)
                    fieldDefinition.visible = true;
            }
        }
    }
    Preprocessing.addExtraFields = addExtraFields;
    function addExtraRelations(configuration, extraRelations) {
        if (!configuration.relations)
            return;
        for (var _i = 0, extraRelations_1 = extraRelations; _i < extraRelations_1.length; _i++) {
            var extraRelation = extraRelations_1[_i];
            var relationAlreadyPresent = false;
            for (var _a = 0, _b = configuration.relations; _a < _b.length; _a++) {
                var relationDefinition = _b[_a];
                if (relationAlreadyExists(relationDefinition, extraRelation)) {
                    relationAlreadyPresent = true;
                }
            }
            if (!relationAlreadyPresent) {
                configuration.relations.splice(0, 0, extraRelation);
                expandInherits(configuration, extraRelation, 'range');
                expandInherits(configuration, extraRelation, 'domain');
                expandOnUndefined(configuration, extraRelation, 'range');
                expandOnUndefined(configuration, extraRelation, 'domain');
            }
        }
    }
    Preprocessing.addExtraRelations = addExtraRelations;
    /**
     * A relation definition is unique for each name/domain pair
     *
     * @param existingRelation
     * @param extraRelation
     * @returns {boolean}
     */
    function relationAlreadyExists(existingRelation, extraRelation) {
        if (existingRelation.name == extraRelation.name) {
            if (existingRelation.domain && extraRelation.domain) {
                if (existingRelation.domain.sort().toString() ==
                    extraRelation.domain.sort().toString())
                    return true;
            }
        }
        return false;
    }
    function expandInherits(configuration, extraRelation, itemSet) {
        if (!extraRelation)
            return;
        if (!extraRelation[itemSet])
            return;
        var itemsNew = [];
        for (var _i = 0, _a = extraRelation[itemSet]; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.indexOf(':inherit') !== -1) {
                for (var _b = 0, _c = Object.keys(configuration.types); _b < _c.length; _b++) {
                    var typeName = _c[_b];
                    var type = configuration.types[typeName];
                    if (type.parent === item.split(':')[0]) {
                        itemsNew.push(typeName);
                    }
                }
                itemsNew.push(item.split(':')[0]);
            }
            else {
                itemsNew.push(item);
            }
        }
        extraRelation[itemSet] = itemsNew;
    }
    function expandOnUndefined(configuration, extraRelation_, itemSet) {
        var extraRelation = extraRelation_;
        if (extraRelation[itemSet] != undefined)
            return;
        var opposite = 'range';
        if (itemSet == 'range')
            opposite = 'domain';
        extraRelation[itemSet] = [];
        for (var _i = 0, _a = Object.keys(configuration.types); _i < _a.length; _i++) {
            var typeName = _a[_i];
            if (extraRelation[opposite].indexOf(typeName) == -1) {
                extraRelation[itemSet].push(typeName);
            }
        }
    }
    function merge(target, source) {
        for (var _i = 0, _a = Object.keys(source); _i < _a.length; _i++) {
            var sourceFieldName = _a[_i];
            if (sourceFieldName === 'fields')
                continue;
            var alreadyPresentInTarget = false;
            for (var _b = 0, _c = Object.keys(target); _b < _c.length; _b++) {
                var targetFieldName = _c[_b];
                if (targetFieldName === sourceFieldName)
                    alreadyPresentInTarget = true;
            }
            if (!alreadyPresentInTarget)
                target[sourceFieldName] = source[sourceFieldName];
        }
    }
    function addExtraTypes(configuration, extraTypes) {
        for (var _i = 0, _a = Object.keys(extraTypes); _i < _a.length; _i++) {
            var extraTypeName = _a[_i];
            var extraType = extraTypes[extraTypeName];
            var typeAlreadyPresent = false;
            for (var _b = 0, _c = Object.keys(configuration.types); _b < _c.length; _b++) {
                var typeName = _c[_b];
                var typeDefinition = configuration.types[typeName];
                if (typeName === extraTypeName) {
                    typeAlreadyPresent = true;
                    merge(typeDefinition, extraType);
                    merge(typeDefinition.fields, extraType.fields);
                }
            }
            if (!typeAlreadyPresent)
                configuration.types[extraTypeName] = extraType;
        }
    }
    Preprocessing.addExtraTypes = addExtraTypes;
    function _addExtraFields(typeDefinition, extraFields) {
        for (var _i = 0, _a = Object.keys(extraFields); _i < _a.length; _i++) {
            var extraFieldName = _a[_i];
            var fieldAlreadyPresent = false;
            for (var _b = 0, _c = Object.keys(typeDefinition.fields); _b < _c.length; _b++) {
                var fieldName = _c[_b];
                if (fieldName === extraFieldName)
                    fieldAlreadyPresent = true;
            }
            if (!fieldAlreadyPresent) {
                typeDefinition.fields[extraFieldName] = Object.assign({}, extraFields[extraFieldName]);
            }
        }
    }
})(Preprocessing = exports.Preprocessing || (exports.Preprocessing = {}));
//# sourceMappingURL=preprocessing.js.map