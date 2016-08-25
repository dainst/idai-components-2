import {Component, Input, OnInit} from '@angular/core';
import {DocumentEditChangeMonitor} from "./document-edit-change-monitor";
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {RelationPickerGroupComponent} from "./relation-picker-group.component";
import {ValuelistComponent} from "./valuelist.component";
import {LocalizedComponent} from "./forms/localized.component";
import {InputComponent} from "./forms/input.component";
import {InputsComponent} from "./forms/inputs.component";
import {TextComponent} from "./forms/text.component";
import {DropdownComponent} from "./forms/dropdown.component";
import {RadioComponent} from "./forms/radio.component";
import {CheckboxesComponent} from "./forms/checkboxes.component";
import {MultiselectComponent} from "./forms/multiselect.component";
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
        LocalizedComponent,
        InputComponent,
        InputsComponent,
        TextComponent,
        DropdownComponent,
        RadioComponent,
        CheckboxesComponent,
        MultiselectComponent
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