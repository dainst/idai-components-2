import {Component, OnInit, Inject} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {ObjectEditComponent} from '../lib/object-edit/object-edit.component';
import {ConfigLoader} from '../lib/core-services/config-loader'
import {Datastore} from '../lib/datastore/datastore'
import {OBJECTS} from "./sample-objects";

@Component({
    selector: 'idai-field-app',

    template: `<div class="container-fluid" id="app">

    <ul>
        <li *ngFor="let item of objects; let i=index"><button (click)="clicked(i)">{{item.identifier}}</button></li>
    </ul>

    <div class="row">
        <div class="col-md-12">
            <object-edit [(object)]="selectedObject" [(projectConfiguration)]="projectConfiguration"></object-edit>
        </div>
    </div>
</div>`,

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