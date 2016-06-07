import {Component, Input} from '@angular/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {Entity} from "../core-services/entity";
import {PersistenceManager} from "./persistence-manager";

/**
 * @author Thomas Kleinke
 */
@Component({

    selector: 'valuelist',
    template: `<div>
    <select (change)="setValues($event.target.selectedOptions)" class="form-control" multiple>
        <option *ngFor="let item of field.valuelist" value="{{item}}" [selected]="isSelected(item)">{{item}}</option>
    </select>
</div>`,
    directives: [CORE_DIRECTIVES, COMMON_DIRECTIVES, FORM_DIRECTIVES]
})

export class ValuelistComponent {

    @Input() object: Entity;
    @Input() field: any;

    constructor(private persistenceManager: PersistenceManager) {}

    public setValues(selectedOptions: HTMLCollection) {

        this.object[this.field.fieldDefinition] = [];
        for (var i = 0; i < selectedOptions.length; i++) {
            this.object[this.field.fieldDefinition].push(selectedOptions.item(i).childNodes[0].nodeValue);
        }
        this.persistenceManager.load(this.object);
    }

    public isSelected(item: string) {

        if (this.object[this.field.fieldDefinition])
            return (this.object[this.field.fieldDefinition].indexOf(item) > -1);
        else
            return false;
    }

}