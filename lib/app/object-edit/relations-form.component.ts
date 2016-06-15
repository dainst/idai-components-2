import {Component, Input} from '@angular/core';
import {Document} from "../core-services/document";
import {PersistenceManager} from "./persistence-manager";
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {RelationPickerGroupComponent} from "./relation-picker-group.component";
import {ValuelistComponent} from "./valuelist.component";
import {FieldlistComponent} from "./fieldlist.component";
import {LocalizedComponent} from "./localized.component";

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
    selector: 'relations-form',
    templateUrl: 'lib/templates/relations-form.html'
})

export class RelationsFormComponent{

    @Input() document: any;
    @Input() primary: string;
    @Input() relationFields: any;

    constructor(
        private persistenceManager: PersistenceManager
    ) {}

    public markAsChanged() {
        this.persistenceManager.load(this.document);
    }
}