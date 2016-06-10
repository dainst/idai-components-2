import {Component, Input, OnInit} from '@angular/core';
import {Entity} from "../core-services/entity";
import {PersistenceManager} from "./persistence-manager";
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {ProjectConfiguration} from "./project-configuration";
import {EditFormComponent} from "./edit-form.component"
import {RelationsFormComponent} from "./relations-form.component"
import {OnChanges} from "@angular/core";
import {RelationsConfiguration} from "./relations-configuration";
import {ConfigLoader} from "./config-loader";
import {LoadAndSaveService} from "./load-and-save-service";

/**
 * @author Jan G. Wieners
 * @author Thomas Kleinke
 * @author Daniel de Oliveira
 */
@Component({
    directives: [
        FORM_DIRECTIVES,
        CORE_DIRECTIVES,
        COMMON_DIRECTIVES,
        EditFormComponent,
        RelationsFormComponent
    ],
    selector: 'object-edit',
    templateUrl: 'lib/templates/object-edit.html'
})

export class ObjectEditComponent implements OnChanges,OnInit {

    @Input() object: Entity;
    @Input() primary: string;

    private projectConfiguration: ProjectConfiguration;
    private relationsConfiguration: RelationsConfiguration;

    public relationFields : any[];
    public types : string[];
    public fieldsForObjectType : any;

    constructor(
        private persistenceManager: PersistenceManager,
        private configLoader: ConfigLoader,
        private loadAndSaveService: LoadAndSaveService
    ) {}

    ngOnInit():any {
        this.configLoader.relationsConfiguration().subscribe((relationsConfiguration)=> {

            this.relationsConfiguration = relationsConfiguration;
            this.persistenceManager.setRelationsConfiguration(relationsConfiguration)
            this.relationFields = relationsConfiguration.getRelationFields();
        });
        this.configLoader.projectConfiguration().subscribe((projectConfiguration)=>{
            this.projectConfiguration = projectConfiguration;
            this.setFieldsForObjectType(this.object,this.projectConfiguration);
        });
    }

    public setType(type: string) {
        this.object.type = type;
        this.setFieldsForObjectType(this.object,this.projectConfiguration);
    }

    private setFieldsForObjectType(object,projectConfiguration) {
        if (object==undefined) return;
        if (!projectConfiguration) return;
        this.fieldsForObjectType=projectConfiguration.getFields(object.type);
        this.types=this.projectConfiguration.getTypes();
    }

    public ngOnChanges() {

        if (this.object) {
            this.loadAndSaveService.load(this.object).then(()=>{
                this.setFieldsForObjectType(this.object,this.projectConfiguration);},
                err=>{});
        }
    }

    public save() {
        this.loadAndSaveService.save(this.object).then(()=>{},err=>{});
    }
}