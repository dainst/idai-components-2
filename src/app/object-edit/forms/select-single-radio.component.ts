import {Component, Input} from '@angular/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {Resource} from "../../core-services/resource";
import {DocumentEditChangeMonitor} from "../document-edit-change-monitor";

/**
 * @author Fabian Zavodnik
 */
@Component({
    selector: 'select-single-radio',
    template: `<div *ngFor="let item of field.valuelist" class="radio"><label><input value="{{item}}" type="radio" name="{{resource[field.name]}}" (click)="resource[field.name] = item; markAsChanged()" [checked]="item === resource[field.name]">{{item}}</label></div>`,
    directives: [CORE_DIRECTIVES, COMMON_DIRECTIVES, FORM_DIRECTIVES]
})

export class SelectSingleRadioComponent {

    @Input() resource: Resource;
    @Input() field: [String];

    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor) {}

    public markAsChanged() {
        this.documentEditChangeMonitor.setChanged();
    }
}