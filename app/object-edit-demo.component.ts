import {Component, OnInit, Inject} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {ObjectEditComponent} from '../lib/ts/object-edit/object-edit.component';
import {ConfigLoader} from '../lib/ts/core-services/config-loader'
import {Datastore} from '../lib/ts/datastore/datastore'
import {OBJECTS} from "./sample-objects";

@Component({
    selector: 'object-edit-demo',

    templateUrl: 'templates/object-edit-demo.html',

    directives: [ ROUTER_DIRECTIVES, ObjectEditComponent ]
})
export class ObjectEditDemoComponent implements OnInit {


    private objects = new Array();
    private selectedObject;
    private projectConfiguration;

    constructor(
        private configLoader:ConfigLoader,
        private datastore: Datastore) {
    }

    public clicked(nr) {
        this.selectedObject=this.objects[nr];
    }

    ngOnInit() {
        this.loadSampleData();

        this.configLoader.getProjectConfiguration().then(pc=>{
           this.projectConfiguration=pc;
        });
    }

    loadSampleData(): void {
        for (var item of OBJECTS)
            this.objects.push(item);
    }
}