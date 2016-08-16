import {Component, Input} from '@angular/core';
import {DocumentEditChangeMonitor} from "./document-edit-change-monitor";
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {RelationPickerGroupComponent} from "./relation-picker-group.component";
import {ValuelistComponent} from "./valuelist.component";
import {LocalizedComponent} from "./forms/localized.component";

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
        LocalizedComponent
    ],
    selector: 'relations-form',
    templateUrl: 'src/templates/relations-form.html'
})

export class RelationsFormComponent{

    @Input() document: any;
    @Input() primary: string;
    @Input() relationFields: any;

    constructor(
        private saveService: DocumentEditChangeMonitor
    ) {}

    public markAsChanged() {
        this.saveService.setChanged();
    }
}