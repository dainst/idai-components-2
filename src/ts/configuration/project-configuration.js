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
var md_internal_1 = require("../messages/md-internal");
var idai_type_1 = require("./idai-type");
var ProjectConfiguration = ProjectConfiguration_1 = (function () {
    /**
     * @param configuration
     */
    function ProjectConfiguration(configuration) {
        this.typesTree = {};
        this.typesMap = {};
        this.typesList = [];
        this.typesColorMap = {};
        this.relationFields = undefined;
        this.initTypes(configuration);
        this.projectIdentifier = configuration.identifier;
        this.relationFields = configuration.relations;
    }
    ProjectConfiguration.prototype.getInverseRelations = function (relationName) {
        if (!this.relationFields)
            return undefined;
        for (var _i = 0, _a = this.relationFields; _i < _a.length; _i++) {
            var relationField = _a[_i];
            if (relationField['name'] == relationName)
                return relationField['inverse'];
        }
        return undefined;
    };
    ProjectConfiguration.prototype.isRelationProperty = function (propertyName) {
        if (!this.relationFields)
            return false;
        for (var _i = 0, _a = this.relationFields; _i < _a.length; _i++) {
            var relationField = _a[_i];
            if (relationField['name'] == propertyName)
                return true;
        }
        return false;
    };
    ProjectConfiguration.prototype.getAllRelationDefinitions = function () {
        return this.relationFields
            ? this.relationFields
            : [];
    };
    /**
     * @returns {Array<IdaiType>} All types in flat array, ignoring hierarchy
     */
    ProjectConfiguration.prototype.getTypesList = function () {
        return this.typesList;
    };
    /**
     * @returns {Array<IdaiType>} All root types in array, including child types
     */
    ProjectConfiguration.prototype.getTypesTreeList = function () {
        var _this = this;
        return this.typesList.filter(function (type) { return _this.typesTree[type.name] !== undefined; });
    };
    ProjectConfiguration.prototype.getTypesMap = function () {
        return this.typesMap;
    };
    ProjectConfiguration.prototype.getTypesTree = function () {
        return this.typesTree;
    };
    /**
     * Gets the relation definitions available.
     *
     * @param typeName the name of the type to get the relation definitions for.
     * @param isRangeType If true, get relation definitions where the given type is part of the relation's range
     *                    (instead of domain)
     * @param property to give only the definitions with a certain boolean property not set or set to true
     * @returns {Array<RelationDefinition>} the definitions for the type.
     */
    ProjectConfiguration.prototype.getRelationDefinitions = function (typeName, isRangeType, property) {
        if (isRangeType === void 0) { isRangeType = false; }
        if (!this.relationFields)
            return undefined;
        var availableRelationFields = new Array();
        for (var i in this.relationFields) {
            var types = isRangeType ? this.relationFields[i].range : this.relationFields[i].domain;
            if (types.indexOf(typeName) > -1) {
                if (!property ||
                    this.relationFields[i][property] == undefined ||
                    this.relationFields[i][property] == true) {
                    availableRelationFields.push(this.relationFields[i]);
                }
            }
        }
        return availableRelationFields;
    };
    /**
     * @returns {boolean} True if the given domain type is a valid domain type for a relation definition which has the
     * given range type & name
     */
    ProjectConfiguration.prototype.isAllowedRelationDomainType = function (domainTypeName, rangeTypeName, relationName) {
        var relationDefinitions = this.getRelationDefinitions(rangeTypeName, true);
        if (!relationDefinitions)
            return false;
        for (var _i = 0, relationDefinitions_1 = relationDefinitions; _i < relationDefinitions_1.length; _i++) {
            var relationDefinition = relationDefinitions_1[_i];
            if (relationName == relationDefinition.name
                && relationDefinition.domain.indexOf(domainTypeName) > -1)
                return true;
        }
        return false;
    };
    /**
     * @param typeName
     * @returns {any[]} the fields definitions for the type.
     */
    ProjectConfiguration.prototype.getFieldDefinitions = function (typeName) {
        if (!this.typesMap[typeName])
            return [];
        return this.typesMap[typeName].fields;
    };
    ProjectConfiguration.prototype.getLabelForType = function (typeName) {
        if (!this.typesMap[typeName])
            return '';
        return this.typesMap[typeName].label;
    };
    ProjectConfiguration.prototype.getColorForType = function (typeName) {
        return this.typesColorMap[typeName];
    };
    ProjectConfiguration.prototype.getTextColorForType = function (typeName) {
        return ProjectConfiguration_1.isBrightColor(this.getColorForType(typeName)) ? '#000000' : '#ffffff';
    };
    ProjectConfiguration.prototype.getTypeColors = function () {
        return this.typesColorMap;
    };
    ProjectConfiguration.prototype.isMandatory = function (typeName, fieldName) {
        return this.hasProperty(typeName, fieldName, 'mandatory');
    };
    ProjectConfiguration.prototype.isVisible = function (typeName, fieldName) {
        return this.hasProperty(typeName, fieldName, 'visible');
    };
    ProjectConfiguration.prototype.isVisibleRelation = function (relationName, domainType) {
        if (!this.relationFields)
            return false;
        for (var _i = 0, _a = this.relationFields; _i < _a.length; _i++) {
            var relationField = _a[_i];
            if (relationField.name == relationName &&
                relationField.domain.indexOf(domainType) > -1 &&
                relationField.visible != undefined &&
                relationField.visible === false) {
                return false;
            }
        }
        return true;
    };
    /**
     * Should be used only from within components.
     *
     * @param relationName
     * @returns {string}
     */
    ProjectConfiguration.prototype.getRelationDefinitionLabel = function (relationName) {
        var relationFields = this.relationFields;
        return ProjectConfiguration_1.getLabel(relationName, relationFields);
    };
    /**
     * Gets the label for the field if it is defined.
     * Otherwise it returns the fields definitions name.
     *
     * @param typeName
     * @param fieldName
     * @returns {string}
     * @throws {string} with an error description in case the type is not defined.
     */
    ProjectConfiguration.prototype.getFieldDefinitionLabel = function (typeName, fieldName) {
        var fieldDefinitions = this.getFieldDefinitions(typeName);
        if (fieldDefinitions.length == 0)
            throw 'No type definition found for type \'' + typeName + '\'';
        return ProjectConfiguration_1.getLabel(fieldName, fieldDefinitions);
    };
    /**
     * @returns {string} the name of the excavation, if defined.
     *   <code>undefined</code> otherwise.
     */
    ProjectConfiguration.prototype.getProjectIdentifier = function () {
        return this.projectIdentifier;
    };
    ProjectConfiguration.prototype.hasProperty = function (typeName, fieldName, propertyName) {
        if (!this.typesMap[typeName])
            return false;
        var fields = this.typesMap[typeName].fields;
        for (var i in fields) {
            if (fields[i].name == fieldName) {
                if (fields[i][propertyName] == true) {
                    return true;
                }
            }
        }
        return false;
    };
    ProjectConfiguration.prototype.initTypes = function (configuration) {
        for (var _i = 0, _a = configuration.types; _i < _a.length; _i++) {
            var type = _a[_i];
            this.typesMap[type.type] = new idai_type_1.IdaiType(type);
            this.typesColorMap[type.type] = this.generateColorForType(type.type);
        }
        for (var _b = 0, _c = configuration.types; _b < _c.length; _b++) {
            var type = _c[_b];
            if (!type['parent']) {
                this.typesTree[type.type] = this.typesMap[type.type];
            }
            else {
                var parentType = this.typesMap[type.parent];
                if (parentType == undefined)
                    throw md_internal_1.MDInternal.PC_GENERIC_ERROR;
                parentType.addChildType(this.typesMap[type.type]);
            }
        }
        for (var _d = 0, _e = configuration.types; _d < _e.length; _d++) {
            var type = _e[_d];
            this.typesList.push(this.typesMap[type.type]);
        }
    };
    ProjectConfiguration.prototype.generateColorForType = function (typeName) {
        if (this.typesMap[typeName] && this.typesMap[typeName].color) {
            return this.typesMap[typeName].color;
        }
        else {
            var hash = ProjectConfiguration_1.hashCode(typeName);
            var r = (hash & 0xFF0000) >> 16;
            var g = (hash & 0x00FF00) >> 8;
            var b = hash & 0x0000FF;
            return '#' + ('0' + r.toString(16)).substr(-2)
                + ('0' + g.toString(16)).substr(-2) + ('0' + b.toString(16)).substr(-2);
        }
    };
    ProjectConfiguration.hashCode = function (string) {
        var hash = 0, i, chr;
        if (string.length === 0)
            return hash;
        for (i = 0; i < string.length; i++) {
            chr = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };
    ProjectConfiguration.getLabel = function (fieldName, fields) {
        for (var i in fields) {
            if (fields[i].name == fieldName) {
                if (fields[i].label) {
                    return fields[i].label;
                }
                else {
                    return fieldName;
                }
            }
        }
        return fieldName;
    };
    ProjectConfiguration.isBrightColor = function (color) {
        color = color.substring(1); // strip #
        var rgb = parseInt(color, 16); // convert rrggbb to decimal
        var r = (rgb >> 16) & 0xff; // extract red
        var g = (rgb >> 8) & 0xff; // extract green
        var b = (rgb >> 0) & 0xff; // extract blue
        var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
        return luma > 200;
    };
    return ProjectConfiguration;
}());
ProjectConfiguration = ProjectConfiguration_1 = __decorate([
    core_1.Injectable()
    /**
     * ProjectConfiguration maintains the current projects properties.
     * Amongst them is the set of types for the current project,
     * which ProjectConfiguration provides to its clients.
     *
     * Within a project, objects of the available types can get created,
     * where every type is a configuration of different fields.
     *
     * @author Thomas Kleinke
     * @author Daniel de Oliveira
     * @author Sebastian Cuy
     */
    ,
    __metadata("design:paramtypes", [Object])
], ProjectConfiguration);
exports.ProjectConfiguration = ProjectConfiguration;
var ProjectConfiguration_1;
//# sourceMappingURL=project-configuration.js.map