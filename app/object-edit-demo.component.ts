import {Component, OnInit, Inject} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {ObjectEditComponent} from '../lib/ts/object-edit/object-edit.component';
import {ConfigLoader} from '../lib/ts/object-edit/config-loader'
import {Datastore} from '../lib/ts/datastore/datastore'
import {OBJECTS} from "./sample-objects";

@Component({
    selector: 'object-edit-demo',

    templateUrl: 'templates/object-edit-demo.html',

    directives: [ ROUTER_DIRECTIVES, ObjectEditComponent ]
})
export class ObjectEditDemoComponent implements OnInit {

    private static PROJECT_CONFIGURATION_PATH='config/Configuration.json';
    private static RELATIONS_CONFIGURATION_PATH='config/Relations.json';
    
    private objects = new Array();
    private selectedObject;
    private projectConfiguration;
    private relationsConfiguration;

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

        var promises = [];
        promises.push(this.configLoader.getProjectConfiguration(ObjectEditDemoComponent.PROJECT_CONFIGURATION_PATH));
        promises.push(this.configLoader.getRelationsConfiguration(ObjectEditDemoComponent.RELATIONS_CONFIGURATION_PATH));
        
        Promise.all(promises).then(configs=>{
            this.projectConfiguration=configs[0];
            this.relationsConfiguration=configs[1];
        }, (errs)=>{console.error('errs: ',errs)});
    }

    loadSampleData(): void {
        for (var item of OBJECTS) {
            this.objects.push(item);
            this.datastore.update(item);
        }
    }
}