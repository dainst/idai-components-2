import {Component, Input} from '@angular/core';
import {DocumentEditChangeMonitor} from "./document-edit-change-monitor";

/**
 * @author Daniel de Oliveira
 */
@Component({
    moduleId: module.id,
    selector: 'edit-form',
    templateUrl: './edit-form.html'
})

export class EditFormComponent{

    @Input() document: any;
    @Input() fieldsForObjectType: any;

    public types : string[];

    constructor(
        private saveService: DocumentEditChangeMonitor
    ) {}


    public markAsChanged() {
        this.saveService.setChanged();
    }


}