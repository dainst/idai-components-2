"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsfun_1 = require("tsfun");
exports.toResourceId = function (doc) { return tsfun_1.to('resource.id')(doc); };
/**
 * Companion module
 */
var Document;
(function (Document) {
    function getLastModified(document) {
        return (document.modified && document.modified.length > 0)
            ? document.modified[document.modified.length - 1]
            : document.created;
    }
    Document.getLastModified = getLastModified;
    function isValid(document, newDocument) {
        if (newDocument === void 0) { newDocument = false; }
        if (!document.resource)
            return false;
        if (!document.resource.id && !newDocument)
            return false;
        if (!document.resource.relations)
            return false;
        if (!newDocument && !document.created)
            return false;
        if (!newDocument && !document.modified)
            return false;
        return true;
    }
    Document.isValid = isValid;
    function removeFields(fields) {
        return function (document) {
            var result = tsfun_1.copy(document);
            result.resource = tsfun_1.subtractObject(fields)(document.resource);
            return result;
        };
    }
    Document.removeFields = removeFields;
    function removeRelations(relations) {
        return function (document) {
            var result = tsfun_1.copy(document);
            result.resource.relations = tsfun_1.subtractObject(relations)(result.resource.relations);
            return result;
        };
    }
    Document.removeRelations = removeRelations;
    function hasRelationTarget(document, relationName, targetId) {
        if (!document.resource.relations[relationName])
            return false;
        return document.resource.relations[relationName].indexOf(targetId) > -1;
    }
    Document.hasRelationTarget = hasRelationTarget;
    function hasRelations(document, relationName) {
        return document.resource.relations[relationName] && document.resource.relations[relationName].length > 0;
    }
    Document.hasRelations = hasRelations;
})(Document = exports.Document || (exports.Document = {}));
//# sourceMappingURL=document.js.map