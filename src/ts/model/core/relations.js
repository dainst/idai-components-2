"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsfun_1 = require("tsfun");
exports.relationsEquivalent = function (r1) { return function (r2) {
    return tsfun_1.objectEqualBy(tsfun_1.arrayEquivalent)(r1)(r2);
}; };
/**
 * @author Thomas Kleinke
 * @author Daniel de Oliveira
 */
var Relations;
(function (Relations) {
    function getAllTargets(relations, allowedRelations) {
        var ownKeys = Object.keys(relations)
            .filter(function (prop) { return relations.hasOwnProperty(prop); });
        var usableRelations = allowedRelations
            ? ownKeys.filter(tsfun_1.includedIn(allowedRelations))
            : ownKeys;
        return tsfun_1.flatMap(function (prop) { return relations[prop]; })(usableRelations);
    }
    Relations.getAllTargets = getAllTargets;
    function getDifferent(relations1, relations2) {
        var differingRelationNames = findDifferingFieldsInRelations(relations1, relations2)
            .concat(findDifferingFieldsInRelations(relations2, relations1));
        return tsfun_1.unique(differingRelationNames);
    }
    Relations.getDifferent = getDifferent;
    function findDifferingFieldsInRelations(relations1, relations2) {
        return Object.keys(relations1)
            .reduce(concatIf(notArrayEquivalentInBoth(relations1, relations2)), []);
    }
    var notArrayEquivalentInBoth = function (l, r) { return function (key) {
        return !tsfun_1.arrayEquivalent(l[key])(r[key]);
    }; };
    // TODO possibly put to tsfun
    var concatIf = function (f) { return function (acc, val) {
        return f(val) ? acc.concat([val]) : acc;
    }; };
})(Relations = exports.Relations || (exports.Relations = {}));
//# sourceMappingURL=relations.js.map