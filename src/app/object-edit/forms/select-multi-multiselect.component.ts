import {Component, Input} from '@angular/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {Resource} from "../../core-services/resource";
import {DocumentEditChangeMonitor} from "../document-edit-change-monitor";

/**
 * @author Fabian Zavodnik
 */
@Component({
    selector: 'select-multi-multiselect',
    templateUrl: 'src/templates/select-multi-multiselect.html',
    directives: [CORE_DIRECTIVES, COMMON_DIRECTIVES, FORM_DIRECTIVES]
})

export class SelectMultiMultiselectComponent {

    @Input() resource: Resource;
    @Input() field: any;

    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor) {}
    
    public getIndexOfItem(item) {
        if (this.resource[this.field.name] != undefined) {
            return this.resource[this.field.name].indexOf(item, 0);
        }
    }

    public addInputArrayItem(item) {
        if(this.resource[this.field.name]==undefined) this.resource[this.field.name] = new Array<String>();

        var index = this.getIndexOfItem(item)
        if (index > -1) {
            this.resource[this.field.name].splice(index, 1);
        } else {
            this.resource[this.field.name].push(item);
        }

        this.markAsChanged()
    }

    public markAsChanged() {
        this.documentEditChangeMonitor.setChanged();
    }

}