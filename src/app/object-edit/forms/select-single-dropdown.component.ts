import {Component, Input} from '@angular/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {Resource} from "../../core-services/resource";
import {DocumentEditChangeMonitor} from "../document-edit-change-monitor";

/**
 * @author Fabian Zavodnik
 */
@Component({
    selector: 'select-single-dropdown',
    template: `<select [(ngModel)]="resource[field.name]" (change)="markAsChanged()" class="form-control">
                <option *ngFor="let item of field.valuelist" value="{{item}}">{{item}}</option>
</select>`,
    directives: [CORE_DIRECTIVES, COMMON_DIRECTIVES, FORM_DIRECTIVES]
})

export class SelectSingleDropdownComponent {

    @Input() resource: Resource;
    @Input() field: [String];

    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor) {}

    public markAsChanged() {
        this.documentEditChangeMonitor.setChanged();
    }
}