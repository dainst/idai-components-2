System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ReadDatastore;
    return {
        setters:[],
        execute: function() {
            /**
             * The interface providing read access methods
             * for datastores supporting the idai-components document model.
             * For full access see <code>Datastore</code>
             *
             * Implementations guarantee that any of methods declared here
             * have no effect on any of the documents within the datastore.
             *
             * @author Sebastian Cuy
             * @author Daniel de Oliveira
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