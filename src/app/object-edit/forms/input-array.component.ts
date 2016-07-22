import {Component, Input} from '@angular/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {Resource} from "../../core-services/resource";
import {DocumentEditChangeMonitor} from "../document-edit-change-monitor";

/**
 * @author Fabian Zavodnik
 */
@Component({

    selector: 'input-array',
    templateUrl: 'src/templates/input-array.html',
    directives: [CORE_DIRECTIVES, COMMON_DIRECTIVES, FORM_DIRECTIVES]
})

export class InputArrayComponent {

    @Input() field: [String];

    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor) {}

    public markAsChanged() {
        this.documentEditChangeMonitor.setChanged();
    }

    customTrackBy(index: number, obj: any): any {
        return index;
    }
    
    public addInputArrayItem() {
        this.field.push("")
    }
    
    public removeInputArrayItemAtIndex(index) {
        this.field.splice(index,1);

    }
}