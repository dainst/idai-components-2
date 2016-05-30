import {Component, OnInit, Inject} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {ObjectEditComponent} from './object-edit/object-edit.component';
import {ConfigLoader} from './core-services/config-loader'
import {Datastore} from './core-services/datastore'
import {OBJECTS} from "./datastore/sample-objects";

@Component({
    selector: 'idai-field-app',
    templateUrl: 'templates/app.html',
    directives: [ ROUTER_DIRECTIVES, ObjectEditComponent ]
})
export class AppComponent implements OnInit {


    private e = {};
    private projectConfiguration;

    constructor(
        private configLoader:ConfigLoader,
        private datastore: Datastore) {
    }

    ngOnInit() {
        this.loadSampleData();

        this.configLoader.getProjectConfiguration().then(pc=>{
           this.projectConfiguration=pc;
        });
    }

    loadSampleData(): void {
        var promises = [];
        this.e=OBJECTS[0];
    }
}