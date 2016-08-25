import {Component, Input} from '@angular/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {Resource} from "../../core-services/resource";
import {DocumentEditChangeMonitor} from "../document-edit-change-monitor";

/**
 * @author Fabian Z.
 */
@Component({
    selector: 'checkboxes',
    templateUrl: 'src/templates/form-components/checkboxes.html',
    directives: [CORE_DIRECTIVES, COMMON_DIRECTIVES, FORM_DIRECTIVES]
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