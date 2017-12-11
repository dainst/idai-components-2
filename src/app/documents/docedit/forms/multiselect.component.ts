import {Component, Input} from '@angular/core';
import {Resource} from "../../../model/resource";
import {DocumentEditChangeMonitor} from "../document-edit-change-monitor";

/**
 * @author Fabian Z.
 */
@Component({
    moduleId: module.id,
    selector: 'dai-multiselect',
    templateUrl: './multiselect.html'
})

export class MultiselectComponent {

    @Input() resource: Resource;
    @Input() field: any;

    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor) {}

    public toggleItem(item: any) {
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