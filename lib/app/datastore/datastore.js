System.register(["./read-datastore"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var read_datastore_1;
    var Datastore;
    return {
        setters:[
            function (read_datastore_1_1) {
                read_datastore_1 = read_datastore_1_1;
            }],
        execute: function() {
            Datastore = (function (_super) {
                __extends(Datastore, _super);
                function Datastore() {
                    _super.apply(this, arguments);
                }
                return Datastore;
            }(read_datastore_1.ReadDatastore));
            exports_1("Datastore", Datastore);
        }
    }
});
