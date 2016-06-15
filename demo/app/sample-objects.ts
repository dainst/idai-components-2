import {Document} from '../../lib/app/core-services/document';

export var OBJECTS: Document[] = [
    
    { "@id" : "1", "resource" : { "id":"1", "identifier": "ob1", "type": "Object" , "fieldlist_example" : [ "a" , "b" ], 
        "localized_fieldlist_example" : { "de" : [ "a" , "b" ], "en" : [ "c" , "d" ] } }},
    
    { "@id" : "2", "resource" : { "id":"2", "identifier": "ob2", "type": "Object" }},

    { "@id" : "3", "resource" : { "id":"3", "identifier": "ob3", "type": "Object" }},

    { "@id" : "4", "resource" : { "id":"4", "identifier": "ob4", "type": "Object" }},

    { "@id" : "5", "resource" : { "id":"5", "identifier": "ob5", "type": "Object" }}
    
];