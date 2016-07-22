import {Component, Input, OnInit} from '@angular/core';
import {DocumentEditChangeMonitor} from "./document-edit-change-monitor";
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {RelationPickerGroupComponent} from "./relation-picker-group.component";
import {ValuelistComponent} from "./valuelist.component";
import {FieldlistComponent} from "./fieldlist.component";
import {LocalizedComponent} from "./localized.component";
import {StringInputComponent} from "./forms/string-input.component";

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
        LocalizedComponent,
        StringInputComponent
    ],
    selector: 'edit-form',
    templateUrl: 'src/templates/edit-form.html'
})

export class EditFormComponent{

    @Input() document: any;
    @Input() fieldsForObjectType: any;

    public types : string[];

    constructor(
        private saveService: DocumentEditChangeMonitor
    ) {}


    public markAsChanged() {
        this.saveService.setChanged();
    }

    customTrackBy(index: number, obj: any): any {
        return index;
    }
}