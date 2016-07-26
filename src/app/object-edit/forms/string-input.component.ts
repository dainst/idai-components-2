import {Component, Input} from '@angular/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {Resource} from "../../core-services/resource";
import {DocumentEditChangeMonitor} from "../document-edit-change-monitor";

/**
 * @author Fabian Zavodnik
 */
@Component({

    selector: 'string-input',
    template: `<input [(ngModel)]="field" (keyup)="markAsChanged()" class="form-control" [attr.class]="'input-'+field">`,
    directives: [CORE_DIRECTIVES, COMMON_DIRECTIVES, FORM_DIRECTIVES]
})

export class StringInputComponent {

    @Input() field: any;

    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor) {}

    public markAsChanged() {
        this.documentEditChangeMonitor.setChanged();
    }
}