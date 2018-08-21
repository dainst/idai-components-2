"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsfun_1 = require("tsfun");
/**
 * @author Thomas Kleinke
 * @author Daniel de Oliveira
 */
var Resource;
(function (Resource) {
    // TODO unit test
    function getDifferingFields(resource1, resource2) {
        var differingFieldsNames = findDifferingFieldsInResource(resource1, resource2)
            .concat(findDifferingFieldsInResource(resource2, resource1));
        return tsfun_1.unique(differingFieldsNames);
    }
    Resource.getDifferingFields = getDifferingFields;
    // TODO make use includedIn,
    function findDifferingFieldsInResource(resource1, resource2) {
        return Object.keys(resource1)
            .filter(tsfun_1.isNot(tsfun_1.tripleEqual('relations')))
            .reduce(concatIf(notCompareInBoth(resource1, resource2)), []);
    }
    var notCompareInBoth = function (l, r) { return function (key) {
        return !compare((l)[key], (r)[key]);
    }; };
    // TODO possibly put to tsfun
    var concatIf = function (f) { return function (acc, val) {
        return f(val) ? acc.concat([val]) : acc;
    }; };
    function compare(value1, value2) {
        if (!value1 && !value2)
            return true;
        if ((value1 && !value2) || (!value1 && value2))
            return false;
        var type1 = getType(value1);
        var type2 = getType(value2);
        if (type1 !== type2)
            return false;
        if (type1 === 'array' && type2 === 'array') {
            return tsfun_1.arrayEquivalentBy(tsfun_1.jsonEqual)(value1)(value2);
        }
        return tsfun_1.jsonEqual(value1)(value2);
    }
    Resource.compare = compare;
    function getType(value) {
        return typeof value == 'object'
            ? value instanceof Array
                ? 'array'
                : 'object'
            : 'flat';
    }
})(Resource = exports.Resource || (exports.Resource = {}));
//# sourceMappingURL=resource.js.map