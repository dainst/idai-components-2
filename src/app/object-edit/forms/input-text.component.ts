import {Component, Input} from '@angular/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {Resource} from "../../core-services/resource";
import {DocumentEditChangeMonitor} from "../document-edit-change-monitor";

/**
 * @author Fabian Zavodnik
 */
@Component({
    selector: 'input-text',
    template: `<textarea [(ngModel)]="resource[fieldName]" (keyup)="markAsChanged()" class="form-control"></textarea>`,
    directives: [CORE_DIRECTIVES, COMMON_DIRECTIVES, FORM_DIRECTIVES]
})

export class InputTextComponent {

    @Input() resource: Resource;
    @Input() fieldName: string;

    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor) {}

    public markAsChanged() {
        this.documentEditChangeMonitor.setChanged();
    }
}