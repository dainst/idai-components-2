"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Companion object
 */
var Query = (function () {
    function Query() {
    }
    Query.isEmpty = function (query) {
        return ((!query.q || query.q == '') && !query.types);
    };
    return Query;
}());
exports.Query = Query;
//# sourceMappingURL=query.js.map