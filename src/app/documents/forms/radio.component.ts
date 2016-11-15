import {Component, Input} from '@angular/core';
import {Resource} from "../../model/resource";
import {DocumentEditChangeMonitor} from "../document-edit-change-monitor";

/**
 * @author Fabian Z.
 */
@Component({
    selector: 'dai-radio',
    template: `<div *ngFor="let item of field.valuelist" class="radio"><label><input value="{{item}}" type="radio" name="{{resource[field.name]}}" (click)="resource[field.name] = item; markAsChanged()" [checked]="item === resource[field.name]"> {{item}}</label></div>`
})

export class RadioComponent {

    @Input() resource: Resource;
    @Input() field: String[];

    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor) {}

    public markAsChanged() {
        this.documentEditChangeMonitor.setChanged();
    }
}