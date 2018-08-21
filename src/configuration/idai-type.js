"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author F.Z.
 * @author Thomas Kleinke
 */
var IdaiType = (function () {
    function IdaiType(definition) {
        this.parentType = undefined;
        this.name = definition.type;
        this.label = definition.label || this.name;
        this.fields = definition.fields || [];
        this.isAbstract = definition.abstract || false;
        this.color = definition.color;
    }
    IdaiType.prototype.setParentType = function (parent) {
        this.parentType = parent;
        // TODO This should probably better be done in ConfigLoader.
        this.fields = this.getCombinedFields(parent.fields, this.fields);
    };
    IdaiType.prototype.addChildType = function (child) {
        if (!this.children)
            this.children = [];
        child.setParentType(this);
        this.children.push(child);
    };
    IdaiType.prototype.getCombinedFields = function (parentFields, childFields) {
        var _this = this;
        var fields = parentFields.slice();
        childFields.forEach(function (childField) {
            var field = fields.find(function (field) { return field.name === childField.name; });
            if (field) {
                _this.mergeFields(childField, field);
            }
            else {
                fields.push(childField);
            }
        });
        return fields;
    };
    IdaiType.prototype.mergeFields = function (sourceField, targetField) {
        Object.keys(sourceField).forEach(function (key) { return targetField[key] = sourceField[key]; });
    };
    return IdaiType;
}());
exports.IdaiType = IdaiType;
//# sourceMappingURL=idai-type.js.map