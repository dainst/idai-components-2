import {Component, Input} from '@angular/core';
import {Resource} from "../../core-services/resource";
import {DocumentEditChangeMonitor} from "../document-edit-change-monitor";

/**
 * @author Fabian Z.
 */
@Component({
    moduleId: module.id,
    selector: 'checkboxes',
    templateUrl: '../../../templates/form-components/checkboxes.html'
})

export class CheckboxesComponent {

    @Input() resource: Resource;
    @Input() field: any;

    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor) {}

    public addInputArrayItem(item) {
        if(this.resource[this.field.name]==undefined) this.resource[this.field.name] = new Array<String>();

        var index:number = this.resource[this.field.name].indexOf(item, 0);
        if (index > -1) {
            this.resource[this.field.name].splice(index, 1);
        } else {
            this.resource[this.field.name].push(item);
        }

        this.documentEditChangeMonitor.setChanged();
    }
    
}