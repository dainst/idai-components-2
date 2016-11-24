import {Component, Input, OnInit} from '@angular/core';
import {PersistenceManager} from "./persistence-manager";
import {ProjectConfiguration} from "../configuration/project-configuration";
import {OnChanges} from "@angular/core";
import {ConfigLoader} from "../configuration/config-loader";

/**
 * @author Jan G. Wieners
 * @author Thomas Kleinke
 * @author Daniel de Oliveira
 */
@Component({
    moduleId: module.id,
    selector: 'document-edit',
    templateUrl: './document-edit.html'
})

export class DocumentEditComponent implements OnChanges,OnInit {

    @Input() document: any;
    @Input() primary: string;

    private projectConfiguration: ProjectConfiguration;

    public relationFields : any[];
    public fieldsForObjectType : any;
    public objectTypeLabel : string;

    constructor(
        private persistenceManager: PersistenceManager,
        private configLoader: ConfigLoader
    ) {}

    ngOnInit():any {
        this.configLoader.configuration().subscribe((result)=>{
            if(result.error == undefined) {
                this.projectConfiguration = result.projectConfiguration;
                this.setFieldsForObjectType(this.document, this.projectConfiguration);
                this.setObjectTypeLabel(this.document, this.projectConfiguration);
                this.persistenceManager.setProjectConfiguration(this.projectConfiguration);
                this.relationFields = this.projectConfiguration.getRelationFields();
            }
        });
    }

    private setFieldsForObjectType(document,projectConfiguration) {
        if (document==undefined) return;
        if (!projectConfiguration) return;
        this.fieldsForObjectType=projectConfiguration.getFieldDefinitions(document['resource'].type);
    }

    private setObjectTypeLabel(document, projectConfiguration) {
        if (document==undefined) return;
        if (!projectConfiguration) return;
        this.objectTypeLabel = projectConfiguration.getLabelForType(document['resource'].type);
    }

    public ngOnChanges() {

        if (this.document) {
            this.persistenceManager.setOldVersion(this.document);
            this.setFieldsForObjectType(this.document,this.projectConfiguration);
            this.setObjectTypeLabel(this.document,this.projectConfiguration);
        }
    }
}