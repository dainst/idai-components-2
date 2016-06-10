import {Component, Input, OnInit} from '@angular/core';
import {Entity} from "../core-services/entity";
import {PersistenceManager} from "./persistence-manager";
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {RelationPickerGroupComponent} from "./relation-picker-group.component";
import {ValuelistComponent} from "./valuelist.component";
import {FieldlistComponent} from "./fieldlist.component";
import {LocalizedComponent} from "./localized.component";
import {OnChanges} from "@angular/core";

/**
 * @author Daniel de Oliveira
 */
@Component({
    directives: [
        FORM_DIRECTIVES,
        CORE_DIRECTIVES,
        COMMON_DIRECTIVES,
        RelationPickerGroupComponent,
        ValuelistComponent,
        FieldlistComponent,
        LocalizedComponent
    ],
    selector: 'edit-form',
    templateUrl: 'lib/templates/edit-form.html'
})

export class EditFormComponent{

    @Input() object: Entity;
    @Input() primary: string;
    @Input() fieldsForObjectType: any;
    @Input() relationFields: any;

    public types : string[];

    constructor(
        private persistenceManager: PersistenceManager
    ) {}


    public markAsChanged() {
        this.persistenceManager.load(this.object);
    }
}