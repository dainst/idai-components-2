import {Component, Input} from '@angular/core';
import {Resource} from "../../core-services/resource";
import {DocumentEditChangeMonitor} from "../document-edit-change-monitor";

/**
 * @author Fabian Z.
 */
@Component({
    selector: 'dropdown',
    template: `<select [(ngModel)]="resource[field.name]" (change)="markAsChanged()" class="form-control">
                <option *ngFor="let item of field.valuelist" value="{{item}}">{{item}}</option>
</select>`
})

export class DropdownComponent {

    @Input() resource: Resource;
    @Input() field: String[];

    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor) {}

    public markAsChanged() {
        this.documentEditChangeMonitor.setChanged();
    }
}