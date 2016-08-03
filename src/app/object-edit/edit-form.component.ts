import {Component, Input, OnInit} from '@angular/core';
import {DocumentEditChangeMonitor} from "./document-edit-change-monitor";
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {RelationPickerGroupComponent} from "./relation-picker-group.component";
import {ValuelistComponent} from "./valuelist.component";
import {FieldlistComponent} from "./fieldlist.component";
import {LocalizedComponent} from "./forms/localized.component";
import {StringInputComponent} from "./forms/string-input.component";
import {InputArrayComponent} from "./forms/input-array.component";
import {InputTextComponent} from "./forms/input-text.component";
import {SelectSingleDropdownComponent} from "./forms/select-single-dropdown.component";
import {SelectSingleRadioComponent} from "./forms/select-single-radio.component";
import {SelectMultiCheckboxComponent} from "./forms/select-multi-checkbox.component";

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
        StringInputComponent,
        InputArrayComponent,
        InputTextComponent,
        SelectSingleDropdownComponent,
        SelectSingleRadioComponent,
        SelectMultiCheckboxComponent
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


}