System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ReadDatastore;
    return {
        setters:[],
        execute: function() {
            /**
             * This interface provides read access methods to a datastore
             * maintaining Documents.
             *
             * Implementations guarantee that any of methods declared here
             * have no effect on any of the documents within the datastore.
             */
            ReadDatastore = (function () {
                function ReadDatastore() {
                }
                return ReadDatastore;
            }());
            exports_1("ReadDatastore", ReadDatastore);
        }
    }
});
//# sourceMappingURL=read-datastore.js.map