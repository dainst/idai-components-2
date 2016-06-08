import {Component, Input} from '@angular/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {Entity} from "../core-services/entity";
import {PersistenceManager} from "./persistence-manager";

export class ItemWrapper {
    public value: string;
}

/**
 * @author Daniel de Oliveira
 */
@Component({

    selector: 'fieldlist',
    template: `<div>
        <ul>
            <li *ngFor="let item of object[fieldDefinition.field]; let i=index">
                <div>{{object[fieldDefinition.field][i]}}</div>
            </li>
      
        </ul>
    </div>`,
    directives: [CORE_DIRECTIVES, COMMON_DIRECTIVES, FORM_DIRECTIVES]
})

export class FieldlistComponent {

    @Input() object: Entity;
    @Input() fieldDefinition: any;

    constructor(private persistenceManager: PersistenceManager) {}

    public markAsChanged() {
        this.persistenceManager.load(this.object);
    }
}