import {Component, Input} from '@angular/core';
import {DocumentEditChangeMonitor} from "./document-edit-change-monitor";

/**
 * @author Daniel de Oliveira
 */
@Component({
    moduleId: module.id,
    selector: 'relations-form',
    templateUrl: '../../templates/relations-form.html'
})

export class RelationsFormComponent{

    @Input() document: any;
    @Input() primary: string;
    @Input() relationFields: any;

    constructor(
        private saveService: DocumentEditChangeMonitor
    ) {}

    public markAsChanged() {
        this.saveService.setChanged();
    }
}