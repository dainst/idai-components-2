import {Document} from '../../lib/app/core-services/document';

export var OBJECTS: Document[] = [
    
    { "resource" : { "@id" : "/demo/1", "identifier": "ob1", "type": "Object" , "fieldlist_example" : [ "a" , "b" ],
        "localized_fieldlist_example" : { "de" : [ "a" , "b" ], "en" : [ "c" , "d" ] } }},
    
    { "resource" : { "@id" : "/demo/2", "identifier": "ob2", "type": "Object" }},

    { "resource" : { "@id" : "/demo/3", "identifier": "ob3", "type": "Object" }},

    { "resource" : { "@id" : "/demo/4", "identifier": "ob4", "type": "Object" }},

    { "resource" : { "@id" : "/demo/5", "identifier": "ob5", "type": "Object" }}
    
];