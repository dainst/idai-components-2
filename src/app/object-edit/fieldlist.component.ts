import {Component, Input} from '@angular/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {DocumentEditChangeMonitor} from "./document-edit-change-monitor";

/**
 * @author Daniel de Oliveira
 */
@Component({

    selector: 'fieldlist',
    template: `<div>
        <ul>
            <li *ngFor="let item of resource[fieldDefinition.field]; let i=index">
                <div>{{item}}</div>
            </li>
      
        </ul>
    </div>`,
    directives: [CORE_DIRECTIVES, COMMON_DIRECTIVES, FORM_DIRECTIVES]
})

export class FieldlistComponent {

    @Input() resource: any;
    @Input() fieldDefinition: any;

    constructor(private saveService: DocumentEditChangeMonitor) {}

    public markAsChanged() {
        this.saveService.setChanged();
    }
}