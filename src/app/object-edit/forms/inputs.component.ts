import {Component, Input} from '@angular/core';
import {DocumentEditChangeMonitor} from "../document-edit-change-monitor";

/**
 * @author Fabian Z.
 * @author Thomas Kleinke
 */
@Component({
    moduleId: module.id,
    selector: 'dai-inputs',
    templateUrl: '../../../templates/form-components/inputs.html'
})

export class InputsComponent {

    @Input() field: String[];

    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor) {}

    customTrackBy(index: number, obj: any): any {
        return index;
    }
    
    public addInputArrayItem() {

        if (this.field == undefined) this.field = new Array<String>();
        this.field.push("");
        this.documentEditChangeMonitor.setChanged();
    }
    
    public removeInputArrayItemAtIndex(index) {

        this.field.splice(index, 1);
        this.documentEditChangeMonitor.setChanged();
    }
}