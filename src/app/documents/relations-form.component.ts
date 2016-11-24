import {Component, Input, OnChanges} from '@angular/core';
import {DocumentEditChangeMonitor} from "./document-edit-change-monitor";

/**
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
@Component({
    moduleId: module.id,
    selector: 'relations-form',
    templateUrl: './relations-form.html'
})

export class RelationsFormComponent implements OnChanges {

    @Input() document: any;
    @Input() primary: string;
    @Input() relationFields: any;
    
    private availableRelationFields: any;

    constructor(
        private saveService: DocumentEditChangeMonitor
    ) {}
    
    ngOnChanges() {

        this.availableRelationFields = [];

        for (var i in this.relationFields) {
            if (this.relationFields[i].domain.indexOf(this.document.resource.type) > -1) {
                this.availableRelationFields.push(this.relationFields[i]);
            }
        }
    }

    public markAsChanged() {
        this.saveService.setChanged();
    }
}