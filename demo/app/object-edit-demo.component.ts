import {Component, OnInit, Inject} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {ObjectEditComponent} from '../../lib/app/object-edit/object-edit.component';
import {ConfigLoader} from '../../lib/app/object-edit/config-loader'
import {Datastore} from '../../lib/app/datastore/datastore'
import {OBJECTS} from "./sample-objects";

@Component({
    selector: 'object-edit-demo',

    templateUrl: 'demo/templates/object-edit-demo.html',

    directives: [ ROUTER_DIRECTIVES, ObjectEditComponent ]
})
export class ObjectEditDemoComponent implements OnInit {

    private static PROJECT_CONFIGURATION_PATH='demo/config/Configuration.json';
    private static RELATIONS_CONFIGURATION_PATH='demo/config/Relations.json';
    
    private objects = new Array();
    private selectedObject;

    constructor(
        private configLoader:ConfigLoader,
        private datastore: Datastore) {
    }

    public clicked(id) {
        this.datastore.get(id).then((entity)=> {
            this.selectedObject = JSON.parse(JSON.stringify(entity));
        });
    }

    ngOnInit() {
        this.loadSampleData();
        this.configLoader.setProjectConfiguration(ObjectEditDemoComponent.PROJECT_CONFIGURATION_PATH);
        this.configLoader.setRelationsConfiguration(ObjectEditDemoComponent.RELATIONS_CONFIGURATION_PATH);
    }

    loadSampleData(): void {
        for (var item of OBJECTS) {
            this.objects.push(item);
            this.datastore.update(item);
        }
    }
}