import {Component, Input, OnInit} from '@angular/core';
import {PersistenceManager} from "./persistence-manager";
import {ProjectConfiguration} from "./project-configuration";
import {OnChanges} from "@angular/core";
import {RelationsConfiguration} from "./relations-configuration";
import {ConfigLoader} from "./config-loader";

/**
 * @author Jan G. Wieners
 * @author Thomas Kleinke
 * @author Daniel de Oliveira
 */
@Component({
    moduleId: module.id,
    selector: 'document-edit',
    templateUrl: '../../templates/document-edit.html'
})

export class DocumentEditComponent implements OnChanges,OnInit {

    @Input() document: any;
    @Input() primary: string;

    private projectConfiguration: ProjectConfiguration;
    private relationsConfiguration: RelationsConfiguration;


    public relationFields : any[];
    public types : any[];
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

                this.relationsConfiguration = result.relationsConfiguration;
                this.persistenceManager.setRelationsConfiguration(this.relationsConfiguration);
                this.relationFields = this.relationsConfiguration.getRelationFields();
            }
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