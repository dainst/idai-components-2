import {Component, Input, OnInit} from '@angular/core';
import {Entity} from "../core-services/entity";
import {PersistenceManager} from "./persistence-manager";
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {ProjectConfiguration} from "./project-configuration";
import {RelationPickerGroupComponent} from "./relation-picker-group.component";
import {ValuelistComponent} from "./valuelist.component";
import {FieldlistComponent} from "./fieldlist.component";
import {OnChanges} from "@angular/core";
import {Messages} from "../core-services/messages";
import {RelationsConfiguration} from "./relations-configuration";
import {MD} from "../core-services/md";
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
        RelationPickerGroupComponent,
        ValuelistComponent,
        FieldlistComponent
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
        private messages: Messages,
        private configLoader: ConfigLoader
    ) {}

    ngOnInit():any {
        // this.setFieldsForObjectType(); // bad, this is necessary for testing

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
            this.persistenceManager.setOldVersion(this.object);
            this.setFieldsForObjectType(this.object,this.projectConfiguration);
        }
    }

    /**
     * Saves the object to the local datastore.
     */
    public save() {
        this.messages.clear();

        this.persistenceManager.load(this.object);
        this.persistenceManager.persist().then(
            () => {
                this.persistenceManager.setOldVersion(this.object);
                this.messages.add(MD.OBJLIST_SAVE_SUCCESS);
            },
            errors => {
                if (errors) {
                    for (var i in errors) {
                        this.messages.add(errors[i]);
                    }
                }
            }
        );
    }

    public markAsChanged() {
        this.persistenceManager.load(this.object);
    }
}