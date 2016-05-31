import {Component, OnInit, Inject} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {ObjectEditComponent} from '../lib/object-edit/object-edit.component';
import {ConfigLoader} from '../lib/core-services/config-loader'
import {Datastore} from '../lib/datastore/datastore'
import {OBJECTS} from "./sample-objects";

@Component({
    selector: 'idai-field-app',

    template: `<div class="container-fluid" id="app">

    <div class="row">
        <div class="col-md-12">
            <object-edit [(object)]="e" [(projectConfiguration)]="projectConfiguration"></object-edit>
        </div>
    </div>
</div>`,

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