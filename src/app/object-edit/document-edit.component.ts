import {Component, Input, OnInit} from '@angular/core';
import {PersistenceManager} from "./persistence-manager";
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {ProjectConfiguration} from "./project-configuration";
import {EditFormComponent} from "./edit-form.component"
import {RelationsFormComponent} from "./relations-form.component"
import {OnChanges} from "@angular/core";
import {RelationsConfiguration} from "./relations-configuration";
import {ConfigLoader} from "./config-loader";

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
    selector: 'document-edit',
    templateUrl: 'src/templates/document-edit.html'
})

export class DocumentEditComponent implements OnChanges,OnInit {

    @Input() document: any;
    @Input() primary: string;

    private projectConfiguration: ProjectConfiguration;
    private relationsConfiguration: RelationsConfiguration;

    public relationFields : any[];
    public types : string[];
    public fieldsForObjectType : any;

    constructor(
        private persistenceManager: PersistenceManager,
        private configLoader: ConfigLoader
    ) {}

    ngOnInit():any {
        this.configLoader.relationsConfiguration().subscribe((relationsConfiguration)=> {

            this.relationsConfiguration = relationsConfiguration;
            this.persistenceManager.setRelationsConfiguration(relationsConfiguration);
            this.relationFields = relationsConfiguration.getRelationFields();
        });
        this.configLoader.projectConfiguration().subscribe((projectConfiguration)=>{
            this.projectConfiguration = projectConfiguration;
            this.setFieldsForObjectType(this.document,this.projectConfiguration);
        });
    }

    public setType(type: string) {
        this.document['resource'].type = type;
        this.setFieldsForObjectType(this.document,this.projectConfiguration);
    }

    private setFieldsForObjectType(document,projectConfiguration) {
        if (document==undefined) return;
        if (!projectConfiguration) return;
        this.fieldsForObjectType=projectConfiguration.getFields(document['resource'].type);
        this.types=this.projectConfiguration.getTypes();
    }

    public ngOnChanges() {

        if (this.document) {
            this.persistenceManager.setOldVersion(this.document);
            this.setFieldsForObjectType(this.document,this.projectConfiguration);
        }
    }
}