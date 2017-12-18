import {Component, Input} from '@angular/core';
import {Resource} from "../../../model/resource";
import {DocumentEditChangeMonitor} from "../document-edit-change-monitor";

/**
 * @author Fabian Z.
 */
@Component({
    selector: 'dai-dropdown',
    template: `<select [(ngModel)]="resource[field.name]" (change)="setValue($event.target.value)" class="form-control">
        <option value="" [selected]="!resource.hasOwnProperty(field.name)"></option>
        <option *ngFor="let item of field.valuelist" value="{{item}}">{{item}}</option>
    </select>`
})

export class DropdownComponent {

    @Input() resource: Resource;
    @Input() field: any;

    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor) {}

    public setValue(value: any) {
        if (value == "") delete this.resource[this.field.name];
        this.documentEditChangeMonitor.setChanged();
    }
}