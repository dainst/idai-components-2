System.register(["angular2-uuid/index"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var index_1;
    var IdGenerator;
    return {
        setters:[
            function (index_1_1) {
                index_1 = index_1_1;
            }],
        execute: function() {
            IdGenerator = (function () {
                function IdGenerator() {
                }
                IdGenerator.generateId = function () {
                    return index_1.UUID.UUID();
                };
                return IdGenerator;
            }());
            exports_1("IdGenerator", IdGenerator);
        }
    }
});
