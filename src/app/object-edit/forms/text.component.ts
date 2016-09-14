import {Component, Input} from '@angular/core';
import {Resource} from "../../core-services/resource";
import {DocumentEditChangeMonitor} from "../document-edit-change-monitor";

/**
 * @author Fabian Z.
 */
@Component({
    selector: 'dai-text',
    template: `<textarea [(ngModel)]="resource[fieldName]" (keyup)="markAsChanged()" class="form-control"></textarea>`
})

export class TextComponent {

    @Input() resource: Resource;
    @Input() fieldName: string;

    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor) {}

    public markAsChanged() {
        this.documentEditChangeMonitor.setChanged();
    }
}