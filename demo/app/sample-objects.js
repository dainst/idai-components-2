System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var OBJECTS;
    return {
        setters:[],
        execute: function() {
            exports_1("OBJECTS", OBJECTS = [
                { "resource": { "@id": "/demo/1", "identifier": "ob1", "type": "Object", "fieldlist_example": ["a", "b"],
                        "localized_fieldlist_example": { "de": ["a", "b"], "en": ["c", "d"] } } },
                { "resource": { "@id": "/demo/2", "identifier": "ob2", "type": "Object" } },
                { "resource": { "@id": "/demo/3", "identifier": "ob3", "type": "Object" } },
                { "resource": { "@id": "/demo/4", "identifier": "ob4", "type": "Object" } },
                { "resource": { "@id": "/demo/5", "identifier": "ob5", "type": "Object" } }
            ]);
        }
    }
});
