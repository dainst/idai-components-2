import {Component, Input} from '@angular/core';
import {DocumentEditChangeMonitor} from "./document-edit-change-monitor";
import {FieldDefinition} from '../configuration/field-definition';

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
    @Input() fieldDefinitions: Array<FieldDefinition>;

    public types : string[];

    constructor(
        private saveService: DocumentEditChangeMonitor
    ) {}
    
    public markAsChanged() {
        this.saveService.setChanged();
    }
}