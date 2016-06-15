import {Document} from '../../lib/app/core-services/document';

export var OBJECTS: Document[] = [
    
    { "@id" : "/demo/1", "resource" : { "identifier": "ob1", "type": "Object" , "fieldlist_example" : [ "a" , "b" ], 
        "localized_fieldlist_example" : { "de" : [ "a" , "b" ], "en" : [ "c" , "d" ] } }},
    
    { "@id" : "/demo/2", "resource" : { "identifier": "ob2", "type": "Object" }},

    { "@id" : "/demo/3", "resource" : { "identifier": "ob3", "type": "Object" }},

    { "@id" : "/demo/4", "resource" : { "identifier": "ob4", "type": "Object" }},

    { "@id" : "/demo/5", "resource" : { "identifier": "ob5", "type": "Object" }}
    
];