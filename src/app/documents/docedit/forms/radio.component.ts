import {Component, Input} from '@angular/core';
import {Resource} from "../../../model/resource";
import {DocumentEditChangeMonitor} from "../document-edit-change-monitor";

/**
 * @author Fabian Z.
 */
@Component({
    moduleId: module.id,
    selector: 'dai-radio',
    templateUrl: `./radio.html`
})

export class RadioComponent {

    @Input() resource: Resource;
    @Input() field: any;

    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor) {}

    public setValue(value) {
        this.resource[this.field.name] = value;
        this.documentEditChangeMonitor.setChanged();
    }

    public resetValue() {
        delete this.resource[this.field.name];
        this.documentEditChangeMonitor.setChanged();
    }
}