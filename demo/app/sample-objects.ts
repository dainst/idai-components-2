import {Document} from '../../src/app/model/document';

export var OBJECTS: Document[] = [
    
    { "resource" : { "id" : "/demo/1", "identifier": "ob1", "type": "object" , "multiple_input" : [ "a" , "b" ],
        "localized_multiple_input" : [{ "lang": "de", "content" : [ "a" , "b" ]}, {"lang": "en", "content" :  [ "c" , "d" ] }], "single_select_radio": "CD", "relations" : {} }},
    
    { "resource" : { "id" : "/demo/2", "identifier": "ob2", "non_editable" : "not editable", "type": "object", "relations" : { "Belongs to": [ "not_existing_id"] } }},

    { "resource" : { "id" : "/demo/3", "identifier": "ob3", "type": "object", "relations" : {} }},

    { "resource" : { "id" : "/demo/4", "identifier": "ob4", "type": "object_enhanced", "relations" : {} }},

    { "resource" : { "id" : "/demo/5", "identifier": "ob5", "type": "section", "relations" : {} }},

    { "resource" : { "id" : "/demo/6", "identifier": "ob6", "type": "section", "relations" : {} }},

    { "resource" : { "id" : "/demo/7", "identifier": "ob7", "type": "section", "relations" : {} }},
    
    { "resource" : { "id" : "/demo/8", "identifier": "ob8", "type": "image", "dimensions":"800x600", "relations" : {} }},

    { "resource" : { "id" : "/demo/9", "identifier": "ob9", "type": "drawing", "dimensions":"8000x6000", "relations" : {} }}
];