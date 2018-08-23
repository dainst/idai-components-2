"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("angular2-uuid/index");
var IdGenerator = /** @class */ (function () {
    function IdGenerator() {
    }
    IdGenerator.generateId = function () {
        return index_1.UUID.UUID();
    };
    return IdGenerator;
}());
exports.IdGenerator = IdGenerator;
//# sourceMappingURL=id-generator.js.map