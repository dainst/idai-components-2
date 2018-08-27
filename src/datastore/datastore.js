"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var read_datastore_1 = require("./read-datastore");
/**
 * The interface for datastores supporting
 * the idai-components document model.
 *
 * The errors with which the methods reject, like GENERIC_SAVE_ERROR,
 * are constants of {@link DatastoreErrors}, so GENERIC_SAVE_ERROR really
 * is DatastoreErrors.GENERIC_SAVE_ERROR. The brackets [] are array indicators,
 * so [GENERIC_SAVE_ERROR] is an array containing one element, which is the string
 * corresponding to GENERIC_SAVE_ERROR.
 *
 * @author Sebastian Cuy
 * @author Daniel de Oliveira
 */
var Datastore = /** @class */ (function (_super) {
    __extends(Datastore, _super);
    function Datastore() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Datastore;
}(read_datastore_1.ReadDatastore));
exports.Datastore = Datastore;
//# sourceMappingURL=datastore.js.map