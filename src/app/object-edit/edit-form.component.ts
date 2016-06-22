import {Component, Input, OnInit} from '@angular/core';
import {LoadAndSaveService} from "./load-and-save-service";
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
    selector: 'edit-form',
    templateUrl: 'src/templates/edit-form.html'
})

export class EditFormComponent{

    @Input() document: any;
    @Input() fieldsForObjectType: any;

    public types : string[];

    constructor(
        private loadAndSaveService: LoadAndSaveService
    ) {}


    public markAsChanged() {
        this.loadAndSaveService.setChanged();
    }
}