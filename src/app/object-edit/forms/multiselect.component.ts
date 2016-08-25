import {Component, Input} from '@angular/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {Resource} from "../../core-services/resource";
import {DocumentEditChangeMonitor} from "../document-edit-change-monitor";

/**
 * @author Fabian Z.
 */
@Component({
    selector: 'multiselect',
    templateUrl: 'src/templates/form-components/multiselect.html',
    directives: [CORE_DIRECTIVES, COMMON_DIRECTIVES, FORM_DIRECTIVES]
})

export class MultiselectComponent {

    @Input() resource: Resource;
    @Input() field: any;

    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor) {}

    public toggleItem(item) {
        if(this.resource[this.field.name]==undefined) this.resource[this.field.name] = new Array<String>();

        var resourceListIndex = this.resource[this.field.name].indexOf(item, 0);

        if (resourceListIndex > -1) {
            this.resource[this.field.name].splice(resourceListIndex, 1);

            this.field.valuelist.push(item);
        } else {
            var valueListIndex = this.field.valuelist.indexOf(item, 0);
            this.field.valuelist.splice(valueListIndex, 1);

            this.resource[this.field.name].push(item);
        }

        this.documentEditChangeMonitor.setChanged();
    }

}