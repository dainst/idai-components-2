"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Companion object
 */
var Constraint = (function () {
    function Constraint() {
    }
    Constraint.convertTo = function (constraint) {
        return (Array.isArray(constraint) || typeof (constraint) == 'string')
            ? { value: constraint, type: 'add' }
            : constraint;
    };
    return Constraint;
}());
exports.Constraint = Constraint;
//# sourceMappingURL=constraint.js.map